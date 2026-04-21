/**
 * PRODUCTION FIX SCRIPT — fix_production.js
 * 
 * Run this on your server to:
 *   1. Reset admin credentials
 *   2. Clear stale usernames from deleted users
 *   3. Verify database state
 * 
 * Usage (run from /var/www/timeline-earn or wherever your app lives):
 *   node fix_production.js
 */

import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const sqlite = sqlite3.verbose();

const dbPath = path.resolve(__dirname, 'server/data.sqlite');
const db = new sqlite.Database(dbPath, (err) => {
    if (err) return console.error('❌ Failed to connect:', err.message);
    console.log('✅ Connected to:', dbPath);
    run();
});

const ADMIN_EMAIL    = 'admin@timelineplus.site';
const ADMIN_PASSWORD = 'Admin@Timeline2026';

function run() {
    db.serialize(() => {
        console.log('\n[1/4] Checking admin account...');
        db.get(`SELECT * FROM users WHERE role = 'admin' AND is_super_admin = 1`, (err, row) => {
            if (!row) {
                console.log('  → No admin found. Creating...');
                db.run(`INSERT INTO users (name, email, password, role, balance, is_super_admin) VALUES (?, ?, ?, 'admin', 0, 1)`,
                    ['Super Admin', ADMIN_EMAIL, ADMIN_PASSWORD]);
                console.log('  ✅ Admin created!');
            } else {
                console.log(`  → Found admin ID ${row.id} (${row.email}). Resetting credentials...`);
                db.run(`UPDATE users SET email = ?, password = ? WHERE id = ?`, [ADMIN_EMAIL, ADMIN_PASSWORD, row.id]);
                console.log('  ✅ Admin credentials reset!');
            }
        });

        console.log('\n[2/4] Clearing stale/empty usernames...');
        db.run(`UPDATE users SET username = NULL WHERE username = ''`, function(err) {
            if (!err) console.log(`  ✅ Cleared ${this.changes || 0} empty username row(s)`);
        });

        console.log('\n[3/4] Checking for "zeeshan" username...');
        db.get(`SELECT id, username FROM users WHERE LOWER(username) = 'zeeshan'`, (err, row) => {
            if (row) {
                db.run(`UPDATE users SET username = NULL WHERE id = ?`, [row.id]);
                console.log(`  ✅ Freed username "zeeshan" from user ID ${row.id}`);
            } else {
                console.log(`  → "zeeshan" is not in use. It's free!`);
            }
        });

        console.log('\n[4/4] Final database state:');
        db.all(`SELECT id, email, password, role, username, is_super_admin FROM users`, (err, rows) => {
            if (err) return console.error(err);
            rows.forEach(r => {
                console.log(`  ID ${r.id}: ${r.email} | role: ${r.role} | username: ${r.username || '(none)'} | admin: ${r.is_super_admin ? 'YES' : 'no'}`);
            });
        });

        // [5/6] Table creation and column fixes
        db.run(`CREATE TABLE IF NOT EXISTS reserved_usernames (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username_pattern TEXT NOT NULL UNIQUE,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, () => {
            console.log('\n[5/6] Seeding reserved usernames...');
            const patterns = [
                'timeline', 'timelineearn', 'timeline-earn', 'time-line-earn',
                'zeeshan', 'zshn', 'mzeeshan', 'zeeshansaeed',
                'misbah', 'ghazanfar', 'nadir',
                'admin', 'support', 'verify'
            ];
            patterns.forEach(p => {
                db.run(`INSERT OR IGNORE INTO reserved_usernames (username_pattern) VALUES (?)`, [p]);
            });
            console.log('  ✅ Reserved patterns seeded!');
        });

        db.run(`ALTER TABLE users ADD COLUMN username TEXT UNIQUE`, () => {});
        db.run(`ALTER TABLE users ADD COLUMN country TEXT`, () => {});
        db.run(`ALTER TABLE users ADD COLUMN device TEXT`, () => {});
        db.run(`ALTER TABLE users ADD COLUMN memoney_balance INTEGER DEFAULT 0`, () => {});
        db.run(`ALTER TABLE users ADD COLUMN is_verified INTEGER DEFAULT 0`, () => {});
        db.run(`ALTER TABLE users ADD COLUMN refer_code TEXT`, () => {});

        // [6/6] Final Close
        db.run("SELECT 1", () => {
             console.log(`
════════════════════════════════════════════
✅ DONE! Admin login credentials:
   📧 Email:    ${ADMIN_EMAIL}
   🔑 Password: ${ADMIN_PASSWORD}
════════════════════════════════════════════
⚠️  Restart your server to apply db.js seeder changes!
    pm2 restart all   (or however you restart)
`);
            db.close();
        });
    });
}



