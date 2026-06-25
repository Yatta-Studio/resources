const { createLogger, format, transports, TransformableInfo } = require("winston");
const { combine, timestamp, printf } = format;

const myFormat = printf(({ timestamp, level, message, ...metadata }: typeof TransformableInfo) => {
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

export default logger;