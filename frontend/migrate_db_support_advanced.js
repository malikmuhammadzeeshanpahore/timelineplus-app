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
        const columns = [
            { name: 'unread_count', type: 'INTEGER DEFAULT 0' },
            { name: 'identity_type', type: "TEXT DEFAULT 'guest'" },
            { name: 'username', type: 'TEXT' },
            { name: 'email', type: 'TEXT' }
        ];

        columns.forEach(col => {
            db.run(`ALTER TABLE support_sessions ADD COLUMN ${col.name} ${col.type}`, (err) => {
                if (err) {
                    if (err.message.includes('duplicate column name')) {
                        console.log(`Column ${col.name} already exists.`);
                    } else {
                        console.error(`Error adding ${col.name}:`, err);
                    }
                } else {
                    console.log(`Column ${col.name} added.`);
                }
            });
        });
    });
}
