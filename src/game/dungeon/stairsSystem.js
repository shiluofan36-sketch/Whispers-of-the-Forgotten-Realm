/**
 * 楼梯系统：锁定/解锁/状态查询
 * 规则：进入新层时楼梯锁定，清空当前层所有怪物后解锁
 */
export function isStairsLocked(state) {
  return state.stairsLocked;
}

export function lockStairs(state) {
  state.stairsLocked = true;
}

export function unlockStairs(state) {
  state.stairsLocked = false;
}

/**
 * 检查玩家是否可以进入楼梯
 * 返回 { allowed: boolean, reason: string }
 */
export function canUseStairs(state) {
  if (!state.stairs) {
    return { allowed: false, reason: '' };
  }
  if (state.stairsLocked) {
    return { allowed: false, reason: '必须清除当前层所有怪物！' };
  }
  return { allowed: true, reason: '' };
}
