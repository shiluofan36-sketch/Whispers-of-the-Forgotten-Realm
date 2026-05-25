// 地图氛围系统：生物群落特定的视觉叠加层
// 使用简单的 overlay + 粒子伪造，不影响性能
import { GRID_SIZE, CELL_SIZE, GAME_PHASE } from '../constants';

// 预计算的氛围状态缓存
const fogDots = [];
const dustDots = [];
const torchFlickers = [];

/**
 * 生成可复用的氛围元素位置
 */
function ensureInit() {
  if (fogDots.length === 0) {
    for (let i = 0; i < 20; i++) {
      fogDots.push({
        x: Math.random() * 10 * CELL_SIZE,
        y: Math.random() * 10 * CELL_SIZE,
        r: 15 + Math.random() * 30,
        phase: Math.random() * Math.PI * 2,
        speed: 0.3 + Math.random() * 0.5,
      });
    }
  }
  if (dustDots.length === 0) {
    for (let i = 0; i < 12; i++) {
      dustDots.push({
        x: Math.random() * 10 * CELL_SIZE,
        y: Math.random() * 10 * CELL_SIZE,
        r: 1 + Math.random() * 2,
        phase: Math.random() * Math.PI * 2,
        speed: 0.5 + Math.random() * 1.0,
        alpha: 0.2 + Math.random() * 0.3,
      });
    }
  }
  if (torchFlickers.length === 0) {
    for (let i = 0; i < 3; i++) {
      torchFlickers.push({
        x: Math.random() * 8 * CELL_SIZE + CELL_SIZE,
        y: Math.random() * 8 * CELL_SIZE + CELL_SIZE,
        phase: Math.random() * Math.PI * 2,
        speed: 5 + Math.random() * 3,
      });
    }
  }
}

/**
 * 渲染森林雾气（绿色环境光 + 雾团）
 */
function renderForestAtmo(ctx, state) {
  ensureInit();
  const time = state.animation?.idlePhase || 0;
  const canvasW = GRID_SIZE * CELL_SIZE;
  const canvasH = GRID_SIZE * CELL_SIZE;

  // 绿色环境光
  ctx.fillStyle = 'rgba(20, 40, 10, 0.08)';
  ctx.fillRect(0, 0, canvasW, canvasH);

  // 雾团
  for (const dot of fogDots) {
    const dx = dot.x + Math.sin(time * dot.speed + dot.phase) * 20;
    const dy = dot.y + Math.cos(time * dot.speed * 0.7 + dot.phase) * 15;
    const alpha = 0.04 + Math.sin(time * dot.speed + dot.phase) * 0.02;

    const gradient = ctx.createRadialGradient(dx, dy, 0, dx, dy, dot.r);
    gradient.addColorStop(0, `rgba(100, 150, 100, ${alpha})`);
    gradient.addColorStop(1, 'rgba(100, 150, 100, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvasW, canvasH);
  }
}

/**
 * 渲染洞穴灰尘 + 暗角
 */
function renderCaveAtmo(ctx, state) {
  ensureInit();
  const time = state.animation?.idlePhase || 0;
  const canvasW = GRID_SIZE * CELL_SIZE;
  const canvasH = GRID_SIZE * CELL_SIZE;

  // 灰尘粒子
  for (const dot of dustDots) {
    const dx = dot.x + Math.sin(time * dot.speed * 0.5 + dot.phase) * 30;
    const dy = (dot.y + time * 15 * dot.speed) % canvasH;
    ctx.fillStyle = `rgba(180, 180, 200, ${dot.alpha})`;
    ctx.beginPath();
    ctx.arc(dx, dy, dot.r, 0, Math.PI * 2);
    ctx.fill();
  }

  // 暗角 vignette
  const vignette = ctx.createRadialGradient(
    canvasW / 2, canvasH / 2, canvasW * 0.35,
    canvasW / 2, canvasH / 2, canvasW * 0.7
  );
  vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
  vignette.addColorStop(1, 'rgba(0, 0, 0, 0.3)');
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, canvasW, canvasH);
}

/**
 * 渲染遗迹火把闪烁 + 暗黄色环境光
 */
function renderRuinsAtmo(ctx, state) {
  ensureInit();
  const time = state.animation?.idlePhase || 0;
  const canvasW = GRID_SIZE * CELL_SIZE;
  const canvasH = GRID_SIZE * CELL_SIZE;

  // 暗黄色环境光
  const ambientAlpha = 0.04 + Math.sin(time * 1.5) * 0.02;
  ctx.fillStyle = `rgba(40, 30, 10, ${ambientAlpha})`;
  ctx.fillRect(0, 0, canvasW, canvasH);

  // 火把闪烁点
  for (const torch of torchFlickers) {
    const flicker = 0.5 + Math.sin(time * torch.speed + torch.phase) * 0.3 +
                    Math.sin(time * torch.speed * 3.7) * 0.2;
    const alpha = Math.max(0.03, flicker * 0.12);

    const gradient = ctx.createRadialGradient(torch.x, torch.y, 0, torch.x, torch.y, 60);
    gradient.addColorStop(0, `rgba(255, 180, 60, ${alpha})`);
    gradient.addColorStop(0.5, `rgba(255, 140, 40, ${alpha * 0.4})`);
    gradient.addColorStop(1, 'rgba(255, 100, 20, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvasW, canvasH);
  }
}

/**
 * 渲染熔岩环境
 */
function renderLavaAtmo(ctx, state) {
  const time = state.animation?.idlePhase || 0;
  const canvasW = GRID_SIZE * CELL_SIZE;
  const canvasH = GRID_SIZE * CELL_SIZE;

  // 红色环境光
  const ambientAlpha = 0.06 + Math.sin(time * 0.8) * 0.03;
  ctx.fillStyle = `rgba(60, 10, 5, ${ambientAlpha})`;
  ctx.fillRect(0, 0, canvasW, canvasH);

  // 底部发光
  const glow = ctx.createLinearGradient(0, canvasH * 0.6, 0, canvasH);
  glow.addColorStop(0, 'rgba(255, 60, 10, 0)');
  glow.addColorStop(1, `rgba(255, 40, 5, ${0.05 + Math.sin(time * 2) * 0.03})`);
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, canvasW, canvasH);
}

