import { FLOOR_HP_SCALE, FLOOR_ATK_SCALE } from '../constants';

/**
 * 根据楼层缩放怪物属性
 * Floor 1: 无缩放
 * Floor N: HP * (1 + scale * (N-1)), ATK * (1 + scale * (N-1))
 */
export function scaleMonsterForFloor(monster, floor, ascensionLevel = 0) {
  const hpMult = (1 + FLOOR_HP_SCALE * (floor - 1)) * (1 + ascensionLevel * 0.15);
  const atkMult = (1 + FLOOR_ATK_SCALE * (floor - 1)) * (1 + ascensionLevel * 0.10);

  monster.hp = Math.floor(monster.hp * hpMult);
  monster.maxHp = Math.floor(monster.maxHp * hpMult);
  monster.attackMin = Math.floor(monster.attackMin * atkMult);
  monster.attackMax = Math.floor(monster.attackMax * atkMult);

  return monster;
}

export function getAscensionLootBonus(ascensionLevel) {
  return Math.min(ascensionLevel * 0.02, 0.20); // +2% rare+ per level, max 20%
}

/**
 * 根据楼层获取掉落率加成
 */
export function getFloorDropRate(floor, baseRate, bonus) {
  return baseRate + bonus;
}
