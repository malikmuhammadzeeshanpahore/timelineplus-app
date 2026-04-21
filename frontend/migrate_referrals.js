import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, 'server/data.sqlite');

const verboseSqlite = sqlite3.verbose();
const db = new verboseSqlite.Database(dbPath);

console.log("Starting Referrals Migration...");

db.serialize(() => {
    // Add columns to users table
    db.run("ALTER TABLE users ADD COLUMN referred_by_id INTEGER", (err) => {
        if (err && !err.message.includes('duplicate column')) console.error("Error adding referred_by_id:", err);
        else console.log("Verified referred_by_id column.");
    });

    db.run("ALTER TABLE users ADD COLUMN first_offer_completed INTEGER DEFAULT 0", (err) => {
        if (err && !err.message.includes('duplicate column')) console.error("Error adding first_offer_completed:", err);
        else console.log("Verified first_offer_completed column.");
    });

    db.run("ALTER TABLE users ADD COLUMN payout_method TEXT", (err) => {
        if (err && !err.message.includes('duplicate column')) console.error("Error adding payout_method:", err);
        else console.log("Verified payout_method column.");
    });

    // We also need a way to track the referrals easily, but the recursive logic can be done via queries.
});

db.close(() => {
    console.log("Migration Complete.");
});
