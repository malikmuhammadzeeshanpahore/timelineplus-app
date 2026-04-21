import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'server', 'data.sqlite');

const db = new (sqlite3.verbose()).Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err);
        process.exit(1);
    }
});

console.log('Migrating database for Meme Views (Session ID) feature...');

db.serialize(() => {
    // Create meme_views table
    db.run(`CREATE TABLE IF NOT EXISTS meme_views (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        meme_id INTEGER,
        session_id TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(meme_id, session_id),
        FOREIGN KEY(meme_id) REFERENCES memes(id)
    )`, (err) => {
        if (err) {
            console.error('Error creating meme_views table:', err.message);
        } else {
            console.log('✓ Created meme_views table (if missing)');
        }
    });

    // Make sure views column exists on memes (already should)
    db.run(`ALTER TABLE memes ADD COLUMN views INTEGER DEFAULT 0`, (err) => {
        if (err && !err.message.includes('duplicate column name')) {
            console.error('Error adding views to memes:', err.message);
        } else {
            console.log('✓ views column confirmed passing');
        }
    });
});

db.close((err) => {
    if (err) {
        console.error('Error closing DB', err);
    } else {
        console.log('Migration completed successfully!');
    }
});
