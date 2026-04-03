import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'database.sqlite');

export async function getDbInstance() {
  // Serverless environments like Vercel Lambda do not support native glibc bindings
  // or persistent file systems, so we gracefully downgrade.
  if (process.env.VERCEL) {
    console.log("Vercel Serverless Env detected: Scaling down SQLite Database.");
    return null; 
  }

  try {
    const sqlite3 = (await import('sqlite3')).default;
    const { open } = await import('sqlite');

    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });
    
    await db.exec(`
      CREATE TABLE IF NOT EXISTS scan_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        symbol TEXT NOT NULL,
        strategy_id TEXT NOT NULL,
        price REAL,
        win_probability INTEGER,
        action_time TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    return db;
  } catch (e) {
    console.warn('Could not launch Big Backend DB:', e.message);
    return null;
  }
}
