import type { Express, Request, Response } from "express";
const express = require("express");
const cors = require("cors");
const logger = require("./logger").default;
const { SSEClient } = require("./sse_client");
const app: Express = express();

const pending_requests = new Map();

app.use(cors());
app.use(express.json());
const sseClient = SSEClient.getInstance();
sseClient.connect(app);

app.post("/v1/chat/completions", async (req: Request, res: Response): Promise<void> => {
    if (!sseClient.connection)
        res.status(503).json({ error: "No extension connected" });

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
            res.end(JSON.stringify(result));
        }

        res.writeHead(200, {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
        });

        await sseClient.stream_to_agent(res, result);
    } catch (err) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(
            JSON.stringify({ error: "Invalid JSON payload layout" }),
        );
        // res.status(504).json({ error: err.message });
    }
});

app.post("/v1/chat_response", async (req, res): Promise<void> => {
    const { request_id, result } = req.body;

    if (!request_id || !pending_requests.has(request_id)) {
        res.status(404).json({ error: "Request ID not found or already expired" });
    }

    const { resolve, timeout_id } = pending_requests.get(request_id);

    clearTimeout(timeout_id);
    pending_requests.delete(request_id);

    resolve(result);

    res.status(200).json({ status: "acknowledged" });
});

process.on("SIGTERM", () => {
   sseClient.end();
});

app.listen(3000, () => console.log("Server running on port 3000"));

export {};