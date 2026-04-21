import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, 'server/data.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        migrate();
    }
});

function migrate() {
    db.serialize(() => {
        // Support Sessions Table
        db.run(`CREATE TABLE IF NOT EXISTS support_sessions (
            id TEXT PRIMARY KEY,
            user_ip TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            last_active_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            status TEXT DEFAULT 'active'
        )`, (err) => {
            if (err) console.error('Error creating support_sessions table:', err);
            else console.log('support_sessions table created/verified.');
        });

        // Support Messages Table
        db.run(`CREATE TABLE IF NOT EXISTS support_messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id TEXT,
            sender TEXT,
            type TEXT DEFAULT 'text',
            content TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(session_id) REFERENCES support_sessions(id)
        )`, (err) => {
            if (err) console.error('Error creating support_messages table:', err);
            else console.log('support_messages table created/verified.');
        });
    });
}
