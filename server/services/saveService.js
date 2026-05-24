import fs from 'fs/promises';
import path from 'path';
import { SAVES_DIR } from '../config/index.js';
import { isValidSaveId } from '../utils/id.js';

export async function writeSave(saveId, gameState) {
  if (!isValidSaveId(saveId)) {
    const err = new Error('Invalid saveId format: must be a UUID v4');
    err.statusCode = 400;
    throw err;
  }

  const filePath = path.join(SAVES_DIR, `${saveId}.json`);
  const data = JSON.stringify({
    ...gameState,
    savedAt: Date.now(),
    saveId,
  }, null, 2);

  await fs.writeFile(filePath, data, 'utf-8');
}

export async function readSave(saveId) {
  if (!isValidSaveId(saveId)) {
    const err = new Error('Invalid saveId format: must be a UUID v4');
    err.statusCode = 400;
    throw err;
  }

  const filePath = path.join(SAVES_DIR, `${saveId}.json`);
  const raw = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(raw);
}
