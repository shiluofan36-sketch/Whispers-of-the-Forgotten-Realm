import { SHOP_ITEMS } from '../constants';
import { addItem, upgradeBag, getUsedSlots, getCapacity } from '../inventory/inventoryManager';
import { autoSave } from '../save/saveManager';
import { getShopDiscount } from '../meta/metaManager';

export function getShopItems(state) {
  // 铁匠铺升级 → 待实现：解锁稀有/史诗装备上架
  return SHOP_ITEMS;
}

export function getEffectivePrice(state, shopItemKey) {
  const item = SHOP_ITEMS[shopItemKey];
  if (!item) return 0;
  const discount = getShopDiscount(state);
  return Math.floor(item.price * (1 - discount));
}

export function buyItem(state, shopItemKey) {
  const shopItem = SHOP_ITEMS[shopItemKey];
  if (!shopItem) return { success: false, message: '无效的物品' };

  const { player } = state;
  const price = getEffectivePrice(state, shopItemKey);

  if (player.gold < price) {
    return { success: false, message: `金币不足！（需要 ${price}）` };
  }

  // 背包扩容
  if (shopItem.bagUpgrade) {
    player.gold -= price;
    upgradeBag(state, shopItem.bagUpgrade);
    autoSave(state, 'shop_buy');
    return { success: true, message: `背包扩容 +${shopItem.bagUpgrade}格！` };
  }

  // 检查背包容量
  const usedSlots = getUsedSlots(state);
  const capacity = getCapacity(state);
  if (usedSlots >= capacity) {
    const existing = state.inventory.find(s => s.itemKey === shopItem.itemKey);
    if (!existing) {
      return { success: false, message: '背包已满！' };
    }
  }

  player.gold -= price;
  const added = addItem(state, shopItem.itemKey, 1);
  if (!added) {
    player.gold += price;
    return { success: false, message: '背包已满（堆叠上限）！' };
  }
  autoSave(state, 'shop_buy');

  const discountNote = price < shopItem.price ? `（折扣价 ${price}g）` : '';
  return { success: true, message: `购买了${shopItem.name}！${discountNote}` };
}

export function getItemPrice(shopItemKey) {
  const item = SHOP_ITEMS[shopItemKey];
  return item ? item.price : 0;
}
