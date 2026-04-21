import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, 'server/data.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) return console.error(err.message);
    console.log('Connected to DB');
});

db.serialize(() => {
    // Add columns if not exist
    const columns = ['tid', 'screenshot', 'sender_account'];
    columns.forEach(col => {
        db.run(`ALTER TABLE transactions ADD COLUMN ${col} TEXT`, (err) => {
            if (err && err.message.includes('duplicate column')) {
                console.log(`Column ${col} already exists.`);
            } else if (err) {
                console.error(`Error adding ${col}:`, err.message);
            } else {
                console.log(`Added column ${col}`);
            }
        });
    });

    // Create app_config if missing (just in case)
    db.run(`CREATE TABLE IF NOT EXISTS app_config (
        key TEXT PRIMARY KEY,
        value TEXT
    )`, (err) => {
        if (!err) console.log('Checked app_config table');
    });

    db.run(`INSERT OR IGNORE INTO app_config (key, value) VALUES ('reset_version', '1')`, (err) => {
        if (!err) console.log('Checked reset_version');
    });
});

setTimeout(() => {
    console.log('Migration complete.');
    // Keep process alive briefly for changes to flush
}, 1000);
