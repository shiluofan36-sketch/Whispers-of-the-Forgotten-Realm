// 实体渲染：玩家 / 怪物 / Boss / 血条 / 状态图标
import { GRID_SIZE, CELL_SIZE, COLOR, RENDER, GAME_PHASE } from '../constants';

export function drawHpBar(ctx, x, y, width, hp, maxHp) {
  const height = RENDER.HP_BAR_HEIGHT;
  const ratio = Math.max(0, hp / maxHp);
  ctx.fillStyle = COLOR.HP_BG;
  ctx.fillRect(x, y, width, height);
  ctx.fillStyle = COLOR.HP_BAR;
  ctx.fillRect(x, y, width * ratio, height);
}

export function drawEntity(ctx, entity, color, label, state) {
  const { x, y, hp, maxHp, isDefending } = entity;
  let px = x * CELL_SIZE, py = y * CELL_SIZE;
  const pad = RENDER.PADDING;

  // Phase 13: 应用动画状态（offset / scale / opacity）
  const anim = entity.animState;
  let animScale = 1;
  let animOpacity = 1;
  let animOffsetX = 0;
  let animOffsetY = 0;

  if (anim) {
    animOffsetX = anim.offsetX || 0;
    animOffsetY = anim.offsetY || 0;
    animScale = anim.scale != null ? anim.scale : 1;
    animOpacity = anim.opacity != null ? anim.opacity : 1;

    // 呼吸动画（idle 状态时叠加 sin 浮动）
    if (anim.type === 'idle' && state.animation) {
      const phase = state.animation.idlePhase || 0;
      const isBoss = entity.bossKey;
      const isElite = entity.isElite;
      const amp = isBoss ? 2 : (isElite ? 1.5 : 1);
      const freq = isElite ? 2.8 : 2.2;
      animOffsetY += Math.sin(phase * freq) * amp;
    }
  }

  // 战斗阶段：实体分列左右 + 放大2倍
  if (state.gamePhase === GAME_PHASE.BATTLE) {
    const canvasSize = GRID_SIZE * CELL_SIZE;
    const isMonsterSide = entity.isMinion || entity.typeKey || entity.bossKey;
    px = (isMonsterSide ? canvasSize * 0.75 : canvasSize * 0.25) - CELL_SIZE / 2;
    py = canvasSize * 0.5 - CELL_SIZE / 2;
    animScale *= 2.0;
  }

  // 应用 opacity（死亡动画等）
  if (animOpacity < 1) {
    ctx.globalAlpha = animOpacity;
  }

  // 计算变换后的绘制中心
  const cellCenterX = px + CELL_SIZE / 2 + animOffsetX;
  const cellCenterY = py + CELL_SIZE / 2 + animOffsetY;

  // 应用 scale 变换
  if (animScale !== 1) {
    ctx.save();
    ctx.translate(cellCenterX, cellCenterY);
    ctx.scale(animScale, animScale);
    ctx.translate(-cellCenterX, -cellCenterY);
    px = cellCenterX - CELL_SIZE / 2;
    py = cellCenterY - CELL_SIZE / 2;
  } else {
    px += animOffsetX;
    py += animOffsetY;
  }

  let fillColor = color;
  if (entity.flashTimer > 0) fillColor = '#ff6666';

  ctx.fillStyle = fillColor;
  ctx.fillRect(px + pad, py + pad, CELL_SIZE - pad * 2, CELL_SIZE - pad * 2);

  if (isDefending) {
    ctx.strokeStyle = COLOR.SHIELD;
    ctx.lineWidth = RENDER.SHIELD_LINE_WIDTH;
    const sw = RENDER.SHIELD_LINE_WIDTH;
    ctx.strokeRect(px + pad - sw + 1, py + pad - sw + 1, CELL_SIZE - pad * 2 + sw * 2 - 2, CELL_SIZE - pad * 2 + sw * 2 - 2);
  }

  if (entity.enraged) { ctx.strokeStyle = '#ff0000'; ctx.lineWidth = 3; ctx.strokeRect(px + 2, py + 2, CELL_SIZE - 4, CELL_SIZE - 4); }
  if (entity.weakened) { ctx.strokeStyle = '#888888'; ctx.lineWidth = 3; ctx.strokeRect(px + 2, py + 2, CELL_SIZE - 4, CELL_SIZE - 4); }
  if (entity.isElite)  { ctx.strokeStyle = '#ffdd00'; ctx.lineWidth = 2; ctx.strokeRect(px + 2, py + 2, CELL_SIZE - 4, CELL_SIZE - 4); }

  // 狂暴红色 pulse 光环
  if (entity.enraged && anim && anim.type === 'enrage') {
    ctx.strokeStyle = 'rgba(255, 0, 0, 0.4)';
    ctx.lineWidth = 2;
    const pulseR = 4 + Math.sin((state.animation?.idlePhase || 0) * 8) * 6;
    ctx.beginPath();
    ctx.arc(cellCenterX, cellCenterY, CELL_SIZE / 2 + pulseR, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.fillStyle = entity.isElite ? '#ffdd00' : RENDER.ENTITY_LABEL_COLOR;
  ctx.font = entity.isElite ? 'bold 13px monospace' : RENDER.ENTITY_FONT;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  let displayLabel = label;
  if (entity.isElite) displayLabel = 'E';
  ctx.fillText(displayLabel, cellCenterX, cellCenterY);

  if (entity.isElite) {
    ctx.fillStyle = '#ffdd00'; ctx.font = 'bold 10px monospace';
    ctx.fillText('[Elite]', cellCenterX, cellCenterY - 16);
  }

  drawHpBar(ctx, px + pad, py + RENDER.HP_BAR_OFFSET_Y, CELL_SIZE - pad * 2, hp, maxHp);

  // 恢复 scale 变换
  if (animScale !== 1) {
    ctx.restore();
  }

  // 恢复 opacity
  if (animOpacity < 1) {
    ctx.globalAlpha = 1;
  }
}

export function drawStatusIcons(ctx, state) {
  const canvasWidth = GRID_SIZE * CELL_SIZE;
  const colors = { burn: '#ff8800', poison: '#88ff44', freeze: '#44ccff', bleed: '#cc4444' };
  const labels = { burn: 'BURN', poison: 'PSN', freeze: 'FRZ', bleed: 'BLD' };

  ctx.font = '12px monospace'; ctx.textBaseline = 'middle';

  // 玩家状态（左下角）
  ctx.textAlign = 'left';
  const playerEffects = state.statusEffects || [];
  let py = canvasWidth - 25;
  for (const eff of playerEffects) {
    ctx.fillStyle = colors[eff.type] || '#ffffff';
    ctx.fillText(`P:${labels[eff.type] || eff.type}(${eff.duration})`, 10, py);
    py -= 18;
  }

  // 怪物状态（右下角）
  if (state.monster && state.monster.statusEffects) {
    ctx.textAlign = 'right';
    let my = canvasWidth - 25;
    for (const eff of state.monster.statusEffects) {
      ctx.fillStyle = colors[eff.type] || '#ffffff';
      ctx.fillText(`M:${labels[eff.type] || eff.type}(${eff.duration})`, canvasWidth - 10, my);
      my -= 18;
    }
  }
}
