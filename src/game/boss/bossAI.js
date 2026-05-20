import { BOSS_TYPES } from '../constants';
import { bossSpecialAttack, bossHeal, bossAttack, bossDefend, checkBossEnrage } from './bossSkills';

/**
 * Boss AI：遍历 skill 数组，按概率选择行动
 * 行动前检查是否触发狂暴
 */
export function executeBossAction(state) {
  const boss = state.monster;
  const config = BOSS_TYPES[boss.bossKey];

  // 狂暴检查（行动前）
  checkBossEnrage(state);

  // 遍历技能列表，按概率决定行动
  const roll = Math.random();
  let cumulative = 0;

  for (const skill of config.skills) {
    cumulative += skill.rate;
    if (roll < cumulative) {
      switch (skill.type) {
        case 'damage':
          bossSpecialAttack(state, skill);
          return;
        case 'heal':
          bossHeal(state, skill);
          return;
        case 'defend':
          bossDefend(state);
          return;
      }
    }
  }

  // 剩余概率 → 普通攻击
  bossAttack(state);
}
