import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, 'server/data.sqlite'); // Correct path relative to root run

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
        process.exit(1);
    }
    console.log('Connected to database at', dbPath);
});

async function migrate() {
    console.log("Starting Migration: Adding Campaign Limit Columns...");

    // Helper to run SQL
    const run = (sql) => new Promise((resolve, reject) => {
        db.run(sql, function (err) {
            if (err) {
                if (err.message.includes('duplicate column name')) {
                    console.log(`Column already exists (Safe to ignore): ${sql.split('ADD COLUMN')[1]}`);
                    resolve();
                } else {
                    reject(err);
                }
            } else {
                console.log(`Executed: ${sql}`);
                resolve();
            }
        });
    });

    try {
        await run(`ALTER TABLE users ADD COLUMN campaign_limit INTEGER DEFAULT 3`);
        await run(`ALTER TABLE users ADD COLUMN campaign_tier INTEGER DEFAULT 0`);

        console.log("Migration Complete!");
    } catch (error) {
        console.error("Migration Failed:", error);
    } finally {
        db.close();
    }
}

migrate();
