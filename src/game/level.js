import {
  EXP_BASE,
  LEVEL_UP_HP, LEVEL_UP_ATK_MIN, LEVEL_UP_ATK_MAX,
  LEVEL_UP_MP, LEVEL_UP_STR, LEVEL_UP_DEF, LEVEL_UP_AGI,
} from './constants';
import { autoSave } from './save/saveManager';
import { checkAchievements } from './achievements/achievementManager';

/**
 * 给玩家增加经验，并自动处理升级（支持一次性升多级）
 */
export function addExp(state, amount) {
  state.player.exp += amount;
  state.battleLog.push(`获得 ${amount} EXP`);

  while (canLevelUp(state)) {
    levelUp(state);
  }
}

/**
 * 检查当前经验是否足够升级
 */
export function canLevelUp(state) {
  return state.player.exp >= state.player.level * EXP_BASE;
}

/**
 * 执行升级：消耗经验，提升所有属性，HP/MP回满
 */
export function levelUp(state) {
  const p = state.player;
  p.exp -= p.level * EXP_BASE;
  p.level += 1;
  p.maxHp += LEVEL_UP_HP;
  p.hp = p.maxHp;
  p.attackMin += LEVEL_UP_ATK_MIN;
  p.attackMax += LEVEL_UP_ATK_MAX;
  p.maxMp += LEVEL_UP_MP;
  p.mp = p.maxMp;
  p.strength += LEVEL_UP_STR;
  p.defense += LEVEL_UP_DEF;
  p.agility += LEVEL_UP_AGI;
  state.battleLog.push(`升级！达到 LV${p.level}！`);
  checkAchievements(state, { type: 'level_up' });
  autoSave(state, 'level_up');
}

/**
 * 获取升到下一级需要的总经验值
 */
export function getExpToNext(state) {
  return state.player.level * EXP_BASE;
}
