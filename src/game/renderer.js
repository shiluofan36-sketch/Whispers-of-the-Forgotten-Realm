import {
  GRID_SIZE, CELL_SIZE, COLOR, GAME_PHASE,
  OBSTACLE_STYLE, RENDER,
  STAIRS_COLOR, STAIRS_LABEL,
  STAIRS_LOCKED_COLOR, STAIRS_LOCKED_LABEL,
} from './constants';

/**
 * 绘制整个游戏画面
 */
export function render(ctx, state) {
  const canvasWidth = GRID_SIZE * CELL_SIZE;
  const canvasHeight = GRID_SIZE * CELL_SIZE;

  // 营地阶段：绘制营地背景
  if (state.gamePhase === GAME_PHASE.CAMP) {
    drawCampBackground(ctx, canvasWidth, canvasHeight);
    return;
  }

  // 1. 清空画布（使用楼层背景色）
  ctx.fillStyle = state.gamePhase === GAME_PHASE.BATTLE
    ? COLOR.BATTLE_BG
    : (state.floorBg || COLOR.BG);
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // 2. 绘制网格线
  drawGrid(ctx);

  // 3. 绘制障碍物
  drawObstacles(ctx, state.obstacles);

  // 4. 绘制楼梯
  if (state.stairs && state.gamePhase === GAME_PHASE.EXPLORATION) {
    drawStairs(ctx, state.stairs, state.stairsLocked);
  }

  // 5. 绘制怪物
  if (state.monster) {
    const monsterColor = state.monster.color || COLOR.MONSTER;
    drawEntity(ctx, state.monster, monsterColor, 'M');
  }

  // 6. 绘制玩家
  if (state.gamePhase !== GAME_PHASE.GAME_OVER && state.gamePhase !== GAME_PHASE.VICTORY) {
    drawEntity(ctx, state.player, COLOR.PLAYER, 'P');
  }

  // 7. 战斗边框
  if (state.gamePhase === GAME_PHASE.BATTLE) {
    if (state.isBossFloor) {
      ctx.strokeStyle = '#ffaa00';
      ctx.lineWidth = 6;
      const bw = 3;
      ctx.strokeRect(bw, bw, canvasWidth - bw * 2, canvasHeight - bw * 2);
    } else {
      ctx.strokeStyle = RENDER.BATTLE_BORDER_COLOR;
      ctx.lineWidth = RENDER.BATTLE_BORDER_WIDTH;
      const bw = RENDER.BATTLE_BORDER_WIDTH;
      ctx.strokeRect(bw / 2, bw / 2, canvasWidth - bw, canvasHeight - bw);
    }
  }
}

/**
 * 营地背景渲染（Phase 7: Floor 0 = Camp）
 */
function drawCampBackground(ctx, w, h) {
  // 深色背景
  ctx.fillStyle = '#1a1a2e';
  ctx.fillRect(0, 0, w, h);

  // 营火（中央靠上）
  const cx = w / 2;
  const cy = h / 3;

  // 火光光晕
  const glow = ctx.createRadialGradient(cx, cy, 10, cx, cy, 80);
  glow.addColorStop(0, 'rgba(255, 180, 50, 0.4)');
  glow.addColorStop(0.5, 'rgba(255, 100, 20, 0.15)');
  glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, w, h);

  // 营火标记
  ctx.fillStyle = '#ffaa30';
  ctx.font = 'bold 30px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('🔥', cx, cy);

  // 标题
  ctx.fillStyle = '#ffdd88';
  ctx.font = 'bold 20px monospace';
  ctx.fillText('CAMP', cx, cy - 60);

  // 四角标记
  ctx.fillStyle = '#444466';
  ctx.font = '14px monospace';
  ctx.fillText('🏕', cx, cy + 80);
}

function drawGrid(ctx) {
  ctx.strokeStyle = COLOR.GRID;
  ctx.lineWidth = 1;

  for (let i = 0; i <= GRID_SIZE; i++) {
    const pos = i * CELL_SIZE;
    ctx.beginPath();
    ctx.moveTo(pos, 0);
    ctx.lineTo(pos, GRID_SIZE * CELL_SIZE);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, pos);
    ctx.lineTo(GRID_SIZE * CELL_SIZE, pos);
    ctx.stroke();
  }
}

