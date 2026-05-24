import { CELL_SIZE } from '../constants';

/**
 * 浮动文字管理器
 * 伤害飘字、暴击提示、格挡提示、Boss狂暴警告
 */

const FLOAT_SPEED = 40;       // 像素/秒 上浮速度
const DEFAULT_LIFETIME = 1.0; // 秒

// 颜色配置
const COLORS = {
  damage:   '#ffffff',
  crit:     '#ffaa00',
  block:    '#44aaff',
  miss:     '#aaaaaa',
  heal:     '#44ff44',
  enrage:   '#ff2222',
  poison:   '#88ff44',
  burn:     '#ff8800',
  bleed:    '#cc4444',
};

/**
 * 网格坐标转画布像素坐标（实体中心上方）
 */
export function entityCenter(entity) {
  return {
    px: entity.x * CELL_SIZE + CELL_SIZE / 2,
    py: entity.y * CELL_SIZE + 10,
  };
}

/**
 * 添加一个浮动文字
 */
export function addFloatingText(state, x, y, text, type) {
  if (!state.floatingTexts) state.floatingTexts = [];

  const color = COLORS[type] || COLORS.damage;

  state.floatingTexts.push({
    x,
    y,
    text,
    color,
    lifetime: DEFAULT_LIFETIME,
    maxLifetime: DEFAULT_LIFETIME,
    velocityY: FLOAT_SPEED,
  });
}

/**
 * 添加Boss狂暴大字警告
 */
export function addEnrageWarning(state, x, y) {
  if (!state.floatingTexts) state.floatingTexts = [];

  state.floatingTexts.push({
    x,
    y,
    text: 'BOSS ENRAGED!',
    color: COLORS.enrage,
    lifetime: 1.5,
    maxLifetime: 1.5,
    velocityY: 20,
  });
}

/**
 * 每帧更新：移动 + 衰减生命周期
 */
export function updateFloatingTexts(state, dt) {
  if (!state.floatingTexts || state.floatingTexts.length === 0) return;

  const clamped = Math.min(dt, 0.1);

  state.floatingTexts = state.floatingTexts.filter(ft => {
    ft.y -= ft.velocityY * clamped;
    ft.lifetime -= clamped;
    return ft.lifetime > 0;
  });
}

/**
 * 渲染所有浮动文字
 */
export function renderFloatingTexts(ctx, state) {
  if (!state.floatingTexts || state.floatingTexts.length === 0) return;

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  for (const ft of state.floatingTexts) {
    const alpha = Math.min(1, ft.lifetime / ft.maxLifetime);
    const fontSize = ft.text === 'BOSS ENRAGED!' ? 24 : 16;

    ctx.globalAlpha = alpha;
    ctx.fillStyle = ft.color;
    ctx.font = `bold ${fontSize}px monospace`;

    // Boss狂暴文字带阴影
    if (ft.text === 'BOSS ENRAGED!') {
      ctx.shadowColor = '#ff0000';
      ctx.shadowBlur = 10;
    }

    ctx.fillText(ft.text, ft.x, ft.y);

    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
  }

  ctx.globalAlpha = 1;
}
