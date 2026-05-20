/**
 * 商店管理器
 * 职责：商店物品定义 + 购买逻辑
 */
import { SHOP_ITEMS } from '../constants';
import { addItem, upgradeBag, getUsedSlots, getCapacity } from '../inventory/inventoryManager';
import { autoSave } from '../save/saveManager';

/**
 * 获取商店物品列表
 */
export function getShopItems() {
  return SHOP_ITEMS;
}

/**
 * 购买物品
 * @returns {{ success: boolean, message: string }}
 */
export function buyItem(state, shopItemKey) {
  const shopItem = SHOP_ITEMS[shopItemKey];
  if (!shopItem) return { success: false, message: '无效的物品' };

  const { player } = state;

  // 检查金币
  if (player.gold < shopItem.price) {
    return { success: false, message: '金币不足！' };
  }

  // 背包扩容（特殊处理：不占格子）
  if (shopItem.bagUpgrade) {
    player.gold -= shopItem.price;
    upgradeBag(state, shopItem.bagUpgrade);
    autoSave(state, 'shop_buy');
    return { success: true, message: `背包扩容 +${shopItem.bagUpgrade}格！` };
  }

  // 普通道具：检查背包容量
  const usedSlots = getUsedSlots(state);
  const capacity = getCapacity(state);
  if (usedSlots >= capacity) {
    // 检查是否能堆叠到已有同类
    const existing = state.inventory.find(s => s.itemKey === shopItem.itemKey);
    if (!existing) {
      return { success: false, message: '背包已满！' };
    }
  }

  // 扣钱 + 加物品
  player.gold -= shopItem.price;
  const added = addItem(state, shopItem.itemKey, 1);
  if (!added) {
    // 堆叠也满了，退回金币
    player.gold += shopItem.price;
    return { success: false, message: '背包已满（堆叠上限）！' };
  }
  autoSave(state, 'shop_buy');

  return { success: true, message: `购买了${shopItem.name}！` };
}

/**
 * 获取物品单价
 */
export function getItemPrice(shopItemKey) {
  const item = SHOP_ITEMS[shopItemKey];
  return item ? item.price : 0;
}
