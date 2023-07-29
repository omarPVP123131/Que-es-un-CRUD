const express = require("express");
const db = require("./database");

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static("public"));

// Create a new task
app.post("/api/tasks", (req, res) => {
    const { text } = req.body;
    if (!text) {
        return res.status(400).json({ error: "Task text is required." });
    }

    const insertQuery = "INSERT INTO tasks (text) VALUES (?)";
    db.run(insertQuery, text, function (err) {
        if (err) {
            console.error("Error inserting task:", err.message);
            return res.status(500).json({ error: "Internal server error." });
        }

        const taskId = this.lastID;
        res.status(201).json({ id: taskId, text });
    });
});

// Get all tasks
app.get("/api/tasks", (req, res) => {
    const selectQuery = "SELECT * FROM tasks";
    db.all(selectQuery, (err, rows) => {
        if (err) {
            console.error("Error getting tasks:", err.message);
            return res.status(500).json({ error: "Internal server error." });
        }
        res.json(rows);
    });
});

// Update a task
app.put("/api/tasks/:id", (req, res) => {
    const taskId = req.params.id;
    const { text } = req.body;
    if (!text) {
        return res.status(400).json({ error: "Task text is required." });
    }

    const updateQuery = "UPDATE tasks SET text = ? WHERE id = ?";
    db.run(updateQuery, [text, taskId], err => {
        if (err) {
            console.error("Error updating task:", err.message);
            return res.status(500).json({ error: "Internal server error." });
        }
        res.sendStatus(204);
    });
});

// Delete a task
app.delete("/api/tasks/:id", (req, res) => {
    const taskId = req.params.id;
    const deleteQuery = "DELETE FROM tasks WHERE id = ?";
    db.run(deleteQuery, taskId, err => {
        if (err) {
            console.error("Error deleting task:", err.message);
            return res.status(500).json({ error: "Internal server error." });
        }
        res.sendStatus(204);
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
