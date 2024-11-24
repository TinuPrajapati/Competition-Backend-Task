const express = require("express");
const app = express();

app.use(express.json());

// In-memory store for request counts
const requestCounts = {};
const REQUEST_LIMIT = 5;
const TIME_WINDOW = 60000; // 1 minute in milliseconds

app.use((req, res, next) => {
    const ip = req.ip; // Get the client's IP address

    // Initialize request count for the IP if it doesn't exist
    if (!requestCounts[ip]) {
        requestCounts[ip] = { count: 0, timestamp: Date.now() };
    }

    const currentTime = Date.now();
    const timeElapsed = currentTime - requestCounts[ip].timestamp;

    // Reset the count if the time window has passed
    if (timeElapsed > TIME_WINDOW) {
        requestCounts[ip] = { count: 1, timestamp: currentTime };
    } else {
        // Increment the count
        requestCounts[ip].count += 1;
    }

    // Check if the request limit has been reached
    if (requestCounts[ip].count > REQUEST_LIMIT) {
        return res.status(429).json({ error: "Too many requests. Please try again later." });
    }

    next();
});

app.get("/", (req, res) => {
    res.json({
        "quote": "Be so confident in who you are that on one's opinion, rejection or behaviour can reock you",
        "author": "unknown"
    });
});

app.listen(8080, () => {
    console.log("Server is running on port 8080");
});