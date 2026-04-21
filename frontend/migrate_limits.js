import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, 'server/data.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) console.error(err.message);
    else console.log('Connected to SQLite database.');
});

db.serialize(() => {
    // Check if columns exist, if not add them
    db.run("ALTER TABLE users ADD COLUMN campaign_limit INTEGER DEFAULT 3", (err) => {
        if (err && !err.message.includes('duplicate column name')) console.error(err.message);
        else console.log('Added campaign_limit column.');
    });

    db.run("ALTER TABLE users ADD COLUMN campaign_tier INTEGER DEFAULT 0", (err) => {
        if (err && !err.message.includes('duplicate column name')) console.error(err.message);
        else console.log('Added campaign_tier column.');
    });
});

db.close();
