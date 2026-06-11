import { ITEM_TYPES } from './constants';

/**
 * 随机返回一种道具类型的 key
 */
export function getRandomItem() {
  const keys = Object.keys(ITEM_TYPES).filter(k => !ITEM_TYPES[k].adminOnly);
  if (keys.length === 0) return null;
  return keys[Math.floor(Math.random() * keys.length)];
}

/**
 * 获取道具的显示信息
 */
export function getItemInfo(itemKey) {
  return ITEM_TYPES[itemKey] || null;
}
