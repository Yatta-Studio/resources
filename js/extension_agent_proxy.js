const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const { createLogger, format, transports } = require("winston");
const { combine, timestamp, printf } = format;

const app = express();
app.use(cors());
app.use(express.json());

// Define custom log format
const myFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

const logger = createLogger({
    level: "info", // Set the minimum log level
    format: combine(timestamp(), myFormat),
    transports: [
        // Write logs to console
        new transports.Console(),
        // Write all logs to application.log
        new transports.File({ filename: "application.log" }),
    ],
});

let SSEClient;

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
        SSEClient.end();
    });
});

// Stores pending HTTP requests awaiting extension fulfillment
const pendingRequests = new Map();

app.post('/v1/response', async (req, res) => {
    if (!SSEClient) return res.status(503).json({ error: 'No extension connected' });

    const requestId = crypto.randomUUID();
    
    try {
        const extensionResult = await new Promise((resolve, reject) => {
            const timeoutId = setTimeout(() => {
                if (pendingRequests.has(requestId)) {
                    pendingRequests.delete(requestId);
                    reject(new Error('Timeout'));
                }
            }, 30000);

            pendingRequests.set(requestId, { resolve, timeoutId });
            sseClients.forEach(c => c.write(`data: ${JSON.stringify({ requestId, payload: req.body })}\n\n`));
        });

        res.status(200).json({ success: true, data: extensionResult });
    } catch (err) {
        res.status(504).json({ error: err.message }); 
    }
});

process.on('SIGTERM', () => {
    sseClients.forEach((clientRes) => {
        clientRes.write('event: server-shutdown\ndata: {}\n\n');
        clientRes.end();
    });
    sseClients = [];
});

app.listen(3000, () => console.log("Server running on port 3000"));
