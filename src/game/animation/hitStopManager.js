/**
 * Hit Stop（打击停顿）管理器
 *
 * 原理：暴击/重击时短暂冻结游戏逻辑更新（~50-80ms），
 * 画面保持最后一帧不动，营造"打到了"的重量感。
 * 类似格斗游戏 hitstop / impact freeze。
 *
 * 为什么增强打击感：
 * 人脑将"画面停顿 + 随后恢复"解释为动能传递。
 * 停顿越久（合理范围内），打击感越强。
 * Boss 技能也可用此机制增强威胁感。
 *
 * 实现：在 rAF 循环中检查 hitStopTimer，
 * 若 > 0 则跳过 updateEffects（冻结浮动文字/震动衰减等），
 * 仅保持渲染当前帧。
 */

const DEFAULT_DURATION = 0.06;  // 暴击停顿 60ms
const BOSS_DURATION = 0.1;      // Boss 重击停顿 100ms
const MAX_DURATION = 0.15;      // 上限防止卡死感

/**
 * 触发打击停顿
 * @param {object} state
 * @param {number} duration - 停顿秒数（默认 0.06）
 */
export function triggerHitStop(state, duration = DEFAULT_DURATION) {
  if (!state.animation) state.animation = {};
  const clamped = Math.min(duration, MAX_DURATION);
  state.animation.hitStopTimer = Math.max(
    state.animation.hitStopTimer || 0,
    clamped
  );
}

/**
 * 触发暴击停顿（比普通停顿更长更重）
 */
export function triggerCritHitStop(state) {
  triggerHitStop(state, DEFAULT_DURATION);
}

/**
 * 触发 Boss 重击停顿
 */
export function triggerBossHitStop(state) {
  triggerHitStop(state, BOSS_DURATION);
}

/**
 * 每帧更新（返回 true 表示当前帧处于停顿中）
 */
export function updateHitStop(state, dt) {
  if (!state.animation || !state.animation.hitStopTimer) return false;
  state.animation.hitStopTimer = Math.max(0, state.animation.hitStopTimer - dt);
  return state.animation.hitStopTimer > 0;
}

/**
 * 当前是否处于 Hit Stop 中
 */
export function isHitStopActive(state) {
  return !!(state.animation && state.animation.hitStopTimer > 0);
}
