/**
 * PRODUCTION CLEANUP SCRIPT - cleanup_usernames.js
 * 
 * Run this on your server to clear all stale usernames from deleted users.
 * Usage: node cleanup_usernames.js
 * 
 * This will:
 *   1. Show all users with usernames currently set
 *   2. Clear any empty string usernames (set to NULL)
 *   3. Show final state
 */

import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const sqlite = sqlite3.verbose();

const dbPath = path.resolve(__dirname, 'server/data.sqlite');
const db = new sqlite.Database(dbPath, (err) => {
    if (err) return console.error('Failed to connect:', err.message);
    console.log('✅ Connected to:', dbPath);
    runCleanup();
});

function runCleanup() {
    db.serialize(() => {
        console.log('\n📋 Current users with usernames:');
        db.all(`SELECT id, username, email, role FROM users WHERE username IS NOT NULL AND username != ''`, (err, rows) => {
            if (err) return console.error(err);
            if (rows.length === 0) {
                console.log('  (none found)');
            } else {
                rows.forEach(r => console.log(`  ID ${r.id}: @${r.username} (${r.email}) [${r.role}]`));
            }

            console.log('\n🧹 Clearing empty/null usernames...');
            db.run(`UPDATE users SET username = NULL WHERE username = ''`, function(err) {
                if (err) return console.error(err);
                console.log(`  → Fixed ${this.changes} row(s)`);

                // Optionally clear a specific username
                const targetUsername = 'zeeshan';
                db.get(`SELECT id, username FROM users WHERE LOWER(username) = LOWER(?)`, [targetUsername], (err, row) => {
                    if (row) {
                        console.log(`\n⚠️  Found username "${targetUsername}" on user ID ${row.id}`);
                        db.run(`UPDATE users SET username = NULL WHERE LOWER(username) = LOWER(?)`, [targetUsername], function(err) {
                            if (!err) console.log(`  ✅ Cleared "${targetUsername}" username — now available for new users!`);
                            showFinal();
                        });
                    } else {
                        console.log(`\n✅ Username "${targetUsername}" is NOT in the database — it's free for use.`);
                        showFinal();
                    }
                });
            });
        });
    });
}

function showFinal() {
    console.log('\n📊 Final database state:');
    db.all(`SELECT id, username, email, role FROM users`, (err, rows) => {
        if (err) return console.error(err);
        rows.forEach(r => console.log(`  ID ${r.id}: username=${r.username || 'NULL'}, email=${r.email}, role=${r.role}`));
        console.log(`\n✅ Done! Total users: ${rows.length}`);
        db.close();
    });
}
