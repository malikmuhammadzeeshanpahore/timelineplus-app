import sqlite3 from 'sqlite3';

const dbPath = './server/data.sqlite';

const migrate = async () => {
    // Enable verbose mode for debugging
    const sqlite = sqlite3.verbose();
    const db = new sqlite.Database(dbPath);

    db.run(`ALTER TABLE visit_logs ADD COLUMN session_id TEXT`, function (err) {
        if (err) {
            if (err.message.includes('duplicate column name')) {
                console.log('Column session_id already exists.');
                process.exit(0);
            } else {
                console.error('Migration Failed:', err);
                process.exit(1);
            }
        } else {
            console.log('Successfully added session_id column to visit_logs table.');
            process.exit(0);
        }
    });
};

migrate();
