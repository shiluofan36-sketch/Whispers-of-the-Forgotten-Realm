import { BOSS_TYPES } from '../constants';
import { findEmptyCell } from '../map';

/**
 * 创建Boss实体
 * @param {object} playerPos - 玩家位置
 * @param {array} obstacles - 障碍物列表
 * @param {string} bossKey - Boss类型key（可选，默认远古巨龙）
 */
export function createBoss(playerPos, obstacles, bossKey) {
  const config = BOSS_TYPES[bossKey] || BOSS_TYPES.ANCIENT_DRAGON;
  const pos = findEmptyCell(playerPos, obstacles);

  return {
    x: pos.x,
    y: pos.y,
    hp: config.hp,
    maxHp: config.maxHp,
    name: config.name,
    isDefending: false,
    bossKey: config.bossKey,
    color: config.color,
    attackMin: config.attackMin,
    attackMax: config.attackMax,
    attackRate: 0.5,  // Boss走独立AI，此字段未使用
    exp: config.exp,
    enraged: false,
    flashTimer: 0,
    statusEffects: [],
  };
}
