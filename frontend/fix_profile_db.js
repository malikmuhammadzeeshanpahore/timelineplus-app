import sqlite3 from 'sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const dbPath = path.resolve(__dirname, 'server', 'data.sqlite')
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) return console.error('Error opening db:', err.message)
  console.log('Connected.')
})

const colsToAdd = [
  'payout_method TEXT',
  'country TEXT',
  'device TEXT'
]

db.serialize(() => {
  colsToAdd.forEach(colDef => {
    const colName = colDef.split(' ')[0]
    db.run(`ALTER TABLE users ADD COLUMN ${colName} ${colDef.split(' ')[1]}`, (err) => {
      if (err) {
        if (err.message.includes('duplicate column name')) {
          console.log(`Column ${colName} already exists.`)
        } else {
          console.log(`Error adding ${colName}:`, err.message)
        }
      } else {
        console.log(`Added column ${colName}`)
      }
    })
  })
})

db.close(() => {
  console.log('Migration completed.')
})
