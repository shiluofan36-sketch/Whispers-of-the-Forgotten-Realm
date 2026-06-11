import { getPool } from './index.js';
import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

export async function createUser(username, password) {
  const hash = await bcrypt.hash(password, SALT_ROUNDS);
  const pool = getPool();
  const [result] = await pool.execute(
    'INSERT INTO users (username, password) VALUES (?, ?)',
    [username, hash]
  );
  return { id: result.insertId, username };
}

export async function findUserByUsername(username) {
  const pool = getPool();
  const [rows] = await pool.execute(
    'SELECT * FROM users WHERE username = ?',
    [username]
  );
  return rows[0] || null;
}

export async function findUserById(id) {
  const pool = getPool();
  const [rows] = await pool.execute(
    'SELECT id, username, nickname, role, created_at FROM users WHERE id = ?',
    [id]
  );
  return rows[0] || null;
}

export async function verifyPassword(inputPassword, hash) {
  return bcrypt.compare(inputPassword, hash);
}

export async function setNickname(userId, nickname) {
  const pool = getPool();
  await pool.execute(
    'UPDATE users SET nickname = ? WHERE id = ?',
    [nickname, userId]
  );
}

export async function getAllPlayers() {
  const pool = getPool();
  const [rows] = await pool.execute(
    `SELECT id, username, nickname, role, banned, ban_reason, created_at FROM users WHERE role = 'player' ORDER BY created_at DESC`
  );
  return rows;
}

export async function banUser(userId, reason) {
  const pool = getPool();
  await pool.execute('UPDATE users SET banned = 1, ban_reason = ? WHERE id = ?', [reason, userId]);
}

export async function unbanUser(userId) {
  const pool = getPool();
  await pool.execute('UPDATE users SET banned = 0, ban_reason = NULL WHERE id = ?', [userId]);
}

export async function deleteUser(userId) {
  const pool = getPool();
  // CASCADE 会自动清理 saves / suggestions / login_logs
  await pool.execute('DELETE FROM users WHERE id = ? AND role = ?', [userId, 'player']);
}

export async function getPlayerDetail(playerId) {
  const pool = getPool();
  const [users] = await pool.execute(
    'SELECT id, username, nickname, role, banned, ban_reason, created_at FROM users WHERE id = ? AND role = ?',
    [playerId, 'player']
  );
  if (!users[0]) return null;

  const [saves] = await pool.execute(
    'SELECT floor, level, updated_at FROM saves WHERE user_id = ? ORDER BY updated_at DESC LIMIT 1',
    [playerId]
  );

  const [logs] = await pool.execute(
    'SELECT action, created_at FROM login_logs WHERE user_id = ? ORDER BY created_at DESC LIMIT 20',
    [playerId]
  );

  return {
    user: users[0],
    lastSave: saves[0] || null,
    recentLogs: logs,
  };
}

export async function seedAdmin() {
  const existing = await findUserByUsername('admin');
  if (existing) return;
  const hash = await bcrypt.hash('admin123', SALT_ROUNDS);
  const pool = getPool();
  await pool.execute(
    "INSERT INTO users (username, password, nickname, role) VALUES ('admin', ?, '管理员', 'admin')",
    [hash]
  );
}
