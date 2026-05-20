/**
 * 装备管理器
 * 职责：装备/卸下 + 属性双向修改
 */
import { EQUIPMENT_TYPES } from '../constants';

/**
 * 装备一件物品
 * @returns {{ success: boolean, message: string }}
 */
export function equipItem(state, itemKey) {
  const eq = EQUIPMENT_TYPES[itemKey];
  if (!eq) return { success: false, message: '无效的装备' };

  const { player } = state;
  const slot = eq.slot;

  // 如果槽位已占用，先卸下
  if (player.equipment[slot]) {
    unequipItem(state, slot);
  }

  // 应用加成
  const bonus = eq.bonus;
  if (bonus.attackMin) player.attackMin += bonus.attackMin;
  if (bonus.attackMax) player.attackMax += bonus.attackMax;
  if (bonus.strength) player.strength += bonus.strength;
  if (bonus.defense) player.defense += bonus.defense;
  if (bonus.agility) player.agility += bonus.agility;
  if (bonus.maxHp) {
    player.maxHp += bonus.maxHp;
    player.hp += bonus.maxHp;
  }
  if (bonus.maxMp) {
    player.maxMp += bonus.maxMp;
    player.mp += bonus.maxMp;
  }

  player.equipment[slot] = { itemKey, name: eq.name, slot };

  return { success: true, message: `装备了${eq.name}` };
}

/**
 * 卸下指定槽位的装备
 * @returns {{ success: boolean, message: string }}
 */
export function unequipItem(state, slot) {
  const equipped = state.player.equipment[slot];
  if (!equipped) return { success: false, message: '该槽位无装备' };

  const eq = EQUIPMENT_TYPES[equipped.itemKey];
  if (!eq) return { success: false, message: '无效的装备数据' };

  const { player } = state;
  const bonus = eq.bonus;

  // 反向扣除加成
  if (bonus.attackMin) player.attackMin -= bonus.attackMin;
  if (bonus.attackMax) player.attackMax -= bonus.attackMax;
  if (bonus.strength) player.strength -= bonus.strength;
  if (bonus.defense) player.defense -= bonus.defense;
  if (bonus.agility) player.agility -= bonus.agility;
  if (bonus.maxHp) {
    player.maxHp -= bonus.maxHp;
    player.hp = Math.min(player.hp, player.maxHp);
  }
  if (bonus.maxMp) {
    player.maxMp -= bonus.maxMp;
    player.mp = Math.min(player.mp, player.maxMp);
  }

  player.equipment[slot] = null;

  return { success: true, message: `卸下了${eq.name}` };
}

/**
 * 获取装备配置信息
 */
export function getEquipmentInfo(itemKey) {
  return EQUIPMENT_TYPES[itemKey] || null;
}

/**
 * 获取当前已装备的物品
 */
export function getEquippedItems(state) {
  return state.player.equipment;
}

/**
 * 获取Boss专属掉落装备
 */
export function getBossEquipment(bossKey) {
  for (const key of Object.keys(EQUIPMENT_TYPES)) {
    if (EQUIPMENT_TYPES[key].bossDrop === bossKey) {
      return key;
    }
  }
  return null;
}

/**
 * 获取随机普通装备（掉落用）
 */
export function getRandomEquipment() {
  const nonBoss = Object.keys(EQUIPMENT_TYPES).filter(
    k => !EQUIPMENT_TYPES[k].bossDrop
  );
  if (nonBoss.length === 0) return null;
  return nonBoss[Math.floor(Math.random() * nonBoss.length)];
}
