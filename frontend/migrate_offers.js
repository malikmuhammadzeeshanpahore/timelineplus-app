import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, 'server/data.sqlite');

const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    // Offers Table
    db.run(`CREATE TABLE IF NOT EXISTS offers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        current_rate REAL,
        status TEXT DEFAULT 'pending', -- pending, accepted, completed
        last_updated_by TEXT, -- 'user', 'admin'
        created_at TEXT,
        FOREIGN KEY(user_id) REFERENCES users(id)
    )`);
    console.log("Offers table created.");
});
