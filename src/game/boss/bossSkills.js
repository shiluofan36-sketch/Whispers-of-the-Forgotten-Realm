import { BOSS_TYPES } from '../constants';
import { applyMonsterDamage } from '../battle/damageSystem';

/**
 * Boss特殊攻击（火焰吐息/暗影箭等，从配置读取技能名和伤害值）
 */
export function bossSpecialAttack(state, skill) {
  const boss = state.monster;
  const { damage, notes } = applyMonsterDamage(state, skill.damage);
  const noteStr = notes.length > 0 ? `（${notes.join('，')}）` : '';
  state.battleLog.push(`${boss.name}使用${skill.name}！造成${damage}点伤害${noteStr}`);
}

/**
 * Boss治疗技能（生命吸取等）
 */
export function bossHeal(state, skill) {
  const boss = state.monster;
  const actualHeal = Math.min(skill.healAmount, boss.maxHp - boss.hp);
  boss.hp += actualHeal;
  state.battleLog.push(`${boss.name}使用${skill.name}，恢复了${actualHeal}点生命！`);
}

/**
 * Boss普通攻击
 */
export function bossAttack(state) {
  const { monster } = state;
  const baseDmg = Math.floor(
    Math.random() * (monster.attackMax - monster.attackMin + 1)
  ) + monster.attackMin;
  const { damage, notes } = applyMonsterDamage(state, baseDmg);
  const noteStr = notes.length > 0 ? `（${notes.join('，')}）` : '';
  state.battleLog.push(`${monster.name}对你造成${damage}点伤害${noteStr}`);
}

/**
 * Boss防御
 */
export function bossDefend(state) {
  state.monster.isDefending = true;
  state.battleLog.push(`${state.monster.name}进入防御姿态`);
}

/**
 * 检查并触发Boss狂暴
 */
export function checkBossEnrage(state) {
  const boss = state.monster;
  if (!boss || !boss.bossKey) return;

  const config = BOSS_TYPES[boss.bossKey];
  if (!boss.enraged && boss.hp / boss.maxHp <= config.enrageThreshold) {
    boss.enraged = true;
    boss.attackMin += config.enrageAtkBonus;
    boss.attackMax += config.enrageAtkBonus;
    state.battleLog.push(`${boss.name}进入狂暴状态！攻击力大幅提升！`);
  }
}
