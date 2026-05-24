import { MONSTER_TYPES, ELITE_MODIFIERS, ELITE_CHANCE } from './constants';
import { findEmptyCell } from './map';
import { initAnimState } from './animation/animationManager';

/**
 * 生成一个新怪物（含精英怪判定）
 * @param {object} playerPos - 玩家位置
 * @param {Array} obstacles - 障碍物数组
 * @param {Array} [pool] - 可选，限定怪物类型池（如 ['GOBLIN', 'SLIME']）
 */
export function generateMonster(playerPos, obstacles, pool) {
  const pos = findEmptyCell(playerPos, obstacles);

  const typeKeys = pool || Object.keys(MONSTER_TYPES);
  const typeKey = typeKeys[Math.floor(Math.random() * typeKeys.length)];
  const type = MONSTER_TYPES[typeKey];

  const monster = {
    x: pos.x,
    y: pos.y,
    hp: type.hp,
    maxHp: type.maxHp,
    name: type.name,
    isDefending: false,
    typeKey,
    color: type.color,
    attackMin: type.attackMin,
    attackMax: type.attackMax,
    attackRate: type.attackRate,
    exp: type.exp,
    flashTimer: 0,
    statusEffects: [],
    isElite: false,
    eliteModifier: null,
  };

  // 精英怪判定
  if (Math.random() < ELITE_CHANCE) {
    applyEliteModifier(monster);
  }

  // Phase 13: 初始化动画状态
  initAnimState(monster);

  return monster;
}

/**
 * 给怪物施加精英词缀
 */
function applyEliteModifier(monster) {
  const modifierKeys = Object.keys(ELITE_MODIFIERS);
  const key = modifierKeys[Math.floor(Math.random() * modifierKeys.length)];
  const mod = ELITE_MODIFIERS[key];

  monster.isElite = true;
  monster.eliteModifier = mod;

  // 属性加成
  monster.hp = Math.floor(monster.hp * mod.hpMult);
  monster.maxHp = Math.floor(monster.maxHp * mod.hpMult);
  monster.attackMin = Math.floor(monster.attackMin * mod.atkMult);
  monster.attackMax = Math.floor(monster.attackMax * mod.atkMult);
  monster.exp = Math.floor(monster.exp * 1.5);

  // 名字前缀
  monster.name = `[${mod.name}]${monster.name}`;
}
