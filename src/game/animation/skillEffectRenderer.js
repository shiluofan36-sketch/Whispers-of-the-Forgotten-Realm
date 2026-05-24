/**
 * 技能特效渲染器 — 极简版
 *
 * 四种基础模板，纯 Canvas 2D 绘制：
 *   slash   — 斜向斩击线（2条交叉弧线）
 *   projectile — 从施法者飞向目标的圆点+尾迹
 *   pulse   — 从目标扩散的圆环
 *   flash   — 全屏或目标区域颜色覆盖
 *
 * 特效数据驱动：effectFactory 根据技能 key 生成配置，
 * 此处只负责根据配置绘制。
 *
 * 状态存储：state.animation.skillEffects[] — 每个元素：
 *   { type, fromX, fromY, toX, toY, color, timer, duration }
 */

import { CELL_SIZE } from '../constants';

// 特效默认时长映射
const DURATION = {
  slash: 0.25,
  projectile: 0.3,
  pulse: 0.35,
  flash: 0.2,
};

/**
 * 创建一个技能特效并加入队列
 */
export function addSkillEffect(state, config) {
  if (!state.animation) state.animation = {};
  if (!state.animation.skillEffects) state.animation.skillEffects = [];

  state.animation.skillEffects.push({
    ...config,
    timer: config.duration || DURATION[config.type] || 0.25,
    duration: config.duration || DURATION[config.type] || 0.25,
  });
}

/**
 * 每帧更新所有技能特效
 */
export function updateSkillEffects(state, dt) {
  if (!state.animation || !state.animation.skillEffects) return;
  const clamped = Math.min(dt, 0.1);

  for (const fx of state.animation.skillEffects) {
    fx.timer -= clamped;
  }

  // 移除过期特效
  state.animation.skillEffects = state.animation.skillEffects.filter(
    (fx) => fx.timer > 0
  );
}

/**
 * 渲染所有技能特效
 */
export function renderSkillEffects(ctx, state) {
  if (!state.animation || !state.animation.skillEffects) return;

  for (const fx of state.animation.skillEffects) {
    switch (fx.type) {
      case 'slash':
        drawSlash(ctx, fx);
        break;
      case 'projectile':
        drawProjectile(ctx, fx);
        break;
      case 'pulse':
        drawPulse(ctx, fx);
        break;
      case 'flash':
        drawFlash(ctx, fx);
        break;
    }
  }
}

// ============================================================
//  绘制函数
// ============================================================

function toPixel(gx) {
  return gx * CELL_SIZE + CELL_SIZE / 2;
}

/**
 * 斩击：2条交叉弧线从目标中心划过
 */
function drawSlash(ctx, fx) {
  const cx = toPixel(fx.toX);
  const cy = toPixel(fx.toY);
  const progress = 1 - fx.timer / fx.duration; // 0→1
  const alpha = progress < 0.3 ? progress / 0.3 : (1 - progress) / 0.7;
  const len = 30 + progress * 10;
  const angle = progress * 0.8;

  ctx.save();
  ctx.globalAlpha = Math.max(0, alpha);
  ctx.strokeStyle = fx.color || '#ffffff';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';

  // 第一条弧线 \
  ctx.beginPath();
  ctx.moveTo(cx - len * Math.cos(angle), cy - len * Math.sin(angle));
  ctx.lineTo(cx + len * Math.cos(angle), cy + len * Math.sin(angle));
  ctx.stroke();

  // 第二条弧线 / (镜像)
  ctx.beginPath();
  ctx.moveTo(cx + len * Math.cos(angle), cy - len * Math.sin(angle));
  ctx.lineTo(cx - len * Math.cos(angle), cy + len * Math.sin(angle));
  ctx.stroke();

  ctx.restore();
}

/**
 * 投射物：从施法者飞向目标的圆点 + 尾迹
 */
function drawProjectile(ctx, fx) {
  const sx = toPixel(fx.fromX);
  const sy = toPixel(fx.fromY);
  const tx = toPixel(fx.toX);
  const ty = toPixel(fx.toY);
  const progress = 1 - fx.timer / fx.duration;
  const ease = progress < 0.5
    ? 2 * progress * progress
    : 1 - Math.pow(-2 * progress + 2, 2) / 2;

  const px = sx + (tx - sx) * ease;
  const py = sy + (ty - sy) * ease;

  ctx.save();
  ctx.globalAlpha = 0.8;

  // 尾迹
  const trailLen = 4;
  for (let i = trailLen; i >= 0; i--) {
    const t = Math.max(0, ease - i * 0.03);
    const tx2 = sx + (tx - sx) * t;
    const ty2 = sy + (ty - sy) * t;
    ctx.globalAlpha = 0.2 + (trailLen - i) * 0.15;
    ctx.fillStyle = fx.color || '#ff6600';
    ctx.beginPath();
    ctx.arc(tx2, ty2, 4 - i * 0.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // 投射物主体
  ctx.globalAlpha = 0.9;
  ctx.fillStyle = fx.color || '#ff6600';
  ctx.beginPath();
  ctx.arc(px, py, 5, 0, Math.PI * 2);
  ctx.fill();

  // 光晕
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(px, py, 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/**
 * 脉冲：从目标扩散的圆环
 */
function drawPulse(ctx, fx) {
  const cx = toPixel(fx.toX);
  const cy = toPixel(fx.toY);
  const progress = 1 - fx.timer / fx.duration;
  const radius = 8 + progress * 30;
  const alpha = 1 - progress;

  ctx.save();
  ctx.globalAlpha = Math.max(0, alpha);
  ctx.strokeStyle = fx.color || '#44ff44';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.stroke();

  // 内环（稍后扩散）
  const innerProgress = Math.max(0, progress - 0.15);
  const innerAlpha = 1 - innerProgress;
  if (innerAlpha > 0) {
    ctx.globalAlpha = Math.max(0, innerAlpha * 0.6);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, 4 + innerProgress * 24, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.restore();
}

/**
 * 闪光：全屏颜色覆盖（快速闪入闪出）
 */
function drawFlash(ctx, fx) {
  const progress = 1 - fx.timer / fx.duration;
  // 快速闪入 (0~0.15) → 保持 (0.15~0.7) → 淡出 (0.7~1)
  let alpha;
  if (progress < 0.15) alpha = progress / 0.15;
  else if (progress < 0.7) alpha = 1;
  else alpha = (1 - progress) / 0.3;

  ctx.save();
  ctx.globalAlpha = Math.max(0, alpha * 0.25);
  ctx.fillStyle = fx.color || '#ffffff';
  const w = ctx.canvas.width;
  const h = ctx.canvas.height;
  ctx.fillRect(0, 0, w, h);
  ctx.restore();
}
