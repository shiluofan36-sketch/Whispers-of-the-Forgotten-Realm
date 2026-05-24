/**
 * 实体受击闪烁
 * 怪物受击短暂红闪，Boss更明显
 */

const FLASH_DURATION = 0.15;     // 普通怪物闪烁时长
const BOSS_FLASH_DURATION = 0.25; // Boss闪烁时长
const PLAYER_FLASH_DURATION = 0.1;

/**
 * 触发实体闪烁
 */
export function triggerEntityFlash(entity, isBoss) {
  if (isBoss) {
    entity.flashTimer = BOSS_FLASH_DURATION;
  } else {
    entity.flashTimer = FLASH_DURATION;
  }
}

/**
 * 触发玩家闪烁
 */
export function triggerPlayerFlash(player) {
  player.flashTimer = PLAYER_FLASH_DURATION;
}

/**
 * 每帧更新所有实体的flashTimer
 */
export function updateEntityFlashTimers(state, dt) {
  const clamped = Math.min(dt, 0.1);

  if (state.player.flashTimer > 0) {
    state.player.flashTimer = Math.max(0, state.player.flashTimer - clamped);
  }

  if (state.monster && state.monster.flashTimer > 0) {
    state.monster.flashTimer = Math.max(0, state.monster.flashTimer - clamped);
  }
}
