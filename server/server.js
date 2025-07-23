const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

// POST /schedule — add a class period
app.post("/schedule", (req, res) => {
    const { userId, period, subject } = req.body;
    db.run(
        `INSERT INTO schedules (user_id, period, subject)
        VALUES (?, ?, ?)`,
        [userId, period, subject],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID });
        }
    );
});

// GET /schedule/:userId — get that user's schedule
app.get("/schedule/:userId", (req, res) => {
    const { userId } = req.params;
    db.all(
        `SELECT * FROM schedules WHERE user_id = ? ORDER BY period ASC`,
        [userId],
        (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(rows);
        }
    );
});


const server = app.listen(3001, () => {
    console.log("Server running on http://localhost:3001");
});

process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    server.close(() => {
        console.log('Process terminated');
    });
});

process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully');
    server.close(() => {
        console.log('Process terminated');
    });
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});