/**
 * 动画管理器 — 实体动画状态的生命周期管理
 *
 * 架构：动画状态直接存储在 entity.animState 上（类似 flashTimer），
 * 不持久化到存档。renderer 读取 animState 应用视觉变换。
 *
 * 动画类型：
 *   idle      — 空闲（呼吸由 idlePhase 全局相位驱动）
 *   lunge     — 攻击前冲（朝目标位移→弹回）
 *   hitReact  — 受击抖动 + 微缩放
 *   death     — 死亡淡出 + 放大 + 下坠
 *   enrage    — Boss 狂暴膨胀
 *
 * 扩展：新增动画类型只需在 updateEntityAnim 的 switch 中添加分支。
 */

import { GAME_PHASE } from '../constants';
import { handleBossVictory, handlePostBattleRecovery } from '../battle/rewards/victoryRewards';

// 动画默认时长（秒）
export const ANIM = {
  LUNGE_DURATION: 0.08,
  HIT_REACT_DURATION: 0.12,
  BOSS_HIT_REACT_DURATION: 0.18,
  DEATH_DURATION: 0.25,
  ENRAGE_DURATION: 1.0,
};

/**
 * 初始化实体的动画状态（创建新实体时调用）
 */
export function initAnimState(entity) {
  entity.animState = {
    type: 'idle',
    timer: 0,
    duration: 0,
    dirX: 0,
    dirY: 0,
    distance: 0,
    offsetX: 0,
    offsetY: 0,
    scale: 1,
    opacity: 1,
  };
}

/**
 * 攻击前冲：朝目标方向位移再弹回
 * @param {object} entity - 攻击者实体
 * @param {number} targetX - 目标 grid X
 * @param {number} targetY - 目标 grid Y
 */
export function playAttackLunge(entity, targetX, targetY) {
  const dx = targetX - entity.x;
  const dy = targetY - entity.y;
  const rawDist = Math.sqrt(dx * dx + dy * dy);
  const dist = rawDist || 1;
  let dirX = dx / dist;
  let dirY = dy / dist;

  // 战斗中实体同格，方向向量为0 → 根据类型决定固定方向
  let distance = 10;
  if (rawDist === 0) {
    const isMonster = entity.isMinion || entity.typeKey || entity.bossKey;
    dirX = isMonster ? -1 : 1;
    dirY = 0;
    distance = 100;
  }

  entity.animState = {
    type: 'lunge',
    timer: ANIM.LUNGE_DURATION,
    duration: ANIM.LUNGE_DURATION,
    dirX,
    dirY,
    distance,
    offsetX: 0,
    offsetY: 0,
    scale: 1,
    opacity: 1,
  };
}

/**
 * 受击抖动：随机震动 + 微缩放
 * @param {object} entity - 受击实体
 * @param {boolean} isBoss - Boss 更强反馈
 */
export function playHitReaction(entity, isBoss = false) {
  const dur = isBoss ? ANIM.BOSS_HIT_REACT_DURATION : ANIM.HIT_REACT_DURATION;
  entity.animState = {
    type: 'hitReact',
    timer: dur,
    duration: dur,
    dirX: 0,
    dirY: 0,
    distance: isBoss ? 6 : 4,
    offsetX: 0,
    offsetY: 0,
    scale: 1,
    opacity: 1,
  };
}

/**
 * 死亡动画：淡出 + 放大 + 下坠
 */
export function playDeathAnim(entity) {
  entity.animState = {
    type: 'death',
    timer: ANIM.DEATH_DURATION,
    duration: ANIM.DEATH_DURATION,
    dirX: 0,
    dirY: 0,
    distance: 0,
    offsetX: 0,
    offsetY: 0,
    scale: 1,
    opacity: 1,
  };
}

/**
 * Boss 狂暴动画：膨胀脉冲
 */
export function playEnrageAnim(entity) {
  entity.animState = {
    type: 'enrage',
    timer: ANIM.ENRAGE_DURATION,
    duration: ANIM.ENRAGE_DURATION,
    dirX: 0,
    dirY: 0,
    distance: 0,
    offsetX: 0,
    offsetY: 0,
    scale: 1,
    opacity: 1,
  };
}

