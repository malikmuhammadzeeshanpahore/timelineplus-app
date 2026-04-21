
import sqlite3 from 'sqlite3';
import path from 'path';

const dbPath = '/home/muhammad_zeeshan/Documents/Zeeshan/timeline-earn/dev.db';
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, rows) => {
        if (err) {
            console.error("Error:", err);
        } else {
            console.log("Tables:", rows);
        }
    });
});
