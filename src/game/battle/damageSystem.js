import { BASE_CRIT, AGI_CRIT, CRIT_MULT } from '../constants';

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 计算玩家对怪物的伤害（含暴击 + 怪物防御处理）
 */
export function calcPlayerDamage(player, monster) {
  let baseDmg = randomInt(player.attackMin, player.attackMax);
  baseDmg += player.strength;

  const critRate = BASE_CRIT + player.agility * AGI_CRIT;
  const isCrit = Math.random() < critRate;
  let total = isCrit ? Math.floor(baseDmg * CRIT_MULT) : baseDmg;

  if (monster.isDefending) {
    total = Math.floor(total / 2);
    monster.isDefending = false;
  }

  return { damage: total, isCrit };
}

/**
 * 计算怪物对玩家的伤害并应用到HP
 * 含防御属性 + 护盾 + 防御卷轴 + 防御姿态，自动消耗一次性buff
 */
export function applyMonsterDamage(state, rawDamage) {
  const { player } = state;
  let reduced = Math.max(1, rawDamage - player.defense);

  const notes = [];

  if (player.shieldTurns > 0) {
    reduced = Math.floor(reduced / 2);
    notes.push('护盾减半');
  }

  if (player.defenseBuff > 0) {
    reduced = Math.floor(reduced / 2);
    player.defenseBuff -= 1;
    notes.push('防御卷轴减半');
  }

  if (player.isDefending) {
    reduced = Math.floor(reduced / 2);
    player.isDefending = false;
    notes.push('防御姿态减半');
  }

  player.hp = Math.max(0, player.hp - reduced);
  return { damage: reduced, notes };
}
