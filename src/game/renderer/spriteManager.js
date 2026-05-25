// 精灵管理器：缓存查找 + 生命周期
import { generateAllSprites } from './spriteGenerator';

let spriteCache = null;

/**
 * 初始化精灵缓存（游戏启动时调用一次）
 */
export function initSpriteCache() {
  if (spriteCache) return;
  spriteCache = generateAllSprites();
}

/**
 * 获取指定实体的精灵帧
 * @param {string} entityType - 'player' | monster typeKey | boss key
 * @param {string} animType - 'idle' | 'attack' | 'hurt' | 'death' | 'enrage'
 * @param {number} frameIndex - 帧索引
 * @returns {CanvasImageSource|null}
 */
export function getSpriteFrame(entityType, animType, frameIndex) {
  if (!spriteCache) return null;

  // Boss 实体使用 boss: 前缀
  const bossKey = `boss:${entityType}:${animType}`;
  const normalKey = `${entityType}:${animType}`;

  let frames = spriteCache.get(bossKey) || spriteCache.get(normalKey);
  if (!frames) return null;

  // 循环帧索引
  const idx = frameIndex % frames.length;
  return frames[idx];
}

/**
 * 获取指定动画类型的总帧数
 */
export function getAnimationFrameCount(entityType, animType) {
  if (!spriteCache) return 4;

  const bossKey = `boss:${entityType}:${animType}`;
  const normalKey = `${entityType}:${animType}`;
  const frames = spriteCache.get(bossKey) || spriteCache.get(normalKey);
  return frames ? frames.length : 4;
}

/**
 * 检查精灵缓存中是否存在某个实体类型
 */
export function hasSpriteData(entityType) {
  if (!spriteCache) return false;
  return spriteCache.has(`${entityType}:idle`) || spriteCache.has(`boss:${entityType}:idle`);
}
