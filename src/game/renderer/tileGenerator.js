// 24×24 程序化瓦片生成器
// 每个生成器直接产出离屏 Canvas，颜色由群落调色板决定
// 逻辑像素 24×24，实际 Canvas 大小 = CELL_SIZE (72px)

import { CELL_SIZE, BIOME_PALETTES, TILE_SIZE } from '../constants';

const PX = CELL_SIZE / 24; // 每逻辑像素对应实际像素 (72/24=3)

function mkCanvas() {
  const c = document.createElement('canvas');
  c.width = CELL_SIZE;
  c.height = CELL_SIZE;
  return c;
}

function fillRect(ctx, x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x * PX), Math.round(y * PX), Math.round(w * PX), Math.round(h * PX));
}

function fillCircle(ctx, cx, cy, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(cx * PX, cy * PX, r * PX, 0, Math.PI * 2);
  ctx.fill();
}

// ============================================================
//  地板
// ============================================================

function genDungeonFloor(palette) {
  const c = mkCanvas(), ctx = c.getContext('2d');
  const F = palette.floor.F, D = palette.floor.D, L = palette.floor.L, C = palette.floor.C || D;

  fillRect(ctx, 0, 0, 24, 24, F);

  // 8×8 石头块，错缝排列
  for (let by = 0; by < 3; by++) {
    const ox = (by % 2) * 4;
    for (let bx = 0; bx < 3 + (by % 2 ? 0 : 1); bx++) {
      const sx = bx * 8 + ox, sy = by * 8;
      // 暗边（底+右）
      fillRect(ctx, sx, sy + 7, 8, 1, D);
      fillRect(ctx, sx + 7, sy, 1, 8, D);
      // 亮边（顶+左）
      fillRect(ctx, sx, sy, 8, 1, L);
      fillRect(ctx, sx, sy, 1, 8, L);
    }
  }
  // 随机裂纹
  for (let i = 0; i < 4; i++) {
    const cx = 3 + Math.random() * 18, cy = 3 + Math.random() * 18;
    fillRect(ctx, cx, cy, 2, 1, C);
    fillRect(ctx, cx + 1, cy + 1, 1, 1, D);
  }
  return c;
}

function genGrassFloor(palette) {
  const c = mkCanvas(), ctx = c.getContext('2d');
  const G = palette.floor.G, D = palette.floor.D, L = palette.floor.L, V = palette.floor.V;

  fillRect(ctx, 0, 0, 24, 24, G);
  // 网格纹理
  for (let by = 0; by < 4; by++) {
    for (let bx = 0; bx < 4; bx++) {
      fillRect(ctx, bx * 6 + 5, by * 6, 1, 6, D);
      fillRect(ctx, bx * 6, by * 6 + 5, 6, 1, D);
    }
  }
  // 随机草簇
  const rng = seedRng(42);
  for (let i = 0; i < 20; i++) {
    const vx = Math.floor(rng() * 22) + 1;
    const vy = Math.floor(rng() * 22) + 1;
    fillRect(ctx, vx, vy, 1 + Math.floor(rng() * 2), 1 + Math.floor(rng() * 2), V);
  }
  // 小石头
  for (let i = 0; i < 4; i++) {
    fillRect(ctx, 3 + rng() * 18, 3 + rng() * 18, 2, 2, D);
  }
  return c;
}

function genStoneFloor(palette) {
  const c = mkCanvas(), ctx = c.getContext('2d');
  const F = palette.floor.F, D = palette.floor.D, L = palette.floor.L;
  fillRect(ctx, 0, 0, 24, 24, F);

  // 不规则石板
  const slabs = [[0,0,10,8],[10,0,8,7],[18,0,6,9],[0,8,9,9],[9,7,7,10],[16,9,8,8],[0,17,11,7],[11,17,7,7],[18,17,6,7]];
  for (const [sx,sy,sw,sh] of slabs) {
    fillRect(ctx, sx + sw - 1, sy, 1, sh, D);
    fillRect(ctx, sx, sy + sh - 1, sw, 1, D);
    fillRect(ctx, sx, sy, sw, 1, L);
    fillRect(ctx, sx, sy, 1, sh, L);
  }
  return c;
}

