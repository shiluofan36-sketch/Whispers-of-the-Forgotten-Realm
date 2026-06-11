// 世界状态记忆管理器
export const FLAGS = {
  // 事件flag
  SHRINE_DESTROYED: 'shrineDestroyed',
  MERCHANT_SAVED: 'merchantSaved',
  ANCIENT_GATE_OPENED: 'ancientGateOpened',
  CURSE_LIFTED: 'curseLifted',
  // Boss flag
  DRAGON_SLAIN: 'dragonSlain',
  DEMON_SLAIN: 'demonSlain',
  SHADOW_SLAIN: 'shadowSlain',
  FIRE_ELEMENTAL_SLAIN: 'fireElementalSlain',
  NECROMANCER_SLAIN: 'necromancerSlain',
  // 探索flag
  FULL_CLEAR_FLOOR_1: 'fullClearFloor1',
  FULL_CLEAR_FLOOR_5: 'fullClearFloor5',
  FULL_CLEAR_FLOOR_9: 'fullClearFloor9',
  // 特殊
  LORE_HALF_COLLECTED: 'loreHalfCollected',
  ALL_LORE_COLLECTED: 'allLoreCollected',
  // 教程
  TUTORIAL_COMPLETED: 'tutorialCompleted',
};

export function setWorldFlag(state, flag) {
  if (!state.worldFlags) state.worldFlags = {};
  state.worldFlags[flag] = true;
}

export function hasWorldFlag(state, flag) {
  return !!(state.worldFlags && state.worldFlags[flag]);
}

export function countWorldFlags(state) {
  return state.worldFlags ? Object.keys(state.worldFlags).length : 0;
}
