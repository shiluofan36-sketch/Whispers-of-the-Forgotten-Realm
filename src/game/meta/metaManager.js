import { META_UPGRADES } from './metaConfig.js';

export function buyUpgrade(state, upgradeKey) {
  const def = META_UPGRADES[upgradeKey];
  if (!def) return { success: false, message: 'Unknown upgrade' };

  const currentLevel = state.metaProgress[upgradeKey] || 0;
  if (currentLevel >= def.maxLevel) {
    return { success: false, message: `${def.name}已达最高等级` };
  }

  const nextLevel = def.levels[currentLevel + 1];
  if (state.player.gold < nextLevel.cost) {
    return { success: false, message: `金币不足（需要 ${nextLevel.cost}）` };
  }

  state.player.gold -= nextLevel.cost;
  state.metaProgress[upgradeKey] = currentLevel + 1;
  return {
    success: true,
    message: `${def.name}升级到 Lv${currentLevel + 1}！${nextLevel.effect}`,
  };
}

export function applyMetaBonuses(state) {
  const hall = state.metaProgress.adventurerHall || 0;
  if (hall >= 1) {
    state.player.maxHp += 10;
    state.player.hp = state.player.maxHp;
  }
  if (hall >= 2) {
    state.player.maxHp += 15;
    state.player.maxMp += 5;
  }
  if (hall >= 3) {
    state.player.maxHp += 25;
    state.player.maxMp += 5;
    state.player.strength += 2;
  }
  // Full heal after applying bonuses
  state.player.hp = state.player.maxHp;
  state.player.mp = state.player.maxMp;

  // Storage: 增加背包容量
  const storageLevel = state.metaProgress.storage || 0;
  if (storageLevel >= 1) state.inventorySlots += 5;
  if (storageLevel >= 2) state.inventorySlots += 5;
  if (storageLevel >= 3) state.inventorySlots += 10;
}

// Revert meta bonuses when returning to camp
export function revertMetaBonuses(state) {
  // Guard against double revert (no active meta bonuses = no-op)
  if ((state.metaProgress.adventurerHall || 0) === 0 && (state.metaProgress.storage || 0) === 0) return;

  const hall = state.metaProgress.adventurerHall || 0;
  if (hall >= 1) state.player.maxHp -= 10;
  if (hall >= 2) {
    state.player.maxHp -= 15;
    state.player.maxMp -= 5;
  }
  if (hall >= 3) {
    state.player.maxHp -= 25;
    state.player.maxMp -= 5;
    state.player.strength -= 2;
  }
  // HP/MP 边界
  state.player.hp = Math.min(state.player.hp, state.player.maxHp);
  state.player.mp = Math.min(state.player.mp, state.player.maxMp);

  // Revert storage
  const storageLevel = state.metaProgress.storage || 0;
  if (storageLevel >= 1) state.inventorySlots -= 5;
  if (storageLevel >= 2) state.inventorySlots -= 5;
  if (storageLevel >= 3) state.inventorySlots -= 10;
}

export function getUpgradeInfo(upgradeKey) {
  return META_UPGRADES[upgradeKey] || null;
}

export function getShopDiscount(state) {
  const level = state.metaProgress.potionShop || 0;
  const discount = META_UPGRADES.potionShop.levels[level]?.bonus || 0;
  return discount / 100;
}

export function getBlacksmithLevel(state) {
  return state.metaProgress.blacksmith || 0;
}