function genLavaFloor(palette) {
  const c = mkCanvas(), ctx = c.getContext('2d');
  const F = palette.floor.F, D = palette.floor.D, L = palette.floor.L;
  const E = palette.lava ? palette.lava.E : '#ff6600';
  fillRect(ctx, 0, 0, 24, 24, F);

  for (let by = 0; by < 4; by++) {
    for (let bx = 0; bx < 4; bx++) {
      fillRect(ctx, bx * 6 + 5, by * 6, 1, 6, D);
      fillRect(ctx, bx * 6, by * 6 + 5, 6, 1, D);
    }
  }
  const rng = seedRng(77);
  for (let i = 0; i < 6; i++) {
    const cx = 2 + rng() * 20, cy = 2 + rng() * 20;
    fillRect(ctx, cx, cy, 2 + rng() * 2, 1 + rng(), E);
    fillRect(ctx, cx - 1, cy - 1 + rng() * 2, 1, 2, D);
  }
  return c;
}

function genCrackedFloor(palette) {
  const c = mkCanvas(), ctx = c.getContext('2d');
  const F = palette.floor.F, D = palette.floor.D, L = palette.floor.L, C = palette.floor.C || D;
  fillRect(ctx, 0, 0, 24, 24, F);

  for (let by = 0; by < 3; by++) {
    for (let bx = 0; bx < 3; bx++) {
      fillRect(ctx, bx * 8 + 7, by * 8, 1, 8, D);
    }
  }
  const rng = seedRng(13);
  for (let i = 0; i < 5; i++) {
    let x = rng() * 24, y = rng() * 24;
    for (let j = 0; j < 6; j++) {
      fillRect(ctx, Math.floor(x), Math.floor(y), 2, 1, C);
      x += rng() * 3 - 1.5;
      y += rng() * 3 - 1.5;
    }
  }
  return c;
}

// ============================================================
//  障碍物
// ============================================================

function genRock(palette) {
  const c = mkCanvas(), ctx = c.getContext('2d');
  const R = palette.rock.R, K = palette.rock.K, H = palette.rock.H;

  // 主体：两颗重叠的不规则圆
  fillCircle(ctx, 11, 14, 8, R);
  fillCircle(ctx, 13, 14, 7, R);
  fillCircle(ctx, 10, 10, 6, R);
  fillCircle(ctx, 14, 11, 5, R);

  // 底部暗面
  fillRect(ctx, 5, 16, 14, 6, K);
  fillCircle(ctx, 11, 14, 8, K);
  fillCircle(ctx, 13, 14, 7, K);
  // 恢复上部
  fillCircle(ctx, 11, 12, 7, R);
  fillCircle(ctx, 12, 10, 6, R);
  fillCircle(ctx, 10, 10, 5, R);
  fillCircle(ctx, 14, 11, 4, R);

  // 左侧暗面
  fillRect(ctx, 4, 6, 6, 12, K);
  fillCircle(ctx, 8, 11, 5, K);
  fillCircle(ctx, 10, 10, 4, R);
  fillCircle(ctx, 11, 10, 5, R);

  // 顶部高光
  fillCircle(ctx, 10, 7, 3, H);
  fillRect(ctx, 9, 5, 4, 2, H);

  // 纹理线
  fillRect(ctx, 10, 11, 3, 1, K);
  fillRect(ctx, 14, 8, 2, 1, K);

  return c;
}

