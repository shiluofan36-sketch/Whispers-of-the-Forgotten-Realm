import { getPool } from './index.js';

export async function writeLog(userId, username, action) {
  const pool = getPool();
  await pool.execute(
    'INSERT INTO login_logs (user_id, username, action) VALUES (?, ?, ?)',
    [userId, username, action]
  );
}

export async function getLogs(limit = 50) {
  const pool = getPool();
  const [rows] = await pool.query(
    `SELECT id, user_id, username, action, created_at
     FROM login_logs
     ORDER BY created_at DESC
     LIMIT ${Math.floor(limit)}`
  );
  return rows;
}
