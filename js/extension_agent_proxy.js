const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const { createLogger, format, transports } = require("winston");
const { combine, timestamp, printf } = format;

const app = express();
app.use(cors());
app.use(express.json());

const myFormat = printf(({ timestamp, level, message, ...metadata }) => {
    let msg = `${timestamp} [${level.toUpperCase()}]: ${message}`;

    if (Object.keys(metadata).length > 0) {
        msg += ` ${JSON.stringify(metadata, null, 2)}`;
    }

    return msg;
});

const logger = createLogger({
    format: combine(timestamp(), myFormat),
    transports: [
        new transports.Console(),
        new transports.File({ filename: "application.log" }),
    ],
});

let SSEClient;
const pending_requests = new Map();
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/*
    Sample response
    {
        model: "local-static-model",
        choices: [
            {
                index: 0,
                message: {
                    role: "assistant",
                    content: null,
                    tool_calls: [
                        {
                            id: "call_x9y2",
                            type: "function",
                            function: {
                                name: "get_stock_price",
                                arguments: '{"ticker":"MSFT"}',
                            },
                        },
                    ],
                },
                finish_reason: "tool_calls",
            },
        ],
    };

    {
        model: "local-static-model",
        choices: [
            {
                index: 0,
                message: {
                    role: "assistant",
                    content:
                        "This response was generated statically all at once and split up!",
                },
                finish_reason: "stop",
            },
        ],
    };
*/

/*
    SSE emulation
*/
async function streamTextInChunks(res, fullResult) {
    const fullText = fullResult.choices[0].message.content || "";
    // Split text by space characters to stream word-by-word
    const words = fullText.split(" ");
    const basePayload = createBasePayload(fullResult.model);

    // Send the initial chunk stating the assistant role
    sendChunk(res, basePayload, { role: "assistant", content: "" });

    for (let i = 0; i < words.length; i++) {
        // Re-add the spacing except for the very first word
        const textChunk = (i === 0 ? "" : " ") + words[i];
        sendChunk(res, basePayload, { content: textChunk });
        await delay(60); // Simulate network pacing latency
    }

    // Final terminal chunk signaling completion
    sendChunk(res, basePayload, {}, "stop");
    sendDone(res);
}

async function streamToolInChunks(res, fullResult) {
    const toolCall = fullResult.choices[0].message.tool_calls[0];
    const basePayload = createBasePayload(fullResult.model);
    const rawArgumentsStr = toolCall.function.arguments || "{}";

    // Chunk 1: Send tool metadata ONLY (id, name, type). No arguments yet!
    sendChunk(res, basePayload, {
        role: "assistant",
        tool_calls: [
            {
                index: 0,
                id: toolCall.id,
                type: "function",
                function: { name: toolCall.function.name },
            },
        ],
    });
    await delay(60);

    // Chunk 2 & 3: Cut the arguments string exactly in half to simulate a real stream
    const midPoint = Math.floor(rawArgumentsStr.length / 2);
    const firstHalfArgs = rawArgumentsStr.substring(0, midPoint);
    const secondHalfArgs = rawArgumentsStr.substring(midPoint);

    sendChunk(res, basePayload, {
        tool_calls: [{ index: 0, function: { arguments: firstHalfArgs } }],
    });
    await delay(60);

    sendChunk(res, basePayload, {
        tool_calls: [{ index: 0, function: { arguments: secondHalfArgs } }],
    });
    await delay(60);

    // Final terminal chunk signaling that tool fragments are finished emitting
    sendChunk(res, basePayload, {}, "tool_calls");
    sendDone(res);
}

function createBasePayload(modelName) {
    return {
        id: "chat_" + Math.random().toString(36).substring(2, 11),
        object: "chat.completion.chunk",
        created: Math.floor(Date.now() / 1000),
        model: modelName,
    };
}

function sendChunk(res, base, delta, finishReason = null) {
    const payload = {
        ...base,
        choices: [{ index: 0, delta: delta, finish_reason: finishReason }],
    };
    res.write(`data: ${JSON.stringify(payload)}\n\n`);
}

function sendDone(res) {
    res.write("data: [DONE]\n\n");
    res.end();
}

// SSE
app.get("/events", (req, res) => {
    res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "Access-Control-Allow-Origin": "*",
    });

    // Keep connection alive
    res.write('data: {"status": "connected"}\n\n');

    SSEClient = res;

    req.on("close", () => {
        SSEClient = null;
    });
});

app.post("/v1/chat/completions", async (req, res) => {
    if (!SSEClient)
        return res.status(503).json({ error: "No extension connected" });

    const payload = req.body;
    const request_id = crypto.randomUUID();

    try {
        const result = await new Promise((resolve, reject) => {
            const timeout_id = setTimeout(() => {
                if (pending_requests.has(request_id)) {
                    pending_requests.delete(request_id);
                    reject(new Error("Timeout"));
                }
            }, 30000);

            pending_requests.set(request_id, { resolve, timeout_id });

            logger.info("request ID", request_id);
            logger.info("agent request payload", req.body);

            SSEClient.write(
                `data: ${JSON.stringify({ request_id, payload })}\n\n`,
            );
        });

        if (!payload.stream) {
            res.writeHead(200, { "Content-Type": "application/json" });
            return res.end(JSON.stringify(result));
        }

        // Process result for streaming:
        res.writeHead(200, {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
        });

        await streamToolInChunks(res, result);
        await streamTextInChunks(res, result);
    } catch (err) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(
            JSON.stringify({ error: "Invalid JSON payload layout" }),
        );
        // res.status(504).json({ error: err.message });
    }
});

app.post("/v1/chat_response", async (req, res) => {
    const { request_id, result } = req.body;

    if (!request_id || !pending_requests.has(request_id)) {
        return res
            .status(404)
            .json({ error: "Request ID not found or already expired" });
    }

    const { resolve, timeout_id } = pending_requests.get(request_id);

    // Clean up memory and timers
    clearTimeout(timeout_id);
    pending_requests.delete(request_id);

    resolve(result);

    res.status(200).json({ status: "acknowledged" });
});

process.on("SIGTERM", () => {
    SSEClient.write("event: server-shutdown\ndata: {}\n\n");
    SSEClient.end();
});

app.listen(3000, () => console.log("Server running on port 3000"));
