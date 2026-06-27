const { Express, Request, Response } = require("express");
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

interface BasePayLoad {
    id: string;
    object: string;
    created: number;
    model: string;
}

export class SSEClient {
    private static instance: SSEClient | null = null;
    public static connection: typeof Response | null = null;

    public static getInstance(): SSEClient {
        if (!SSEClient.instance) {
            SSEClient.instance = new SSEClient();
        }
        return SSEClient.instance;
    }

    private constructor() {
        // init
    }

    public static connect(app: typeof Express) {
        app.get("/events", (req: typeof Request, res: typeof Response) => {
            res.set({
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
                Connection: "keep-alive",
                "Access-Control-Allow-Origin": "*",
            });

            res.status(200);
            res.flushHeaders();
            res.write('data: {"message": "Connected"}\n\n');

            SSEClient.connection = res;

            req.on("close", () => {
                SSEClient.connection = null;
            });
        });
    }

    public static end(): void {
        if (SSEClient.connection) {
            SSEClient.connection.write('data: {"message": "Connected"}\n\n');
            SSEClient.connection.end();
        }
    }

    public async stream_to_agent(res: typeof Response, result) {
        const basePayload: BasePayLoad = {
            id: "chat_" + Math.random().toString(36).substring(2, 11),
            object: "chat.completion.chunk",
            created: Date.now(),
            model: 'kakudai',
        };

        SSEClient.sendChunk(res, basePayload, { role: "assistant", content: "" });
        const fullText = result.choices[0].message.content || "";
        const words = fullText.split(" ");
        for (let i = 0; i < words.length; i++) {
            // Re-add the spacing except for the very first word
            const textChunk = (i === 0 ? "" : " ") + words[i];
            SSEClient.sendChunk(res, basePayload, { content: textChunk });
            await delay(60); // Simulate network pacing latency
        }

        // Chunk 1: Send tool metadata ONLY (id, name, type). No arguments yet!
        const toolCall = result.choices[0].message.tool_calls[0];
        const rawArgumentsStr = toolCall.function.arguments || "{}";
        SSEClient.sendChunk(res, basePayload, {
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

        SSEClient.sendChunk(res, basePayload, {
            tool_calls: [{ index: 0, function: { arguments: firstHalfArgs } }],
        });
        await delay(60);

        SSEClient.sendChunk(res, basePayload, {
            tool_calls: [{ index: 0, function: { arguments: secondHalfArgs } }],
        });
        await delay(60);

        // Final terminal chunk signaling that tool fragments are finished emitting
        SSEClient.sendChunk(res, basePayload, {}, "stop");
        SSEClient.sendChunk(res, basePayload, {}, "tool_calls");
        res.write("data: [DONE]\n\n");
        res.end();
    }

    private static sendChunk(res: typeof Response, base: BasePayLoad, delta, finishReason: string | null = null) {
        const payload = {
            ...base,
            choices: [{ index: 0, delta: delta, finish_reason: finishReason }],
        };
        res.write(`data: ${JSON.stringify(payload)}\n\n`);
    }
}
