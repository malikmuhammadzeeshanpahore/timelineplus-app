import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, 'data.sqlite');
const verboseSqlite = sqlite3.verbose();
const db = new verboseSqlite.Database(dbPath);

db.serialize(() => {
    // Add new columns to offers table
    const columns = [
        "ALTER TABLE offers ADD COLUMN service_type TEXT;",
        "ALTER TABLE offers ADD COLUMN link TEXT;",
        "ALTER TABLE offers ADD COLUMN quantity INTEGER;"
    ];

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
        });
    });
});

db.close();
