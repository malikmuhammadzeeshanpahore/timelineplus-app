import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, 'server/data.sqlite');

const verboseSqlite = sqlite3.verbose();
const db = new verboseSqlite.Database(dbPath);

console.log("Starting User Meta Migration...");

db.serialize(() => {
    // Add columns to users table
    db.run("ALTER TABLE users ADD COLUMN country TEXT", (err) => {
        if (err && !err.message.includes('duplicate column')) console.error("Error adding country:", err);
        else console.log("Verified country column.");
    });

    db.run("ALTER TABLE users ADD COLUMN device TEXT", (err) => {
        if (err && !err.message.includes('duplicate column')) console.error("Error adding device:", err);
        else console.log("Verified device column.");
    });
});

db.close(() => {
    console.log("Migration Complete.");
});
