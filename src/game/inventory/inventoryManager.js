/**
 * 背包管理器
 * 职责：背包增删查改 + 容量检测 + 物品使用
 */
import { ITEM_TYPES } from '../constants';
import { tryAddItem, removeFromSlot } from './stackSystem';

/**
 * 向背包添加物品（自动堆叠）
 * @returns {boolean} 是否成功
 */
export function addItem(state, itemKey, count = 1) {
  const result = tryAddItem(state.inventory, state.inventorySlots, itemKey, count);
  if (!result.success) {
    state.battleLog.push('背包已满！');
  }
  return result.success;
}

/**
 * 从指定格子移除物品
 */
export function removeItem(state, slotIndex, count = 1) {
  if (slotIndex < 0 || slotIndex >= state.inventory.length) return;
  removeFromSlot(state.inventory, slotIndex, count);
}

/**
 * 使用指定格子的道具
 */
export function useItem(state, slotIndex) {
  if (slotIndex < 0 || slotIndex >= state.inventory.length) return;

  const slot = state.inventory[slotIndex];
  const item = ITEM_TYPES[slot.itemKey];
  if (!item) return;

  const { player } = state;

  switch (item.effect) {
    case 'heal': {
      const heal = Math.min(item.value, player.maxHp - player.hp);
      player.hp += heal;
      state.battleLog.push(`使用了${item.name}，恢复了${heal}点生命`);
      break;
    }
    case 'mpHeal': {
      const heal = Math.min(item.value, player.maxMp - player.mp);
      player.mp += heal;
      state.battleLog.push(`使用了${item.name}，恢复了${heal}点MP`);
      break;
    }
    case 'attackBuff': {
      player.attackBuff += item.value;
      state.battleLog.push(`使用了${item.name}，下次攻击+${item.value}伤害`);
      break;
    }
    case 'defenseBuff': {
      player.defenseBuff += item.value;
      state.battleLog.push(`使用了${item.name}，下次受伤减半`);
      break;
    }
  }

  // 扣减数量
  removeFromSlot(state.inventory, slotIndex, 1);
}

/**
 * 获取指定格子的道具信息
 */
export function getItem(state, slotIndex) {
  if (slotIndex < 0 || slotIndex >= state.inventory.length) return null;
  const slot = state.inventory[slotIndex];
  const info = ITEM_TYPES[slot.itemKey];
  return info ? { ...info, itemKey: slot.itemKey, quantity: slot.quantity } : null;
}

/**
 * 获取背包已用格子数
 */
export function getUsedSlots(state) {
  return state.inventory.length;
}

/**
 * 获取背包总容量
 */
export function getCapacity(state) {
  return state.inventorySlots;
}

/**
 * 升级背包容量
 */
export function upgradeBag(state, slots) {
  state.inventorySlots += slots;
}
