import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Target the one in server/ directory as per find_by_name result
const dbPath = path.resolve(__dirname, 'server/data.sqlite');

console.log(`Targeting Database: ${dbPath}`);

if (!fs.existsSync(dbPath)) {
    console.error("Database file does not exist at:", dbPath);
    process.exit(1);
}

const verboseSqlite = sqlite3.verbose();
const db = new verboseSqlite.Database(dbPath);

db.serialize(() => {
    // 1. Check if table exists
    db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='offers'", (err, row) => {
        if (err) {
            console.error("Error checking table:", err);
            db.close();
            return;
        }
        if (!row) {
            console.error("Table 'offers' DOES NOT EXIST. Creating it now...");
            // Create table if missing (fallback)
            db.run(`CREATE TABLE IF NOT EXISTS offers (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                current_rate REAL,
                status TEXT,
                last_updated_by TEXT,
                created_at TEXT
            )`, (err) => {
                if (err) { console.error("Error creating table:", err); db.close(); }
                else {
                    console.log("Table 'offers' created.");
                    addColumns();
                }
            });
        } else {
            console.log("Table 'offers' exists. Proceeding to add columns.");
            addColumns();
        }
    });

    function addColumns() {
        const columns = [
            "ALTER TABLE offers ADD COLUMN service_type TEXT;",
            "ALTER TABLE offers ADD COLUMN link TEXT;",
            "ALTER TABLE offers ADD COLUMN quantity INTEGER;"
        ];

        let completed = 0;
        columns.forEach(query => {
            db.run(query, (err) => {
                if (err) {
                    if (err.message.includes('duplicate column name')) {
                        console.log(`Column already exists (skipped): ${query}`);
                    } else {
                        console.error("Error adding column:", err.message);
                    }
                } else {
                    console.log("Column added successfully.");
                }
                completed++;
                if (completed === columns.length) {
                    verifyAndClose();
                }
            });
        });
    }

    function verifyAndClose() {
        db.all("PRAGMA table_info(offers)", (err, rows) => {
            if (err) console.error(err);
            else {
                const columnNames = rows.map(r => r.name);
                console.log("Current Schema:", columnNames);
                if (columnNames.includes('service_type') && columnNames.includes('link') && columnNames.includes('quantity')) {
                    console.log("SUCCESS: All columns verified.");
                } else {
                    console.error("FAILURE: Missing columns.");
                }
            }
            db.close();
        });
    }
});
