import sqlite3 from 'sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const dbPath = path.resolve(__dirname, 'server', 'data.sqlite')
const db = new sqlite3.Database(dbPath)

db.serialize(() => {
    db.run(`ALTER TABLE users ADD COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP`, (err) => {
        if (err && !err.message.includes('duplicate')) console.error('Add column err:', err.message)
    })
    
    // Update existing users with their earliest transaction date if possible
    db.all(`SELECT id FROM users WHERE created_at IS NULL OR created_at = CURRENT_TIMESTAMP`, (err, users) => {
        if (!users) return
        users.forEach(u => {
            db.get(`SELECT date FROM transactions WHERE user_id = ? ORDER BY id ASC LIMIT 1`, [u.id], (err, row) => {
                if (row && row.date) {
                    try {
                        const d = new Date(row.date)
                        if (!isNaN(d.getTime())) {
                            const iso = d.toISOString()
                            db.run(`UPDATE users SET created_at = ? WHERE id = ?`, [iso, u.id])
                        }
                    } catch(e) {}
                }
            })
        })
    })
})

setTimeout(() => { db.close(); console.log('Done mapping dates'); }, 2000)
