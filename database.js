const sqlite3 = require("sqlite3").verbose();

const DB_FILE = "./data.db";

const db = new sqlite3.Database(DB_FILE, err => {
    if (err) {
        console.error("Error opening database:", err.message);
    } else {
        console.log("Connected to the SQLite database.");
        createTasksTable();
    }
});

function createTasksTable() {
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            text TEXT NOT NULL
        )
    `;

    db.run(createTableQuery, err => {
        if (err) {
            console.error("Error creating tasks table:", err.message);
        } else {
            console.log("Tasks table created.");
        }
    });

    // Manejador de eventos para capturar errores en la creación de la tabla
    db.on("error", err => {
        console.error("Database error:", err.message);
    });
}

module.exports = db;
