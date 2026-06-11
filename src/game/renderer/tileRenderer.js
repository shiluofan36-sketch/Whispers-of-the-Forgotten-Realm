// 瓦片渲染器：程序化生成 → 离屏Canvas缓存 → 绘制
import { CELL_SIZE, BIOME_PALETTES } from '../constants';
import { FLOOR_GENERATORS, OBSTACLE_GENERATORS, genWall, genStairs } from './tileGenerator';

const tileCache = new Map();
const floorVariantCache = new Map(); // biome → floor tiles array

function cacheKey(biome, tileType) {
  return `${biome}:${tileType}`;
}

function getPalette(biome) {
  return BIOME_PALETTES[biome] || BIOME_PALETTES.forest;
}

/**
 * 预生成所有瓦片缓存
 */
export function initTileCache() {
  if (tileCache.size > 0) return;

  const biomes = Object.keys(BIOME_PALETTES);

  for (const biome of biomes) {
    const palette = getPalette(biome);

    // 地板变体
    const floorVariants = [];
    for (const [floorType, { fn, variants }] of Object.entries(FLOOR_GENERATORS)) {
      for (let v = 0; v < variants; v++) {
        const canvas = fn(palette);
        floorVariants.push({ type: floorType, canvas });
        tileCache.set(cacheKey(biome, `${floorType}_v${v}`), canvas);
      }
    }
    floorVariantCache.set(biome, floorVariants);

    // 障碍物
    for (const [obsType, genFn] of Object.entries(OBSTACLE_GENERATORS)) {
      const canvas = genFn(palette);
      tileCache.set(cacheKey(biome, `obstacle_${obsType}`), canvas);
    }

    // 墙壁
    tileCache.set(cacheKey(biome, 'wall'), genWall(palette));

    // 楼梯
    tileCache.set(cacheKey(biome, 'stairs_unlocked'), genStairs(palette, false));
    tileCache.set(cacheKey(biome, 'stairs_locked'), genStairs(palette, true));
  }
}

/**
 * 获取缓存的瓦片
 */
function getCachedTile(biome, tileType) {
  return tileCache.get(cacheKey(biome, tileType));
}

/**
 * 绘制单个瓦片
 */
export function drawTile(ctx, biome, tileType, col, row) {
  const canvas = getCachedTile(biome, tileType);
  if (canvas) {
    ctx.drawImage(canvas, col * CELL_SIZE, row * CELL_SIZE);
  }
}

/**
 * 绘制整个背景（随机混搭地板变体）
 */
export function drawTileBackground(ctx, biome) {
  const variants = floorVariantCache.get(biome);
  if (!variants || variants.length === 0) return;

  // 用简单的确定性哈希每格选一个变体
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 10; col++) {
      const hash = (row * 31 + col * 17) % variants.length;
      const canvas = variants[hash].canvas;
      if (canvas) {
        ctx.drawImage(canvas, col * CELL_SIZE, row * CELL_SIZE);
      }
    }
  }
}

/**
 * 绘制网格线
 */
export function drawTileGrid(ctx, biome) {
  const biomeCfg = BIOME_PALETTES[biome];
  const gridColor = biomeCfg ? biomeCfg.grid : '#2a2a4a';
  ctx.strokeStyle = gridColor;
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.25;
  const size = 10 * CELL_SIZE;
  for (let i = 0; i <= 10; i++) {
    const pos = i * CELL_SIZE;
    ctx.beginPath(); ctx.moveTo(pos, 0); ctx.lineTo(pos, size); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, pos); ctx.lineTo(size, pos); ctx.stroke();
  }
  ctx.globalAlpha = 1;
}

export function getBiomeBg(biome) {
  const cfg = BIOME_PALETTES[biome];
  return cfg ? cfg.bg : '#1a1a2e';
}

export function getStairsTile(biome, locked) {
  return getCachedTile(biome, locked ? 'stairs_locked' : 'stairs_unlocked');
}

export function getObstacleTile(biome, obsType) {
  return getCachedTile(biome, `obstacle_${obsType}`);
}
