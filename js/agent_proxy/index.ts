const express = require("express");
const cors = require("cors");
const logger = require("./logger").default;
const app = express();
app.use(cors());
app.use(express.json());

app.get("/", () => {
    logger.info('hello world');
});

app.listen(3000, () => console.log("Server running on port 3000"));

export {};