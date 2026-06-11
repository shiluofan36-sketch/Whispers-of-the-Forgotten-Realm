import { apiClient } from './apiClient.js';

const TOKEN_KEY = 'rpg_token';
const USER_KEY = 'rpg_user';

export function getStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function setStoredUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export async function login(username, password) {
  const data = await apiClient.post('/auth/login', { username, password });
  localStorage.setItem(TOKEN_KEY, data.token);
  const user = { username: data.username, nickname: data.nickname, role: data.role };
  setStoredUser(user);
  return user;
}

export async function register(username, password) {
  const data = await apiClient.post('/auth/register', { username, password });
  localStorage.setItem(TOKEN_KEY, data.token);
  const user = { username: data.username, nickname: data.nickname, role: data.role };
  setStoredUser(user);
  return user;
}

export async function fetchMe() {
  const data = await apiClient.get('/auth/me', true);
  const user = { username: data.username, nickname: data.nickname, role: data.role };
  setStoredUser(user);
  return user;
}

export async function setNickname(nickname) {
  await apiClient.put('/auth/nickname', { nickname }, true);
  const user = getStoredUser();
  user.nickname = nickname;
  setStoredUser(user);
}

export function logout() {
  apiClient.post('/auth/logout', {}, true).catch(() => {});
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export async function submitSuggestion(content) {
  return apiClient.post('/suggestions', { content }, true);
}

export async function getAdminPlayers() {
  return apiClient.get('/admin/players', true);
}

export async function getPlayerDetail(playerId) {
  return apiClient.get(`/admin/players/${playerId}`, true);
}

export async function getAdminSuggestions() {
  return apiClient.get('/admin/suggestions', true);
}

export async function deleteSuggestion(id) {
  return apiClient.delete(`/admin/suggestions/${id}`, true);
}

export async function getAdminLogs() {
  return apiClient.get('/admin/logs', true);
}

export async function banPlayer(playerId, reason) {
  return apiClient.put(`/admin/players/${playerId}/ban`, { reason }, true);
}

export async function unbanPlayer(playerId) {
  return apiClient.put(`/admin/players/${playerId}/unban`, {}, true);
}

export async function deletePlayer(playerId) {
  return apiClient.delete(`/admin/players/${playerId}`, true);
}

export async function getPlayerInventoryAPI(playerId) {
  return apiClient.get(`/admin/players/${playerId}/inventory`, true);
}

export async function updatePlayerInventory(playerId, inventory) {
  return apiClient.put(`/admin/players/${playerId}/inventory`, { inventory }, true);
}

export async function getPlayerStorageAPI(playerId) {
  return apiClient.get(`/admin/players/${playerId}/storage`, true);
}

export async function updatePlayerStorage(playerId, storage) {
  return apiClient.put(`/admin/players/${playerId}/storage`, { storage }, true);
}

export async function getPlayerEquipmentAPI(playerId) {
  return apiClient.get(`/admin/players/${playerId}/equipment`, true);
}

export async function updatePlayerEquipment(playerId, equipment) {
  return apiClient.put(`/admin/players/${playerId}/equipment`, { equipment }, true);
}