function genTree(palette) {
  const c = mkCanvas(), ctx = c.getContext('2d');
  const E = palette.tree.E, T = palette.tree.T, B = palette.tree.B, L = palette.tree.L;

  // 树干
  fillRect(ctx, 10, 15, 4, 9, T);
  fillRect(ctx, 9, 16, 6, 2, T);
  fillRect(ctx, 11, 15, 2, 3, B);

  // 树根
  fillRect(ctx, 8, 21, 2, 3, T);
  fillRect(ctx, 14, 20, 2, 3, T);
  fillRect(ctx, 7, 22, 3, 2, B);
  fillRect(ctx, 14, 22, 3, 2, B);

  // 树冠暗部（底层大圆）
  fillCircle(ctx, 12, 13, 7, B);
  fillCircle(ctx, 8, 14, 5, B);
  fillCircle(ctx, 16, 13, 5, B);

  // 树冠主体（中层）
  fillCircle(ctx, 12, 10, 6, E);
  fillCircle(ctx, 8, 12, 5, E);
  fillCircle(ctx, 16, 11, 5, E);

  // 树冠高光（顶层）
  fillCircle(ctx, 12, 7, 4, L);
  fillCircle(ctx, 9, 8, 3, L);
  fillCircle(ctx, 15, 9, 3, L);

  // 高光点缀
  fillRect(ctx, 11, 5, 2, 2, L);
  fillRect(ctx, 8, 7, 2, 1, L);
  fillRect(ctx, 15, 7, 2, 1, L);

  return c;
}

// ============================================================
//  墙壁 + 楼梯
// ============================================================

function genWall(palette) {
  const c = mkCanvas(), ctx = c.getContext('2d');
  const W = palette.wall.W, S = palette.wall.S, H = palette.wall.H;

  fillRect(ctx, 0, 0, 24, 24, S);
  for (let by = 0; by < 6; by++) {
    const ox = (by % 2) * 2;
    for (let bx = 0; bx < 5 + (by % 2 ? 0 : 1); bx++) {
      const sx = bx * 5 - 1 + ox, sy = by * 4;
      if (sx < -2 || sx >= 24) continue;
      fillRect(ctx, sx + 1, sy + 1, 4, 3, W);
      fillRect(ctx, sx + 1, sy + 3, 4, 1, S);
      fillRect(ctx, sx + 4, sy + 1, 1, 3, S);
      fillRect(ctx, sx + 1, sy + 1, 3, 1, H);
    }
  }
  return c;
}

function genStairs(palette, locked) {
  const c = mkCanvas(), ctx = c.getContext('2d');
  const F = palette.stairs.F;
  const mainColor = locked ? palette.stairs.Y : palette.stairs.X;
  const edgeColor = palette.stairs.K;
  const lightColor = palette.stairs.L;

  fillRect(ctx, 0, 0, 24, 24, F);

  // 6 级台阶
  for (let step = 0; step < 6; step++) {
    const sy = 3 + step * 3.5;
    const inset = step * 1.5;
    fillRect(ctx, inset, sy, 24 - inset * 2, 3.5, mainColor);
    fillRect(ctx, inset, sy + 3, 24 - inset * 2, 0.5, edgeColor);
    fillRect(ctx, inset, sy, 24 - inset * 2, 0.5, lightColor);
  }

  // 两侧边框
  fillRect(ctx, 0, 3, 2, 21, edgeColor);
  fillRect(ctx, 22, 3, 2, 21, edgeColor);

  return c;
}

// ============================================================
//  种子随机
// ============================================================
function seedRng(seed) {
  let s = seed | 0;
  return function () {
    s |= 0; s = s + 0x6D2B79F5 | 0;
    let t = Math.imul(s ^ s >>> 15, 1 | s);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

// ============================================================
//  导出
// ============================================================

export const FLOOR_GENERATORS = {
  dungeon: { fn: genDungeonFloor, variants: 3 },
  grass:   { fn: genGrassFloor,   variants: 2 },
  stone:   { fn: genStoneFloor,   variants: 3 },
  lava:    { fn: genLavaFloor,    variants: 2 },
  cracked: { fn: genCrackedFloor, variants: 2 },
};

export const OBSTACLE_GENERATORS = {
  rock: genRock,
  tree: genTree,
};

export { genWall, genStairs };
