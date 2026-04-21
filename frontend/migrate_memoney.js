import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, 'server', 'data.sqlite');
const db = new sqlite3.Database(dbPath);

console.log('Running Memoney Database Migration...');

db.serialize(() => {
    // Add columns to existing users table
    db.run(`ALTER TABLE users ADD COLUMN memoney_balance INTEGER DEFAULT 0`, (err) => {
        if (err) console.log('memoney_balance already exists or error:', err.message);
        else console.log('Added memoney_balance successfully.');
    });

    db.run(`ALTER TABLE users ADD COLUMN last_meme_post_date DATETIME`, (err) => {
        if (err) console.log('last_meme_post_date already exists or error:', err.message);
        else console.log('Added last_meme_post_date successfully.');
    });

    db.run(`ALTER TABLE users ADD COLUMN username TEXT UNIQUE`, (err) => {
        if (err) console.log('username already exists or error:', err.message);
        else console.log('Added username successfully.');
    });

    // Create memes table
    db.run(`CREATE TABLE IF NOT EXISTS memes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        image_url TEXT,
        caption TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id)
    )`, (err) => {
        if (err) console.error('Error creating memes table:', err.message);
        else console.log('memes table created or already exists.');
    });

    // Create meme_interactions table
    db.run(`CREATE TABLE IF NOT EXISTS meme_interactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        meme_id INTEGER,
        user_id INTEGER,
        interaction_type TEXT,
        comment_text TEXT,
        platform TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(meme_id) REFERENCES memes(id),
        FOREIGN KEY(user_id) REFERENCES users(id)
    )`, (err) => {
        if (err) console.error('Error creating meme_interactions table:', err.message);
        else console.log('meme_interactions table created or already exists.');
    });

    // Create follows table
    db.run(`CREATE TABLE IF NOT EXISTS follows (
        follower_id INTEGER,
        following_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY(follower_id, following_id),
        FOREIGN KEY(follower_id) REFERENCES users(id),
        FOREIGN KEY(following_id) REFERENCES users(id)
    )`, (err) => {
        if (err) console.error('Error creating follows table:', err.message);
        else console.log('follows table created or already exists.');

        console.log('Migration completed.');
        db.close();
    });
});
