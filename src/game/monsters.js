import { MONSTER_TYPES } from './constants';
import { findEmptyCell } from './map';

/**
 * 生成一个新怪物
 * @param {object} playerPos - 玩家位置
 * @param {Array} obstacles - 障碍物数组
 * @param {Array} [pool] - 可选，限定怪物类型池（如 ['GOBLIN', 'SLIME']）
 * 纯数据驱动：新增怪物类型只需在 MONSTER_TYPES 中加配置
 */
export function generateMonster(playerPos, obstacles, pool) {
  const pos = findEmptyCell(playerPos, obstacles);

  const typeKeys = pool || Object.keys(MONSTER_TYPES);
  const typeKey = typeKeys[Math.floor(Math.random() * typeKeys.length)];
  const type = MONSTER_TYPES[typeKey];

  return {
    x: pos.x,
    y: pos.y,
    hp: type.hp,
    maxHp: type.maxHp,
    name: type.name,
    isDefending: false,
    // 类型特有属性（从配置复制）
    typeKey,
    color: type.color,
    attackMin: type.attackMin,
    attackMax: type.attackMax,
    attackRate: type.attackRate,
    exp: type.exp,
  };
}
