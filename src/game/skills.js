import { SKILLS } from './constants';

/**
 * 获取技能配置信息
 */
export function getSkillInfo(skillKey) {
  return SKILLS[skillKey];
}

/**
 * 检查是否有足够MP使用技能
 */
export function canUseSkill(state, skillKey) {
  const skill = SKILLS[skillKey];
  if (!skill) return false;
  return state.player.mp >= skill.mp;
}
