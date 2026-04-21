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

console.log('Migrating database for Meme Dislikes feature...');

db.serialize(() => {
    // 1. Add dislikes_count to memes
    db.run(`ALTER TABLE memes ADD COLUMN dislikes_count INTEGER DEFAULT 0`, (err) => {
        if (err && !err.message.includes('duplicate column name')) {
            console.error('Error adding dislikes_count to memes:', err.message);
        } else {
            console.log('✓ Added dislikes_count to memes or it already exists');
        }
    });

    // 2. Create meme_dislikes table
    db.run(`CREATE TABLE IF NOT EXISTS meme_dislikes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        meme_id INTEGER,
        user_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(meme_id, user_id),
        FOREIGN KEY(meme_id) REFERENCES memes(id),
        FOREIGN KEY(user_id) REFERENCES users(id)
    )`, (err) => {
        if (err) {
            console.error('Error creating meme_dislikes table:', err.message);
        } else {
            console.log('✓ Created meme_dislikes table (if missing)');
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
