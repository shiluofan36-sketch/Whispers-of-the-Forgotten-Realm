// 精灵管理器：缓存查找 + 生命周期
import { generateAllSprites } from './spriteGenerator';

let spriteCache = null;

export function initSpriteCache() {
  if (spriteCache) return;
  spriteCache = generateAllSprites();
}

/**
 * @param {string} entityType - 'player' | monster typeKey | boss key
 * @param {string} animType - 'idle' | 'attack' | 'hurt' | 'death' | 'enrage'
 * @param {number} frameIndex - 帧索引
 * @param {string} direction - 'down' | 'up' | 'left' | 'right'
 */
export function getSpriteFrame(entityType, animType, frameIndex, direction = 'down') {
  if (!spriteCache) return null;

  const bossKey = `boss:${entityType}:${animType}:${direction}`;
  const normalKey = `${entityType}:${animType}:${direction}`;

  const frames = spriteCache.get(bossKey) || spriteCache.get(normalKey);
  if (!frames) return null;

  const idx = frameIndex % frames.length;
  return frames[idx];
}

export function getAnimationFrameCount(entityType, animType) {
  if (!spriteCache) return 4;

  const bossKey = `boss:${entityType}:${animType}:down`;
  const normalKey = `${entityType}:${animType}:down`;
  const frames = spriteCache.get(bossKey) || spriteCache.get(normalKey);
  return frames ? frames.length : 4;
}

export function hasSpriteData(entityType) {
  if (!spriteCache) return false;
  return spriteCache.has(`${entityType}:idle:down`) || spriteCache.has(`boss:${entityType}:idle:down`);
}
