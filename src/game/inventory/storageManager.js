/**
 * 仓库管理器
 * 职责：仓库存取（无限容量，仅营地可用，永久保存）
 */
import { tryAddItem, removeFromSlot } from './stackSystem';
import { ITEM_TYPES } from '../constants';

/**
 * 从背包存入仓库
 * @param {number} slotIndex - 背包格子索引
 * @param {number} count - 存入数量（默认全部）
 */
export function depositToStorage(state, slotIndex, count) {
  if (slotIndex < 0 || slotIndex >= state.inventory.length) return false;

  const slot = state.inventory[slotIndex];
  const depositCount = count ?? slot.quantity;

  if (depositCount <= 0 || depositCount > slot.quantity) return false;

  // 存入仓库（无限容量，但保留堆叠逻辑）
  const result = tryAddItem(state.storage, Infinity, slot.itemKey, depositCount);
  if (result.success) {
    removeFromSlot(state.inventory, slotIndex, depositCount);
  }
  return result.success;
}

/**
 * 从仓库取回背包
 * @param {number} storageIndex - 仓库格子索引
 * @param {number} count - 取回数量（默认全部）
 */
export function withdrawFromStorage(state, storageIndex, count) {
  if (storageIndex < 0 || storageIndex >= state.storage.length) return false;

  const slot = state.storage[storageIndex];
  const withdrawCount = count ?? slot.quantity;

  if (withdrawCount <= 0 || withdrawCount > slot.quantity) return false;

  // 先检查背包容量
  const existingSlot = state.inventory.find(s => s.itemKey === slot.itemKey);
  const needsNewSlot = !existingSlot || existingSlot.quantity + withdrawCount > (ITEM_TYPES[slot.itemKey]?.maxStack ?? 99);
  const availableSlots = state.inventorySlots - state.inventory.length;

  if (needsNewSlot && availableSlots <= 0) {
    state.battleLog.push('背包空间不足！');
    return false;
  }

  const result = tryAddItem(state.inventory, state.inventorySlots, slot.itemKey, withdrawCount);
  if (result.success) {
    removeFromSlot(state.storage, storageIndex, withdrawCount);
  }
  return result.success;
}

/**
 * 获取仓库物品列表
 */
export function getStorageItems(state) {
  return state.storage;
}

/**
 * 获取仓库物品数量
 */
export function getStorageCount(state) {
  return state.storage.length;
}
