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
        // Add name column to support_sessions
        db.run(`ALTER TABLE support_sessions ADD COLUMN name TEXT`, (err) => {
            if (err) {
                if (err.message.includes('duplicate column name')) {
                    console.log('Column name already exists in support_sessions.');
                } else {
                    console.error('Error adding name column:', err);
                }
            } else {
                console.log('Column name added to support_sessions.');
            }
        });
    });
}
