/**
 * 装备掉落卡片动画 — 刷装核心爽感
 *
 * 装备掉落时画面中央弹出品质颜色卡片：
 *   scale 0.8→1, opacity 0→1, 持续约 300ms
 *
 * 品质颜色：
 *   common (普通) — 灰色
 *   rare (稀有) — 蓝色
 *   epic (史诗) — 紫色
 *   legendary (传说) — 金色 + glow
 *
 * 状态存储：state.animation.lootCard
 *   { itemName, quality, color, glowColor, timer, duration }
 */

import { getIconForItem, getIconForSlot, drawIcon } from '../renderer/iconRenderer';

const DURATION = 5.0; // 5000ms
const FADE_OUT_DURATION = 0.4; // 淡出 400ms

const QUALITY_COLORS = {
  common:    { color: '#9CA3AF', glow: null },
  rare:      { color: '#3B82F6', glow: '#3B82F6' },
  epic:      { color: '#A855F7', glow: '#A855F7' },
  legendary: { color: '#F59E0B', glow: '#F59E0B' },
};

/**
 * 触发装备掉落卡片
 * @param {object} state
 * @param {string} itemName - 装备名称
 * @param {string} quality - common|rare|epic|legendary
 */
export function triggerLootCard(state, itemName, quality = 'common', itemKey = null, slot = null) {
  if (!state.animation) state.animation = {};

  // 掉落粒子（画布中心）
  if (state.particles) {
    state.particles.emit('loot', 240, 240);
  }

  const qc = QUALITY_COLORS[quality] || QUALITY_COLORS.common;
  state.animation.lootCard = {
    itemName,
    itemKey,
    slot,
    quality,
    color: qc.color,
    glowColor: qc.glow,
    timer: DURATION,
    duration: DURATION,
    scale: 0.8,
    opacity: 0,
    fadingOut: false,
  };
}

/**
 * 外部触发淡出（按键或点击时调用）
 */
export function dismissLootCard(state) {
  if (!state.animation || !state.animation.lootCard) return;
  const card = state.animation.lootCard;
  if (!card.fadingOut) {
    card.fadingOut = true;
    card.fadeOutTimer = FADE_OUT_DURATION;
  }
}

/**
 * 每帧更新 loot card 动画状态
 */
export function updateLootCard(state, dt) {
  if (!state.animation || !state.animation.lootCard) return;
  const card = state.animation.lootCard;
  const cappedDt = Math.min(dt, 0.1);

  // 淡出阶段
  if (card.fadingOut) {
    card.fadeOutTimer -= cappedDt;
    card.opacity = Math.max(0, card.fadeOutTimer / FADE_OUT_DURATION);
    if (card.fadeOutTimer <= 0) {
      state.animation.lootCard = null;
    }
    return;
  }

  // 正常计时
  card.timer -= cappedDt;

  // 5秒到期 → 触发淡出
  if (card.timer <= 0) {
    card.fadingOut = true;
    card.fadeOutTimer = FADE_OUT_DURATION;
    return;
  }

  // easeOutBack: overshoot then settle
  const raw = 1 - card.timer / card.duration;
  const c1 = 1.70158;
  const c3 = c1 + 1;
  card.scale = 1 + c3 * Math.pow(raw - 1, 3) + c1 * Math.pow(raw - 1, 2);

  // opacity: fast fade in first 20% of duration
  card.opacity = Math.min(1, raw * 5);
}

/**
 * 渲染 loot card（在 renderer 中调用，位于所有内容之上）
 */
export function renderLootCard(ctx, state) {
  if (!state.animation || !state.animation.lootCard) return;
  const card = state.animation.lootCard;

  const canvasW = ctx.canvas.width;
  const canvasH = ctx.canvas.height;
  const cx = canvasW / 2;
  const cy = canvasH / 2;
  const cardW = 240;
  const cardH = 80;

  ctx.save();
  ctx.globalAlpha = card.opacity;
  ctx.translate(cx, cy);
  ctx.scale(card.scale, card.scale);

  // 发光效果（传说品质）
  if (card.glowColor) {
    ctx.shadowColor = card.glowColor;
    ctx.shadowBlur = 15;
  }

  // 卡片背景
  ctx.fillStyle = '#1a1a2e';
  ctx.strokeStyle = card.color;
  ctx.lineWidth = 2;
  const hw = cardW / 2, hh = cardH / 2;
  ctx.beginPath();
  ctx.roundRect(-hw, -hh, cardW, cardH, 6);
  ctx.fill();
  ctx.stroke();

  // 品质色条（顶部）
  ctx.fillStyle = card.color;
  ctx.fillRect(-hw, -hh, cardW, 4);

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // 图标（像素风）
  let iconKey = getIconForItem(card.itemKey);
  if (iconKey === 'sword' && card.slot) {
    iconKey = getIconForSlot(card.slot);
  }
  drawIcon(ctx, iconKey, card.quality, 0, -16, 28);

  // 装备名称
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 16px monospace';
  ctx.fillText(card.itemName, 0, 10);

  // 品质标签
  ctx.fillStyle = card.color;
  ctx.font = 'bold 11px monospace';
  const qLabel = {
    common: '普通', rare: '稀有', epic: '史诗', legendary: '传说'
  }[card.quality] || card.quality;
  ctx.fillText(qLabel, 0, 28);

  ctx.restore();
}
