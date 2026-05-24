/**
 * 存档管理器
 * 职责：localStorage 读写 + 服务端存档 + 自动存档触发
 */
import { getSaveData, applySaveData } from './saveSchema.js';
import { serverSave, serverLoad } from '../../services/saveService.js';

const SAVE_KEY = 'rpg_save';

/**
 * 保存游戏：localStorage（同步）+ 服务端（异步非阻塞）
 */
export function saveGame(state) {
  try {
    const data = getSaveData(state);
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
    // 异步推送到服务端（不阻塞）
    serverSave(data).catch(() => {});
  } catch (e) {
    // localStorage 不可用或已满，静默失败
  }
}

/**
 * 加载存档：优先 localStorage（快），服务端在后台同步
 */
export function loadGame() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) { /* fall through */ }

  // localStorage 无存档时尝试服务端（异步同步方式不支持，仅作为 fallback 标记）
  return null;
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
  const triggers = ['return_camp', 'shop_buy', 'storage_deposit', 'level_up', 'floor_unlock', 'meta_buy'];
  if (triggers.includes(reason)) {
    saveGame(state);
  }
}
