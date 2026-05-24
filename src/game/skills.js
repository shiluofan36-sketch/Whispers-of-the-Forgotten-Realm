import { SKILLS } from './constants';

export function getSkillInfo(skillKey) {
  return SKILLS[skillKey];
}

export function canUseSkill(state, skillKey) {
  const skill = SKILLS[skillKey];
  if (!skill) return false;
  if (state.player.mp < skill.mp) return false;
  // Cooldown check
  if (skill.cooldown > 0) {
    const cd = state.skillCooldowns?.[skillKey] || 0;
    if (cd > 0) return false;
  }
  return true;
}

export function getSkillCooldown(state, skillKey) {
  if (!state.skillCooldowns) return 0;
  return state.skillCooldowns[skillKey] || 0;
}

export function setSkillCooldown(state, skillKey) {
  if (!state.skillCooldowns) state.skillCooldowns = {};
  const skill = SKILLS[skillKey];
  if (skill?.cooldown > 0) {
    state.skillCooldowns[skillKey] = skill.cooldown;
  }
}

export function tickCooldowns(state) {
  if (!state.skillCooldowns) return;
  for (const key of Object.keys(state.skillCooldowns)) {
    if (state.skillCooldowns[key] > 0) {
      state.skillCooldowns[key] -= 1;
    }
  }
}

export function getAllSkills() {
  return SKILLS;
}