/**
 * 每帧更新单个实体的动画状态
 * 由 updateAnimationState 调用
 */
export function updateEntityAnim(entity, dt) {
  if (!entity.animState) {
    initAnimState(entity);
    return;
  }

  const anim = entity.animState;

  // idle 不消耗 timer
  if (anim.type === 'idle') {
    anim.offsetX = 0;
    anim.offsetY = 0;
    anim.scale = 1;
    anim.opacity = 1;
    return;
  }

  anim.timer -= dt;
  const raw = Math.max(0, anim.timer / anim.duration); // 1→0

  switch (anim.type) {
    case 'lunge': {
      // 前半段前冲，后半段弹回
      const phase = raw > 0.5 ? (1 - raw) * 2 : raw * 2;
      anim.offsetX = anim.dirX * anim.distance * phase;
      anim.offsetY = anim.dirY * anim.distance * phase;
      anim.scale = 1;
      anim.opacity = 1;
      break;
    }
    case 'hitReact': {
      const intensity = 1 - raw;
      anim.offsetX = (Math.sin(raw * 20) * anim.distance * 0.5) * intensity;
      anim.offsetY = (Math.cos(raw * 23) * anim.distance * 0.3) * intensity;
      anim.scale = 1 - 0.05 * intensity;
      anim.opacity = 1;
      break;
    }
    case 'death': {
      const progress = 1 - raw;
      anim.offsetX = 0;
      anim.offsetY = progress * 8;
      anim.scale = 1 + progress * 0.2;
      anim.opacity = 1 - progress;
      break;
    }
    case 'enrage': {
      // 膨胀→收缩→稳定在 1.08
      const overshoot = Math.sin(raw * Math.PI) * 0.12;
      anim.scale = 1 + overshoot;
      anim.offsetX = 0;
      anim.offsetY = 0;
      anim.opacity = 1;
      break;
    }
  }

  // 动画结束后回到 idle
  if (anim.timer <= 0) {
    anim.type = 'idle';
    anim.offsetX = 0;
    anim.offsetY = 0;
    anim.scale = 1;
    anim.opacity = 1;
  }
}

/**
 * 每帧更新所有实体的动画（由 game.updateEffects 调用）
 */
export function updateAnimationState(state, dt) {
  const clamped = Math.min(dt, 0.1);

  // 更新全局 idle 相位（用于呼吸动画）
  if (!state.animation) state.animation = {};
  if (state.animation.idlePhase == null) state.animation.idlePhase = 0;
  state.animation.idlePhase += clamped;

  updateEntityAnim(state.player, clamped);

  if (state.monster) {
    updateEntityAnim(state.monster, clamped);

    // 死亡动画完成后的阶段切换
    if (state.monster.pendingDeath && !state.monster.deathAnimComplete) {
      const ma = state.monster.animState;
      if (!ma || ma.type === 'idle') {
        state.monster.deathAnimComplete = true;

        if (state.isBossFloor) {
          handleBossVictory(state, state.monster);
        } else if (state.enemiesRemaining > 0) {
          handlePostBattleRecovery(state);
          state.gamePhase = GAME_PHASE.EXPLORATION;
        } else {
          state.monster = null;
          state.gamePhase = GAME_PHASE.EXPLORATION;
        }
      }
    }
  }

  // Boss 小兵动画（清理死亡小兵）
  if (state.bossMinions) {
    for (let i = state.bossMinions.length - 1; i >= 0; i--) {
      updateEntityAnim(state.bossMinions[i], clamped);
      if (state.bossMinions[i].pendingDeath && !state.bossMinions[i].deathAnimComplete) {
        const ma = state.bossMinions[i].animState;
        if (!ma || ma.type === 'idle') {
          state.bossMinions[i].deathAnimComplete = true;
          state.bossMinions.splice(i, 1);
        }
      }
    }
  }
}
