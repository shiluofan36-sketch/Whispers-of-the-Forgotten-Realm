/**
 * 存档管理器
 * 职责：localStorage 读写 + 自动存档触发
 */
import { getSaveData, applySaveData } from './saveSchema';

const SAVE_KEY = 'rpg_save';

/**
 * 保存游戏到 localStorage
 */
export function saveGame(state) {
  try {
    const data = getSaveData(state);
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
  } catch (e) {
    // localStorage 不可用或已满，静默失败
  }
}

/**
 * 从 localStorage 加载存档
 * @returns {object|null} 存档数据或 null
 */
export function loadGame() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

/**
 * 检查是否有存档
 */
export function hasSave() {
  return localStorage.getItem(SAVE_KEY) !== null;
}

/**
 * 删除存档（新游戏用）
 */
export function deleteSave() {
  localStorage.removeItem(SAVE_KEY);
}

/**
 * 自动存档：根据触发原因决定是否保存
 * 触发时机：回营地、购买物品、存入仓库、升级、解锁新楼层
 */
export function autoSave(state, reason) {
  const triggers = ['return_camp', 'shop_buy', 'storage_deposit', 'level_up', 'floor_unlock'];
  if (triggers.includes(reason)) {
    saveGame(state);
  }
}
