import { apiClient } from './apiClient.js';

let cachedConfig = null;
let cachedGameInfo = null;

export async function fetchConfig() {
  if (cachedConfig) return cachedConfig;
  try {
    cachedConfig = await apiClient.get('/config');
    return cachedConfig;
  } catch (err) {
    console.warn('[ConfigService] Failed to fetch config:', err.message);
    return null;
  }
}

export async function fetchGameInfo() {
  if (cachedGameInfo) return cachedGameInfo;
  try {
    cachedGameInfo = await apiClient.get('/game-info');
    return cachedGameInfo;
  } catch (err) {
    console.warn('[ConfigService] Failed to fetch game-info:', err.message);
    return null;
  }
}

export async function fetchLore(category) {
  try {
    return await apiClient.get(`/lore/${category}`);
  } catch (err) {
    console.warn(`[ConfigService] Failed to fetch lore/${category}:`, err.message);
    return null;
  }
}
