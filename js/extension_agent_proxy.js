const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const { createLogger, format, transports } = require("winston");
const { combine, timestamp, printf } = format;

const app = express();
app.use(cors());
app.use(express.json());

// Stores active SSE clients
let sseClients = [];

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

// Stores pending HTTP requests awaiting extension fulfillment
// Key: requestId, Value: { resolve, reject, timeoutId }
const pendingRequests = new Map();

// --- 1. SSE Stream Endpoint for the Extension ---
app.get("/events", (req, res) => {
    res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "Access-Control-Allow-Origin": "*",
    });

    // Keep connection alive
    res.write('data: {"status": "connected"}\n\n');

    sseClients.push(res);

    req.on("close", () => {
        sseClients = sseClients.filter((client) => client !== res);
    });
});

app.listen(3000, () => console.log("Server running on port 3000"));
