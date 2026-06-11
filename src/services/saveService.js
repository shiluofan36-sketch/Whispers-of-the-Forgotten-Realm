import { apiClient } from './apiClient.js';

const LOCAL_SAVE_KEY = 'rpg_save';

export async function serverSave(gameState) {
  try {
    await apiClient.post('/save', { gameState }, true);
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
    const data = await apiClient.get('/save', true);
    if (data && Object.keys(data).length > 0) return data;
    return null;
  } catch (err) {
    console.warn('[SaveService] Server load failed, trying localStorage:', err.message);
    const raw = localStorage.getItem(LOCAL_SAVE_KEY);
    return raw ? JSON.parse(raw) : null;
  }
}

export async function serverDelete() {
  localStorage.removeItem(LOCAL_SAVE_KEY);
}