function drawObstacles(ctx, obstacles) {
  const pad = RENDER.PADDING;

  for (const obs of obstacles) {
    const style = obs.color
      ? { color: obs.color }
      : (OBSTACLE_STYLE[obs.type] || OBSTACLE_STYLE.rock);

    const px = obs.x * CELL_SIZE;
    const py = obs.y * CELL_SIZE;

    ctx.fillStyle = style.color;
    ctx.fillRect(px + pad, py + pad, CELL_SIZE - pad * 2, CELL_SIZE - pad * 2);

    ctx.fillStyle = RENDER.OBSTACLE_LABEL_COLOR;
    ctx.font = RENDER.OBSTACLE_FONT;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const label = OBSTACLE_STYLE[obs.type] ? OBSTACLE_STYLE[obs.type].label : '?';
    ctx.fillText(label, px + CELL_SIZE / 2, py + CELL_SIZE / 2);
  }
}

/**
 * 绘制楼梯：锁定=红色X，解锁=金色>
 */
function drawStairs(ctx, stairs, locked) {
  const pad = RENDER.PADDING;
  const px = stairs.x * CELL_SIZE;
  const py = stairs.y * CELL_SIZE;

  if (locked) {
    ctx.fillStyle = STAIRS_LOCKED_COLOR;
    ctx.fillRect(px + pad, py + pad, CELL_SIZE - pad * 2, CELL_SIZE - pad * 2);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(STAIRS_LOCKED_LABEL, px + CELL_SIZE / 2, py + CELL_SIZE / 2);
  } else {
    ctx.fillStyle = STAIRS_COLOR;
    ctx.fillRect(px + pad, py + pad, CELL_SIZE - pad * 2, CELL_SIZE - pad * 2);
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 20px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(STAIRS_LABEL, px + CELL_SIZE / 2, py + CELL_SIZE / 2);
  }
}

function drawEntity(ctx, entity, color, label) {
  const { x, y, hp, maxHp, isDefending } = entity;
  const px = x * CELL_SIZE;
  const py = y * CELL_SIZE;
  const pad = RENDER.PADDING;

  ctx.fillStyle = color;
  ctx.fillRect(px + pad, py + pad, CELL_SIZE - pad * 2, CELL_SIZE - pad * 2);

  // 防御状态边框
  if (isDefending) {
    ctx.strokeStyle = COLOR.SHIELD;
    ctx.lineWidth = RENDER.SHIELD_LINE_WIDTH;
    const sw = RENDER.SHIELD_LINE_WIDTH;
    ctx.strokeRect(
      px + pad - sw + 1, py + pad - sw + 1,
      CELL_SIZE - pad * 2 + sw * 2 - 2, CELL_SIZE - pad * 2 + sw * 2 - 2,
    );
  }

  // Boss狂暴特效：红色脉冲背景
  if (entity.enraged) {
    ctx.strokeStyle = '#ff0000';
    ctx.lineWidth = 3;
    ctx.strokeRect(px + 2, py + 2, CELL_SIZE - 4, CELL_SIZE - 4);
  }

  // 标签
  ctx.fillStyle = RENDER.ENTITY_LABEL_COLOR;
  ctx.font = RENDER.ENTITY_FONT;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, px + CELL_SIZE / 2, py + CELL_SIZE / 2);

  // 血条
  drawHpBar(ctx, px + pad, py + RENDER.HP_BAR_OFFSET_Y, CELL_SIZE - pad * 2, hp, maxHp);
}

function drawHpBar(ctx, x, y, width, hp, maxHp) {
  const height = RENDER.HP_BAR_HEIGHT;
  const ratio = Math.max(0, hp / maxHp);

  ctx.fillStyle = COLOR.HP_BG;
  ctx.fillRect(x, y, width, height);

  ctx.fillStyle = COLOR.HP_BAR;
  ctx.fillRect(x, y, width * ratio, height);
}
