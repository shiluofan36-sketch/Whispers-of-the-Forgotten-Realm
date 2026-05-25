// 瓦片渲染器：像素数据 → 离屏Canvas缓存 → 绘制
import { CELL_SIZE, THEME_BG } from '../constants';
import { TILE_DATA, TILE_SIZE, BIOME_PALETTES } from '../../../shared/config/tiles.js';

const tileCache = new Map();

/**
 * 将字符像素数据渲染到离屏Canvas（一次生成，永久缓存）
 */
function renderPixelData(pixelRows, palette, scale) {
  const canvas = document.createElement('canvas');
  canvas.width = pixelRows[0].length * scale;
  canvas.height = pixelRows.length * scale;
  const ctx = canvas.getContext('2d');

  for (let row = 0; row < pixelRows.length; row++) {
    for (let col = 0; col < pixelRows[row].length; col++) {
      const ch = pixelRows[row][col];
      const color = palette[ch];
      if (color && ch !== '.') {
        ctx.fillStyle = color;
        ctx.fillRect(col * scale, row * scale, scale, scale);
      }
    }
  }
  return canvas;
}

/**
 * 生成所有瓦片 + 生物群落的离屏Canvas缓存
 */
export function initTileCache() {
  if (tileCache.size > 0) return; // 只初始化一次

  const scale = CELL_SIZE / TILE_SIZE; // 48/8 = 6px per source pixel
  const biomes = Object.keys(BIOME_PALETTES);

  for (const biome of biomes) {
    const palette = BIOME_PALETTES[biome];

    for (const [tileName, pixelData] of Object.entries(TILE_DATA)) {
      const key = `${biome}:${tileName}`;
      const mergedPalette = { ...palette.floor, ...palette[tileName] };
      const canvas = renderPixelData(pixelData, mergedPalette, scale);
      tileCache.set(key, canvas);
    }

    // 障碍物瓦片（岩石/树），复用 wall 像素数据
    const rockCanvas = renderPixelData(TILE_DATA.wall, {
      W: '#666666', S: '#444444',
    }, scale);
    tileCache.set(`${biome}:obstacle_rock`, rockCanvas);

    const treeCanvas = renderPixelData(TILE_DATA.wall, {
      W: '#225522', S: '#114411',
    }, scale);
    tileCache.set(`${biome}:obstacle_tree`, treeCanvas);

    // 楼梯瓦片（解锁/锁定）
    const stairsPixel = [
      'TTTTTTTT',
      'FFTTTTFF',
      'FFFFTTFF',
      'FFTTTTFF',
      'FFFFTTFF',
      'FFTTTTFF',
      'FFFFTTFF',
      'FFTTTTFF',
    ];
    const stairsUnlockedCanvas = renderPixelData(stairsPixel, {
      T: '#ffdd00', F: palette.floor.F,
    }, scale);
    tileCache.set(`${biome}:stairs_unlocked`, stairsUnlockedCanvas);

    const stairsLockedCanvas = renderPixelData(stairsPixel, {
      T: '#cc3333', F: palette.floor.F,
    }, scale);
    tileCache.set(`${biome}:stairs_locked`, stairsLockedCanvas);
  }
}

/**
 * 获取缓存的瓦片Canvas
 */
function getCachedTile(biome, tileType) {
  return tileCache.get(`${biome}:${tileType}`);
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
 * 绘制整个背景（全部用默认地板瓦片填充）
 */
export function drawTileBackground(ctx, biome) {
  const canvas = getCachedTile(biome, 'dungeon');
  if (!canvas) return;

  const gridSize = 10;
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      ctx.drawImage(canvas, col * CELL_SIZE, row * CELL_SIZE);
    }
  }
}

/**
 * 绘制网格线覆盖层（半透明，增强像素感）
 */
export function drawTileGrid(ctx, biome) {
  const biomeCfg = BIOME_PALETTES[biome];
  const gridColor = biomeCfg ? biomeCfg.grid : '#2a2a4a';
  ctx.strokeStyle = gridColor;
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.4;
  const size = 10 * CELL_SIZE;
  for (let i = 0; i <= 10; i++) {
    const pos = i * CELL_SIZE;
    ctx.beginPath(); ctx.moveTo(pos, 0); ctx.lineTo(pos, size); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, pos); ctx.lineTo(size, pos); ctx.stroke();
  }
  ctx.globalAlpha = 1;
}

/**
 * 获取生物群落背景色（回退用）
 */
export function getBiomeBg(biome) {
  const cfg = BIOME_PALETTES[biome];
  return cfg ? cfg.bg : '#1a1a2e';
}

/**
 * 获取生物群落的楼梯瓦片
 */
export function getStairsTile(biome, locked) {
  return getCachedTile(biome, locked ? 'stairs_locked' : 'stairs_unlocked');
}

/**
 * 获取生物群落的障碍物瓦片
 */
export function getObstacleTile(biome, obsType) {
  return getCachedTile(biome, `obstacle_${obsType}`);
}
