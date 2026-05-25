// 动画帧控制器：将 entity.animState 映射到精灵帧索引
// 与 animationManager 完全解耦——只读取 animState，不修改

// 每帧时长（秒）
const FRAME_DURATION = {
  idle: 0.5,    // 空闲呼吸，慢速循环
  attack: 0.08, // 攻击动画，快速切换（配合 ANIM.LUNGE_DURATION = 0.08）
  hurt: 0.07,   // 受击（配合 ANIM.HIT_REACT_DURATION = 0.12）
  death: 0.06,  // 死亡（配合 ANIM.DEATH_DURATION = 0.25）
  enrage: 0.15, // 狂暴（配合 ANIM.ENRAGE_DURATION = 1.0）
};

/**
 * 获取当前应该显示的精灵帧索引
 * @param {object} entity - 带有 animState 的实体
 * @param {number} globalTime - 全局时间（用于 idle 循环）
 * @returns {{ animType: string, frameIndex: number }}
 */
export function getCurrentFrame(entity, globalTime) {
  const anim = entity.animState;
  if (!anim) return { animType: 'idle', frameIndex: 0 };

  const animType = mapAnimType(anim.type);
  const duration = FRAME_DURATION[animType] || 0.1;

  if (anim.type === 'idle') {
    // idle 使用全局时间驱动，独立于 animState.timer
    const frameIndex = Math.floor(globalTime / duration) % 4;
    return { animType: 'idle', frameIndex };
  }

  // 非idle：根据已消耗时间计算帧
  const elapsed = anim.duration - Math.max(0, anim.timer);
  const totalFrames = getTotalFrames(animType);
  const rawProgress = Math.min(elapsed / (anim.duration || duration), 1);
  const frameIndex = Math.min(Math.floor(rawProgress * totalFrames), totalFrames - 1);

  return { animType, frameIndex };
}

/**
 * 将 animationManager 的动画类型映射到精灵动画类型
 */
function mapAnimType(animType) {
  switch (animType) {
    case 'idle':     return 'idle';
    case 'lunge':    return 'attack';
    case 'hitReact': return 'hurt';
    case 'death':    return 'death';
    case 'enrage':   return 'enrage';
    default:         return 'idle';
  }
}

/**
 * 返回动画的总帧数
 */
function getTotalFrames(animType) {
  switch (animType) {
    case 'idle':   return 4;
    case 'attack': return 4;
    case 'hurt':   return 2;
    case 'death':  return 4;
    case 'enrage': return 4;
    default:       return 4;
  }
}

export { FRAME_DURATION };
