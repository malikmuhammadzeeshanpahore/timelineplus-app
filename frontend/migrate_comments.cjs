const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'server', 'data.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
        process.exit(1);
    }
});

db.serialize(() => {
    // 1. meme_comments table (with parent_id for nested replies)
    db.run(`CREATE TABLE IF NOT EXISTS meme_comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        meme_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        parent_id INTEGER,
        text TEXT NOT NULL,
        likes_count INTEGER DEFAULT 0,
        dislikes_count INTEGER DEFAULT 0,
        status TEXT DEFAULT 'active',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
        if (err) console.error("Error creating meme_comments:", err.message);
        else console.log("✅ Created or verified meme_comments table.");
    });

    // 2. meme_comment_interactions table (likes/dislikes)
    db.run(`CREATE TABLE IF NOT EXISTS meme_comment_interactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        comment_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        type TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(comment_id, user_id)
    )`, (err) => {
        if (err) console.error("Error creating meme_comment_interactions:", err.message);
        else console.log("✅ Created or verified meme_comment_interactions table.");
    });

    // 3. meme_comment_reports table (reporting logic)
    db.run(`CREATE TABLE IF NOT EXISTS meme_comment_reports (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        comment_id INTEGER NOT NULL,
        reporter_id INTEGER NOT NULL,
        reason TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
        if (err) console.error("Error creating meme_comment_reports:", err.message);
        else console.log("✅ Created or verified meme_comment_reports table.");
    });

    // Add updated_at trigger for comments
    db.run(`
        CREATE TRIGGER IF NOT EXISTS UpdateMemeCommentTimestamp 
        AFTER UPDATE ON meme_comments
        FOR EACH ROW
        BEGIN
            UPDATE meme_comments SET updated_at = CURRENT_TIMESTAMP WHERE id = old.id;
        END;
    `, (err) => {
        if (err && !err.message.includes('already exists')) {
            console.log("Trigger error:", err.message);
        } else {
            console.log("✅ Set up UpdateMemeCommentTimestamp trigger.");
        }
    });
});

db.close(() => {
    console.log("Database migration complete. Exiting...");
});
