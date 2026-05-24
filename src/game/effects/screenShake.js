/**
 * 屏幕震动效果
 * Boss技能时触发轻微震动
 */

/**
 * 触发屏幕震动
 * @param {object} state
 * @param {number} intensity - 震动强度（像素），建议 3~6
 * @param {number} duration - 持续时间（秒），建议 0.1~0.2
 */
export function triggerScreenShake(state, intensity, duration) {
  if (!state.screenShake) {
    state.screenShake = { intensity: 0, duration: 0, timer: 0 };
  }
  state.screenShake.intensity = intensity;
  state.screenShake.duration = duration;
  state.screenShake.timer = duration;
}

/**
 * 每帧更新震动计时器
 */
export function updateScreenShake(state, dt) {
  if (!state.screenShake) return;
  const ss = state.screenShake;
  if (ss.timer > 0) {
    ss.timer = Math.max(0, ss.timer - dt);
  }
}

/**
 * 获取当前帧的震动偏移量
 * @returns {{ dx: number, dy: number }}
 */
export function getScreenShakeOffset(state) {
  if (!state.screenShake || state.screenShake.timer <= 0) {
    return { dx: 0, dy: 0 };
  }
  const ss = state.screenShake;
  const progress = ss.timer / ss.duration; // 1→0，越往后越弱
  const currentIntensity = ss.intensity * progress;
  return {
    dx: (Math.random() - 0.5) * 2 * currentIntensity,
    dy: (Math.random() - 0.5) * 2 * currentIntensity,
  };
}
