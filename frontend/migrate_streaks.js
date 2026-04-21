import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new (sqlite3.verbose()).Database(path.join(__dirname, 'server', 'data.sqlite'));

db.serialize(() => {
    db.run("ALTER TABLE users ADD COLUMN last_login_claim_date DATETIME", (err) => {
        if (err) console.log("last_login_claim_date possibly exists:", err.message);
        else console.log("last_login_claim_date added.");
    });
    db.run("ALTER TABLE users ADD COLUMN current_streak INTEGER DEFAULT 0", (err) => {
        if (err) console.log("current_streak possibly exists:", err.message);
        else console.log("current_streak added.");
    });
});
