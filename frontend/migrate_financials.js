import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, 'server/data.sqlite');

const verboseSqlite = sqlite3.verbose();
const db = new verboseSqlite.Database(dbPath);

console.log("Starting Migration...");

db.serialize(() => {
    // 1. platform_stats (Already added total_tax_revenue previously, safe to re-check)
    db.run("ALTER TABLE platform_stats ADD COLUMN total_tax_revenue REAL DEFAULT 0", (err) => {
        if (err && !err.message.includes('duplicate column')) console.error("Error adding total_tax_revenue:", err);
    });

    // 2. campaigns table - CREATE IF NOT EXISTS
    db.run(`CREATE TABLE IF NOT EXISTS campaigns (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        title TEXT,
        description TEXT,
        reward_per_task REAL,
        total_tasks INTEGER,
        status TEXT,
        completed_count INTEGER DEFAULT 0,
        created_at TEXT,
        FOREIGN KEY(user_id) REFERENCES users(id)
    )`, (err) => {
        if (err) console.error("Error creating campaigns table:", err);
        else {
            console.log("Verified campaigns table.");
            // Try adding completed_count in case table existed but lacked column
            db.run("ALTER TABLE campaigns ADD COLUMN completed_count INTEGER DEFAULT 0", (err) => {
                // Ignore if duplicate column
            });
        }
    });

    // 3. task_completions table
    db.run(`CREATE TABLE IF NOT EXISTS task_completions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        campaign_id INTEGER,
        user_id INTEGER,
        reward REAL,
        created_at TEXT,
        FOREIGN KEY(campaign_id) REFERENCES campaigns(id),
        FOREIGN KEY(user_id) REFERENCES users(id)
    )`, (err) => {
        if (err) console.error("Error creating task_completions:", err);
        else console.log("Verified task_completions table.");
    });
});

db.close();
