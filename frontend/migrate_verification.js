import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, 'server/data.sqlite');

const db = new sqlite3.Database(dbPath);

const runQuery = (query, params = []) => {
    return new Promise((resolve, reject) => {
        db.run(query, params, function (err) {
            if (err) reject(err);
            else resolve(this);
        });
    });
};

const migrate = async () => {
    try {
        console.log('Starting Migration: Adding Verification Columns...');

        // 1. Add is_verified column
        try {
            await runQuery(`ALTER TABLE users ADD COLUMN is_verified INTEGER DEFAULT 0`);
            console.log('Added is_verified column.');
        } catch (e) {
            if (e.message.includes('duplicate column name')) {
                console.log('is_verified column already exists.');
            } else {
                throw e;
            }
        }

        // 2. Add verification_token column
        try {
            await runQuery(`ALTER TABLE users ADD COLUMN verification_token TEXT`);
            console.log('Added verification_token column.');
        } catch (e) {
            if (e.message.includes('duplicate column name')) {
                console.log('verification_token column already exists.');
            } else {
                throw e;
            }
        }

        // 3. Update existing users to be verified
        await runQuery(`UPDATE users SET is_verified = 1 WHERE is_verified = 0`);
        console.log('Updated existing users to is_verified = 1.');

        console.log('Migration Completed Successfully.');
    } catch (err) {
        console.error('Migration Failed:', err);
    } finally {
        db.close();
    }
};

migrate();
