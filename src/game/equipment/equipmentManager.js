import { EQUIPMENT_TYPES } from '../constants';
import { tryAddItem } from '../inventory/stackSystem';

const STAT_KEYS = [
  'attackMin', 'attackMax', 'strength', 'defense', 'agility',
  'maxHp', 'maxMp', 'critRateBonus', 'critDamageBonus', 'lifesteal',
  'poisonChance', 'burnChance', 'freezeChance', 'dodgeRate', 'thorns', 'healPower',
];

function applyStatBonuses(player, bonus, multiplier) {
  for (const key of STAT_KEYS) {
    if (bonus[key]) {
      player[key] = (player[key] || 0) + bonus[key] * multiplier;
    }
  }
  // HP/MP 边界保护
  if (bonus.maxHp) {
    if (multiplier < 0) player.hp = Math.min(player.hp, player.maxHp);
  }
  if (bonus.maxMp) {
    if (multiplier < 0) player.mp = Math.min(player.mp, player.maxMp);
  }
}

export function equipItem(state, itemKey, generatedData) {
  const eq = EQUIPMENT_TYPES[itemKey];
  if (!eq) return { success: false, message: '无效的装备' };

  const { player } = state;
  const slot = eq.slot;

  if (player.equipment[slot]) {
    unequipItem(state, slot);
  }

  // Use generated bonuses if available, otherwise base bonuses
  const bonuses = generatedData ? generatedData.bonus : eq.bonus;
  const displayName = generatedData ? generatedData.name : eq.name;
  const rarity = generatedData ? generatedData.rarity : eq.rarity;
  const buildTags = generatedData ? generatedData.buildTags : [];

  if (!bonuses) {
    return { success: false, message: `装备数据异常：缺少属性加成 ${itemKey}` };
  }

  applyStatBonuses(player, bonuses, 1);
  player.equipment[slot] = {
    itemKey, name: displayName, slot, rarity: rarity || 'common',
    buildTags, generated: generatedData,
  };

  return { success: true, message: `装备了${displayName}` };
}

export function unequipItem(state, slot) {
  const equipped = state.player.equipment[slot];
  if (!equipped) return { success: false, message: '该槽位无装备' };

  const eq = EQUIPMENT_TYPES[equipped.itemKey];
  if (!eq) return { success: false, message: '无效的装备数据' };

  // Use generated bonuses if available
  const bonuses = equipped.generated ? equipped.generated.bonus : eq.bonus;
  applyStatBonuses(state.player, bonuses, -1);

  // Put back into inventory (respect capacity)
  if (equipped.generated) {
    const added = tryAddItem(state.inventory, state.inventorySlots, equipped.itemKey, 1, equipped.generated);
    if (!added) {
      state.battleLog.push('背包已满，卸下失败！');
      return { success: false, message: '背包已满，卸下失败！' };
    }
  } else {
    const added = tryAddItem(state.inventory, state.inventorySlots, equipped.itemKey, 1, null);
    if (!added) {
      state.battleLog.push('背包已满，卸下失败！');
      return { success: false, message: '背包已满，卸下失败！' };
    }
  }

  state.player.equipment[slot] = null;

  return { success: true, message: `卸下了${equipped.name}` };
}

export function getRarityColor(rarity) {
  switch (rarity) {
    case 'legendary': return 'text-rarity-legendary';
    case 'epic':      return 'text-rarity-epic';
    case 'rare':      return 'text-rarity-rare';
    default:          return 'text-rarity-common';
  }
}

export function getRarityHex(rarity) {
  switch (rarity) {
    case 'legendary': return '#F59E0B';
    case 'epic':      return '#A855F7';
    case 'rare':      return '#3B82F6';
    default:          return '#9CA3AF';
  }
}

export function getRarityLabel(rarity) {
  switch (rarity) {
    case 'legendary': return '传说';
    case 'epic':      return '史诗';
    case 'rare':      return '稀有';
    default:          return '普通';
  }
}

export function getBonusText(bonus) {
  const parts = [];
  if (bonus.attackMin) parts.push(`+${bonus.attackMin}最小攻击`);
  if (bonus.attackMax) parts.push(`+${bonus.attackMax}最大攻击`);
  if (bonus.strength) parts.push(`+${bonus.strength}力量`);
  if (bonus.defense) parts.push(`${bonus.defense >= 0 ? '+' : ''}${bonus.defense}防御`);
  if (bonus.agility) parts.push(`+${bonus.agility}敏捷`);
  if (bonus.maxHp) parts.push(`+${bonus.maxHp}HP`);
  if (bonus.maxMp) parts.push(`+${bonus.maxMp}MP`);
  if (bonus.critRateBonus) parts.push(`+${Math.round(bonus.critRateBonus * 100)}%暴击率`);
  if (bonus.critDamageBonus) parts.push(`+${Math.round(bonus.critDamageBonus * 100)}%暴伤`);
  if (bonus.lifesteal) parts.push(`+${Math.round(bonus.lifesteal * 100)}%吸血`);
  if (bonus.poisonChance) parts.push(`+${Math.round(bonus.poisonChance * 100)}%中毒`);
  if (bonus.burnChance) parts.push(`+${Math.round(bonus.burnChance * 100)}%灼烧`);
  if (bonus.freezeChance) parts.push(`+${Math.round(bonus.freezeChance * 100)}%冻结`);
  if (bonus.dodgeRate) parts.push(`+${Math.round(bonus.dodgeRate * 100)}%闪避`);
  if (bonus.thorns) parts.push(`+${bonus.thorns}荆棘`);
  if (bonus.healPower) parts.push(`+${Math.round(bonus.healPower * 100)}%治疗`);
  return parts.join(' / ');
}

export function getEquipmentInfo(itemKey) {
  return EQUIPMENT_TYPES[itemKey] || null;
}

export function getEquippedItems(state) {
  return state.player.equipment;
}

export function getBossEquipment(bossKey) {
  for (const key of Object.keys(EQUIPMENT_TYPES)) {
    if (EQUIPMENT_TYPES[key].bossDrop === bossKey) {
      return key;
    }
  }
  return null;
}

export function getRandomEquipment() {
  const nonBoss = Object.keys(EQUIPMENT_TYPES).filter(
    k => !EQUIPMENT_TYPES[k].bossDrop && !EQUIPMENT_TYPES[k].adminOnly
  );
  if (nonBoss.length === 0) return null;
  return nonBoss[Math.floor(Math.random() * nonBoss.length)];
}

export function applyStatBonusesExternal(player, bonus, multiplier) {
  applyStatBonuses(player, bonus, multiplier);
}
