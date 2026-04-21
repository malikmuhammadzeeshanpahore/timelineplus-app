
import sqlite3 from 'sqlite3';
import path from 'path';

// Correct path based on server/db.js
const dbPath = '/home/muhammad_zeeshan/Documents/Zeeshan/timeline-earn/server/data.sqlite';
const db = new sqlite3.Database(dbPath);

console.log(`Connected to ${dbPath}`);

db.serialize(() => {
    // Check if column exists
    db.all("PRAGMA table_info(users)", (err, rows) => {
        if (err) {
            console.error("Error fetching table info:", err);
            return;
        }

        const hasYoutube = rows.some(row => row.name === 'youtube_channel_id');

        if (!hasYoutube) {
            console.log("Adding youtube_channel_id column...");
            db.run("ALTER TABLE users ADD COLUMN youtube_channel_id TEXT", (err) => {
                if (err) console.error("Error adding column:", err);
                else console.log("Column youtube_channel_id added successfully.");
            });
        } else {
            console.log("Column youtube_channel_id already exists.");
        }
    });
});