/**
 * 渲染墓地环境
 */
function renderGraveyardAtmo(ctx, state) {
  const time = state.animation?.idlePhase || 0;
  const canvasW = GRID_SIZE * CELL_SIZE;
  const canvasH = GRID_SIZE * CELL_SIZE;

  // 蓝紫色环境光
  ctx.fillStyle = 'rgba(20, 10, 30, 0.08)';
  ctx.fillRect(0, 0, canvasW, canvasH);

  // 飘忽鬼火
  const wispAlpha = 0.03 + Math.sin(time * 0.7) * 0.02;
  for (let i = 0; i < 5; i++) {
    const wx = canvasW * 0.2 + Math.sin(time * 0.4 + i * 1.5) * canvasW * 0.3;
    const wy = canvasH * 0.3 + Math.cos(time * 0.5 + i * 2) * canvasH * 0.25;
    const gradient = ctx.createRadialGradient(wx, wy, 0, wx, wy, 25);
    gradient.addColorStop(0, `rgba(100, 150, 200, ${wispAlpha})`);
    gradient.addColorStop(1, 'rgba(100, 150, 200, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvasW, canvasH);
  }
}

/**
 * 渲染冰霜环境
 */
function renderIceAtmo(ctx, state) {
  const time = state.animation?.idlePhase || 0;
  const canvasW = GRID_SIZE * CELL_SIZE;
  const canvasH = GRID_SIZE * CELL_SIZE;

  // 蓝白色环境光
  ctx.fillStyle = 'rgba(30, 50, 70, 0.06)';
  ctx.fillRect(0, 0, canvasW, canvasH);

  // 飘雪粒子
  for (let i = 0; i < 15; i++) {
    const sx = (i * 37 + time * 8 * (1 + i % 3)) % canvasW;
    const sy = (i * 53 + time * 12 * (1 + i % 4)) % canvasH;
    ctx.fillStyle = 'rgba(200, 220, 255, 0.15)';
    ctx.fillRect(Math.floor(sx), Math.floor(sy), 2, 2);
  }
}

/**
 * 渲染虚空环境
 */
function renderVoidAtmo(ctx, state) {
  const time = state.animation?.idlePhase || 0;
  const canvasW = GRID_SIZE * CELL_SIZE;
  const canvasH = GRID_SIZE * CELL_SIZE;

  // 紫色环境光
  ctx.fillStyle = 'rgba(20, 5, 30, 0.1)';
  ctx.fillRect(0, 0, canvasW, canvasH);

  // 飘忽紫光
  for (let i = 0; i < 4; i++) {
    const vx = canvasW * 0.3 + Math.sin(time * 0.3 + i) * canvasW * 0.2;
    const vy = canvasH * 0.3 + Math.cos(time * 0.4 + i * 1.3) * canvasH * 0.2;
    const gradient = ctx.createRadialGradient(vx, vy, 0, vx, vy, 40);
    gradient.addColorStop(0, 'rgba(120, 40, 200, 0.04)');
    gradient.addColorStop(1, 'rgba(120, 40, 200, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvasW, canvasH);
  }
}

// Boss房间红色叠加
function renderBossAtmo(ctx, state) {
  const canvasW = GRID_SIZE * CELL_SIZE;
  const canvasH = GRID_SIZE * CELL_SIZE;

  // 红色环境光
  ctx.fillStyle = 'rgba(40, 5, 5, 0.12)';
  ctx.fillRect(0, 0, canvasW, canvasH);

  // 暗角
  const vignette = ctx.createRadialGradient(
    canvasW / 2, canvasH / 2, canvasW * 0.3,
    canvasW / 2, canvasH / 2, canvasW * 0.7
  );
  vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
  vignette.addColorStop(1, 'rgba(20, 0, 0, 0.25)');
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, canvasW, canvasH);
}

// 生物群落到氛围渲染函数的映射
const BIOME_ATMO = {
  forest:    renderForestAtmo,
  cave:      renderCaveAtmo,
  ruins:     renderRuinsAtmo,
  lava:      renderLavaAtmo,
  graveyard: renderGraveyardAtmo,
  ice:       renderIceAtmo,
  void:      renderVoidAtmo,
};

/**
 * 渲染生物群落氛围叠加层
 * 应在 tiles 之后、entities 之前调用
 */
export function renderAtmosphere(ctx, state) {
  if (state.gamePhase !== GAME_PHASE.EXPLORATION) return;

  const biome = state.obstacleTheme || 'forest';

  // Boss 房间特殊氛围
  if (state.isBossFloor) {
    renderBossAtmo(ctx, state);
    return;
  }

  const renderFn = BIOME_ATMO[biome];
  if (renderFn) {
    renderFn(ctx, state);
  }
}
