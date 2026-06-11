import { getPool } from './index.js';

export async function createSuggestion(userId, content) {
  const pool = getPool();
  await pool.execute(
    'INSERT INTO suggestions (user_id, content) VALUES (?, ?)',
    [userId, content]
  );
}

export async function getUserSuggestions(userId) {
  const pool = getPool();
  const [rows] = await pool.execute(
    'SELECT id, content, created_at FROM suggestions WHERE user_id = ? ORDER BY created_at DESC',
    [userId]
  );
  return rows;
}

export async function getAllSuggestions() {
  const pool = getPool();
  const [rows] = await pool.execute(
    `SELECT s.id, s.content, s.created_at, u.username, u.nickname
     FROM suggestions s
     JOIN users u ON s.user_id = u.id
     ORDER BY s.created_at DESC`
  );
  return rows;
}

export async function deleteSuggestion(id) {
  const pool = getPool();
  await pool.execute('DELETE FROM suggestions WHERE id = ?', [id]);
}
