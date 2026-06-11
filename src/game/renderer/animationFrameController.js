// 动画帧控制器：将 entity.animState 映射到精灵帧索引

const FRAME_DURATION = {
  idle: 0.5,
  walk: 0.12,
  attack: 0.08,
  hurt: 0.07,
  death: 0.06,
  enrage: 0.15,
};

/**
 * @param {object} entity - 带有 animState 的实体
 * @param {number} globalTime - 全局时间（用于 idle/walk 循环）
 * @returns {{ animType: string, frameIndex: number }}
 */
export function getCurrentFrame(entity, globalTime) {
  const anim = entity.animState;
  if (!anim) return { animType: 'idle', frameIndex: 0 };

  const animType = mapAnimType(anim.type);
  const duration = FRAME_DURATION[animType] || 0.1;

  if (anim.type === 'idle' || anim.type === 'walk') {
    const frameIndex = Math.floor(globalTime / duration) % getTotalFrames(animType);
    return { animType, frameIndex };
  }

  const elapsed = anim.duration - Math.max(0, anim.timer);
  const totalFrames = getTotalFrames(animType);
  const rawProgress = Math.min(elapsed / (anim.duration || duration), 1);
  const frameIndex = Math.min(Math.floor(rawProgress * totalFrames), totalFrames - 1);

  return { animType, frameIndex };
}

function mapAnimType(animType) {
  switch (animType) {
    case 'idle':     return 'idle';
    case 'walk':     return 'idle';  // walk 复用 idle 精灵帧
    case 'lunge':    return 'attack';
    case 'hitReact': return 'hurt';
    case 'death':    return 'death';
    case 'enrage':   return 'enrage';
    default:         return 'idle';
  }
}

function getTotalFrames(animType) {
  switch (animType) {
    case 'idle':   return 4;
    case 'walk':   return 4;
    case 'attack': return 4;
    case 'hurt':   return 2;
    case 'death':  return 4;
    case 'enrage': return 4;
    default:       return 4;
  }
}

export { FRAME_DURATION };
