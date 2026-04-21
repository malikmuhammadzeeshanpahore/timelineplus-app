
import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, 'server/data.sqlite');
const db = new sqlite3.Database(dbPath);

const run = (sql, params = []) => new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
        if (err) reject(err);
        else resolve(this);
    });
});

const get = (sql, params = []) => new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
    });
});

async function debugTransaction() {
    try {
        console.log('--- DEBUGGING CAMPAIGN TRANSACTION ---');

        // 1. Find a User and an Accepted Offer
        const offer = await get("SELECT * FROM offers WHERE status = 'accepted' LIMIT 1");
        if (!offer) {
            console.log('No accepted offer found. Creating a dummy one for testing...');
            // Create dummy user and offer
            const userId = 999;
            // Check if user exists first or create
            await run("INSERT OR IGNORE INTO users (id, name, email, balance, role) VALUES (?, 'Test User', 'test@test.com', 1000, 'buyer')", [userId]);
            await run("UPDATE users SET balance = 1000 WHERE id = ?", [userId]); // Ensure balance

            await run("INSERT INTO offers (user_id, current_rate, service_type, link, quantity, status) VALUES (?, 10, 'YouTube Subscribe', 'http://test.com', 5, 'accepted')", [userId]);

            const newOffer = await get("SELECT * FROM offers WHERE user_id = ? AND status = 'accepted' ORDER BY id DESC LIMIT 1", [userId]);
            return processOffer(newOffer);
        } else {
            console.log('Found existing accepted offer:', offer);
            return processOffer(offer);
        }

    } catch (error) {
        console.error('Setup Error:', error);
    }
}

async function processOffer(offer) {
    try {
        const userId = offer.user_id;
        const ratePerTask = offer.current_rate;
        const totalTasks = offer.quantity;
        const totalAmount = ratePerTask * totalTasks;

        console.log(`Processing Offer ID: ${offer.id}`);
        console.log(`User ID: ${userId}`);
        console.log(`Rate: ${ratePerTask}, Qty: ${totalTasks}, Total Amount: ${totalAmount}`);

        // Get Initial Balance
        const userBefore = await get("SELECT balance FROM users WHERE id = ?", [userId]);
        console.log(`[BEFORE] User Balance: ${userBefore.balance}`);

        if (userBefore.balance < totalAmount) {
            console.log('Insufficient balance. Adding funds for test...');
            await run("UPDATE users SET balance = balance + ? WHERE id = ?", [totalAmount + 100, userId]);
            const userUpdated = await get("SELECT balance FROM users WHERE id = ?", [userId]);
            console.log(`[UPDATED] User Balance: ${userUpdated.balance}`);
        }

        // --- SIMULATE TRANSACTION ---
        console.log('--- STARTING TRANSACTION SIMULATION ---');

        const adminShare = totalAmount * 0.60;
        const freelancerShare = totalAmount * 0.40;

        // Emulate Server Logic exactly
        await run('BEGIN TRANSACTION');

        try {
            const userCurrent = await get(`SELECT balance FROM users WHERE id = ?`, [userId]);
            const newBalance = userCurrent.balance - totalAmount;

            console.log(`Calculated New Balance: ${newBalance}`);

            await run(`UPDATE users SET balance = ? WHERE id = ?`, [newBalance, userId]);
            console.log('Step 2: Balance Deducted');

            await run(`UPDATE platform_stats SET total_admin_profit = total_admin_profit + ?, total_freelancer_pool = total_freelancer_pool + ? WHERE id = 1`, [adminShare, freelancerShare]);
            console.log('Step 3: Stats Updated');

            await run(`INSERT INTO transactions (user_id, type, amount, date, status) VALUES (?, 'Campaign Spend', ?, ?, 'Completed')`, [userId, totalAmount, 'Test Date']);

            await run(`INSERT INTO campaigns (user_id, title, description, reward_per_task, total_tasks, status) VALUES (?, ?, ?, ?, ?, 'active')`,
                [userId, 'Test Campaign', 'Desc', ratePerTask * 0.40, totalTasks]);

            await run(`UPDATE offers SET status = 'completed' WHERE id = ?`, [offer.id]);

            await run('COMMIT');
            console.log('--- COMMIT SUCCESSFUL ---');

        } catch (err) {
            await run('ROLLBACK');
            console.error('--- ROLLBACK ---', err);
            return;
        }

        // Verify Final Balance
        const userAfter = await get("SELECT balance FROM users WHERE id = ?", [userId]);
        console.log(`[AFTER] User Balance: ${userAfter.balance}`);

        if (Math.abs(userAfter.balance - (userBefore.balance - totalAmount)) < 0.1 || userAfter.balance < userBefore.balance) {
            console.log('✅ TEST PASSED: Balance successfully deducted.');
        } else {
            console.log('❌ TEST FAILED: Balance did not change correctly.');
        }

    } catch (e) {
        console.error('Process Error:', e);
    }
}

debugTransaction();
