/**
 * 物品堆叠系统
 * 职责：自动堆叠、拆分、最大堆叠数管理
 */
import { ITEM_TYPES } from '../constants';

/**
 * 获取某类物品的最大堆叠数
 */
export function getMaxStack(itemKey) {
  const info = ITEM_TYPES[itemKey];
  return info?.maxStack ?? 99;
}

/**
 * 检查是否还能向某个已有物品堆叠更多
 */
export function canStackTo(itemKey, currentQty) {
  return currentQty < getMaxStack(itemKey);
}

/**
 * 向 inventory 数组添加物品：先找同类且未满的格子堆叠，再开新格子
 * @returns {{ success: boolean, stacked: boolean }}
 */
export function tryAddItem(inventory, capacity, itemKey, count = 1) {
  const maxStack = getMaxStack(itemKey);
  let remaining = count;

  // 先尝试堆叠到已有同类
  for (const slot of inventory) {
    if (slot.itemKey === itemKey && slot.quantity < maxStack) {
      const space = maxStack - slot.quantity;
      const add = Math.min(space, remaining);
      slot.quantity += add;
      remaining -= add;
      if (remaining <= 0) return { success: true, stacked: true };
    }
  }

  // 需要开新格子
  while (remaining > 0) {
    if (inventory.length >= capacity) {
      return { success: false, stacked: false };
    }
    const add = Math.min(maxStack, remaining);
    inventory.push({ itemKey, quantity: add });
    remaining -= add;
  }

  return { success: true, stacked: false };
}

/**
 * 从指定格子移除指定数量，归零则清空格子
 */
export function removeFromSlot(inventory, slotIndex, count = 1) {
  if (slotIndex < 0 || slotIndex >= inventory.length) return;
  const slot = inventory[slotIndex];
  slot.quantity -= count;
  if (slot.quantity <= 0) {
    inventory.splice(slotIndex, 1);
  }
}

/**
 * 从背包拆分一堆物品（暂未用于 UI，预留给将来）
 */
export function splitStack(inventory, slotIndex, count) {
  if (slotIndex < 0 || slotIndex >= inventory.length) return false;
  const slot = inventory[slotIndex];
  if (slot.quantity <= count) return false; // 不能拆出全部

  slot.quantity -= count;
  inventory.splice(slotIndex + 1, 0, { itemKey: slot.itemKey, quantity: count });
  return true;
}
