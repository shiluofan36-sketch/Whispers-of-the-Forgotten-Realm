// 楼层过渡动画：扫光收拢/展开
// sweep_out: 两条发光竖线从中心向两侧推开，光扫过处变黑
// pause: 全黑 + 楼层名呼吸显示
// sweep_in: 两条发光竖线从两侧向中心合拢，新楼层展现
import { GRID_SIZE, CELL_SIZE, FLOORS } from '../constants';
import { generateFloor } from '../dungeon/floorGenerator';

const BIOME_SWEEP = {
  forest:    { color: '#4a8a3a', glow: '#88cc66' },
  cave:      { color: '#3a3a5a', glow: '#6666aa' },
  ruins:     { color: '#6a3a2a', glow: '#cc8855' },
  lava:      { color: '#7a2020', glow: '#ff5533' },
  graveyard: { color: '#3a3a4a', glow: '#8888aa' },
  ice:       { color: '#3a5a6a', glow: '#88bbdd' },
  void:      { color: '#2a103a', glow: '#8855cc' },
};

/**
 * 开始楼层过渡动画
 */
export function startFloorTransition(state, nextFloor) {
  const config = FLOORS[nextFloor];
  if (!config) return false;

  const biome = config.obstacleTheme || 'forest';
  const sweepCfg = BIOME_SWEEP[biome] || BIOME_SWEEP.forest;

  state.transition = {
    phase: 'sweep_out',
    progress: 0,
    nextFloor,
    floorName: config.name,
    sweepColor: sweepCfg.color,
    sweepGlow: sweepCfg.glow,
  };
  return true;
}

/**
 * 是否正在过渡中
 */
export function isTransitioning(state) {
  return state.transition && state.transition.phase !== 'idle';
}

/**
 * 更新过渡动画状态
 * @returns {boolean} true 表示正在过渡（应阻塞输入）
 */
export function updateFloorTransition(state, dt) {
  const t = state.transition;
  if (!t || t.phase === 'idle') return false;

  const SWEEP_OUT_DUR = 0.7;
  const PAUSE_DUR = 1.0;
  const SWEEP_IN_DUR = 0.7;

  if (t.phase === 'sweep_out') {
    t.progress += dt / SWEEP_OUT_DUR;
    if (t.progress >= 1) {
      t.progress = 0;
      t.phase = 'pause';
      generateFloor(state, t.nextFloor);
    }
  } else if (t.phase === 'pause') {
    t.progress += dt / PAUSE_DUR;
    if (t.progress >= 1) {
      t.progress = 0;
      t.phase = 'sweep_in';
    }
  } else if (t.phase === 'sweep_in') {
    t.progress += dt / SWEEP_IN_DUR;
    if (t.progress >= 1) {
      t.phase = 'idle';
      state.transition = null;
    }
  }

  return true;
}

/**
 * 渲染楼层过渡叠加层
 */
export function renderFloorTransition(ctx, state) {
  const t = state.transition;
  if (!t || t.phase === 'idle') return;
  if (t.phase === 'pause') {
    renderPausePhase(ctx, t);
    return;
  }

  const w = GRID_SIZE * CELL_SIZE;
  const h = GRID_SIZE * CELL_SIZE;
  const halfW = w / 2;
  const p = t.progress;

  if (t.phase === 'sweep_out') {
    // 黑色区域从中心向两侧扩展
    const leftEdge = halfW * (1 - p);
    const rightEdge = halfW * (1 + p);

    ctx.fillStyle = '#000000';
    ctx.fillRect(leftEdge, 0, rightEdge - leftEdge, h);

    drawSweepLine(ctx, leftEdge, h, t.sweepColor, t.sweepGlow);
    drawSweepLine(ctx, rightEdge, h, t.sweepColor, t.sweepGlow);
  } else if (t.phase === 'sweep_in') {
    // 黑色区域从两侧向中心收缩
    const leftEdge = halfW * p;
    const rightEdge = w - halfW * p;

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, leftEdge, h);
    ctx.fillRect(rightEdge, 0, w - rightEdge, h);

    drawSweepLine(ctx, leftEdge, h, t.sweepColor, t.sweepGlow);
    drawSweepLine(ctx, rightEdge, h, t.sweepColor, t.sweepGlow);
  }
}

function drawSweepLine(ctx, x, h, color, glowColor) {
  // 发光竖线
  const glowWidth = 20;
  const gradient = ctx.createLinearGradient(x - glowWidth, 0, x + glowWidth, 0);
  gradient.addColorStop(0, 'rgba(0,0,0,0)');
  gradient.addColorStop(0.35, color);
  gradient.addColorStop(0.45, glowColor);
  gradient.addColorStop(0.5, '#ffffff');
  gradient.addColorStop(0.55, glowColor);
  gradient.addColorStop(0.65, color);
  gradient.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(x - glowWidth, 0, glowWidth * 2, h);
}

function renderPausePhase(ctx, t) {
  const w = GRID_SIZE * CELL_SIZE;
  const h = GRID_SIZE * CELL_SIZE;

  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, w, h);

  // 呼吸发光的楼层名
  const breath = 0.5 + Math.sin(performance.now() / 400) * 0.3;
  ctx.fillStyle = `rgba(255, 255, 255, ${breath})`;
  ctx.font = 'bold 16px "Press Start 2P", "Courier New", monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(t.floorName, w / 2, h / 2 - 10);

  // 微弱扫光亮条（已切换到的生物群落色）
  const lineGradient = ctx.createLinearGradient(0, h / 2 + 30, w, h / 2 + 30);
  lineGradient.addColorStop(0, 'rgba(0,0,0,0)');
  lineGradient.addColorStop(0.4, t.sweepGlow + '44');
  lineGradient.addColorStop(0.5, t.sweepGlow + '88');
  lineGradient.addColorStop(0.6, t.sweepGlow + '44');
  lineGradient.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = lineGradient;
  ctx.fillRect(0, h / 2 + 28, w, 4);
}
