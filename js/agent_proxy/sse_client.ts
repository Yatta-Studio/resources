import type { OpenAIContext, ChatCompletionChunkDelta } from "./index";
const { Express, Request, Response } = require("express");
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class SSEClient {
    private static instance: SSEClient | null = null;
    public static connection: typeof Response | null = null;

    public static getInstance(): SSEClient {
        if (!SSEClient.instance) {
            SSEClient.instance = new SSEClient();
        }
        return SSEClient.instance;
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

    public async stream_to_agent(res: typeof Response, result: OpenAIContext) {
        const basePayload: OpenAIContext = {
            id: `chatcmpl-${crypto.randomUUID()}`,
            object: "chat.completion",
            created: Math.floor(Date.now() / 1000),
            model: 'kakudai',
        };
        SSEClient.sendChunk(res, basePayload, { role: "assistant", content: "" });
        SSEClient.sendChunk(res, basePayload, {}, "stop");
        SSEClient.sendChunk(res, basePayload, {}, "tool_calls");
        res.write("data: [DONE]\n\n");
        res.end();
    }

    private static sendChunk(res: typeof Response, base: OpenAIContext, delta: ChatCompletionChunkDelta, finishReason: string | null = null) {
        const payload = {
            ...base,
            choices: [{ index: 0, delta: delta, finish_reason: finishReason }],
        };
        res.write(`data: ${JSON.stringify(payload)}\n\n`);
    }
}
