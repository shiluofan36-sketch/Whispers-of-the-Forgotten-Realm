import { apiClient } from './apiClient.js';

const SAVE_ID_KEY = 'rpg_save_id';
const LOCAL_SAVE_KEY = 'rpg_save';

function getSaveId() {
  let id = localStorage.getItem(SAVE_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(SAVE_ID_KEY, id);
  }
  return id;
}

export async function serverSave(gameState) {
  try {
    const saveId = getSaveId();
    await apiClient.post('/save', { saveId, gameState });
    // Also write to localStorage as fallback
    localStorage.setItem(LOCAL_SAVE_KEY, JSON.stringify(gameState));
    return { success: true, source: 'server' };
  } catch (err) {
    console.warn('[SaveService] Server save failed, falling back to localStorage:', err.message);
    localStorage.setItem(LOCAL_SAVE_KEY, JSON.stringify(gameState));
    return { success: true, source: 'local' };
  }
}

export async function serverLoad() {
  try {
    const saveId = getSaveId();
    const data = await apiClient.get(`/save/${saveId}`);
    return data;
  } catch (err) {
    console.warn('[SaveService] Server load failed, trying localStorage:', err.message);
    const raw = localStorage.getItem(LOCAL_SAVE_KEY);
    return raw ? JSON.parse(raw) : null;
  }
}

export async function serverDelete() {
  localStorage.removeItem(LOCAL_SAVE_KEY);
}
