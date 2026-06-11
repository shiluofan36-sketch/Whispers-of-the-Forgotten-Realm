import { getPool } from './index.js';

export async function writeSave(userId, gameState) {
  const pool = getPool();
  const saveData = JSON.stringify(gameState);
  const floor = gameState.currentFloor || 0;
  const level = gameState.player?.level || 1;

  const [existing] = await pool.execute(
    'SELECT id FROM saves WHERE user_id = ?',
    [userId]
  );

  if (existing.length > 0) {
    await pool.execute(
      'UPDATE saves SET save_data = ?, floor = ?, level = ?, updated_at = NOW() WHERE user_id = ?',
      [saveData, floor, level, userId]
    );
  } else {
    await pool.execute(
      'INSERT INTO saves (user_id, save_data, floor, level) VALUES (?, ?, ?, ?)',
      [userId, saveData, floor, level]
    );
  }
}

export async function readSave(userId) {
  const pool = getPool();
  const [rows] = await pool.execute(
    'SELECT save_data FROM saves WHERE user_id = ?',
    [userId]
  );
  if (!rows[0]) return null;
  return typeof rows[0].save_data === 'string'
    ? JSON.parse(rows[0].save_data)
    : rows[0].save_data;
}

export async function getPlayerInventory(userId) {
  const save = await readSave(userId);
  if (!save) return [];
  return save.inventory || [];
}

export async function setPlayerInventory(userId, inventory) {
  let save = await readSave(userId);
  if (!save) save = { version: 1, player: { level: 1 } };
  save.inventory = inventory;
  await writeSave(userId, save);
  return true;
}

export async function getPlayerStorage(userId) {
  const save = await readSave(userId);
  if (!save) return [];
  return save.storage || [];
}

export async function setPlayerStorage(userId, storage) {
  let save = await readSave(userId);
  if (!save) save = { version: 1, player: { level: 1 } };
  save.storage = storage;
  await writeSave(userId, save);
  return true;
}

export async function getPlayerEquipment(userId) {
  const save = await readSave(userId);
  if (!save || !save.player) return { weapon: null, armor: null, accessory: null };
  return save.player.equipment || { weapon: null, armor: null, accessory: null };
}

export async function setPlayerEquipment(userId, equipment) {
  let save = await readSave(userId);
  if (!save) save = { version: 1, player: { level: 1, equipment: {} } };
  if (!save.player) save.player = { level: 1, equipment: {} };
  save.player.equipment = equipment;
  await writeSave(userId, save);
  return true;
}
