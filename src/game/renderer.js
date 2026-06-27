import {
  GRID_SIZE, CELL_SIZE, COLOR, GAME_PHASE, RENDER,
} from './constants';
import { renderFloatingTexts } from './effects/floatingTextManager';
import { getScreenShakeOffset } from './effects/screenShake';
import { renderSkillEffects } from './animation/skillEffectRenderer';
import { renderLootCard } from './animation/lootAnimation';
import { drawObstacles, drawStairs, drawRoom } from './renderer/mapRenderer';
import { drawEntity, drawStatusIcons } from './renderer/entityRenderer';
import { drawTileBackground, drawTileGrid, getBiomeBg } from './renderer/tileRenderer';
import { renderAtmosphere } from './renderer/atmosphereRenderer';
import { renderFogOfWar, isInVisionRange } from './renderer/fogOfWar';
import { renderLightSource } from './renderer/lightSource';
import { renderFloorTransition } from './animation/floorTransition';

export function render(ctx, state) {
  const canvasWidth = GRID_SIZE * CELL_SIZE;
  const canvasHeight = GRID_SIZE * CELL_SIZE;

  if (state.gamePhase === GAME_PHASE.CAMP) {
    drawCampBackground(ctx, canvasWidth, canvasHeight);
    return;
  }

  const shake = getScreenShakeOffset(state);
  ctx.save();
  ctx.translate(shake.dx, shake.dy);

  const biome = state.obstacleTheme || 'forest';
  const biomeBg = getBiomeBg(biome);
  ctx.fillStyle = biomeBg;
  ctx.fillRect(-shake.dx, -shake.dy, canvasWidth + Math.abs(shake.dx) * 2, canvasHeight + Math.abs(shake.dy) * 2);
  drawTileBackground(ctx, biome);
  drawTileGrid(ctx, biome);

  // 战斗模式：暗色叠加压低亮度，营造紧张氛围
  if (state.gamePhase === GAME_PHASE.BATTLE) {
    const overlayAlpha = state.isBossFloor ? 0.55 : 0.45;
    ctx.fillStyle = `rgba(0, 0, 0, ${overlayAlpha})`;
    ctx.fillRect(-shake.dx, -shake.dy, canvasWidth + Math.abs(shake.dx) * 2, canvasHeight + Math.abs(shake.dy) * 2);
  }

  drawObstacles(ctx, state.obstacles, biome);

  // 氛围叠加（瓦片之上、实体之下；战斗时强度减半）
  renderAtmosphere(ctx, state);

  if (state.room && state.gamePhase === GAME_PHASE.EXPLORATION) {
    drawRoom(ctx, state.room);
  }

  if (state.stairs && state.gamePhase === GAME_PHASE.EXPLORATION) {
    drawStairs(ctx, state.stairs, state.stairsLocked, biome);
  }

  // 教程发光标记
  if (state.tutorialMarker && state.gamePhase === GAME_PHASE.EXPLORATION && state.tutorialStep === 1) {
    const m = state.tutorialMarker;
    const cx = m.x * CELL_SIZE + CELL_SIZE / 2;
    const cy = m.y * CELL_SIZE + CELL_SIZE / 2;
    const pulse = 0.5 + 0.5 * Math.sin((state.animation?.idlePhase || 0) / 0.4);
    const radius = CELL_SIZE * 0.35 + pulse * CELL_SIZE * 0.1;
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 215, 0, ${0.3 + pulse * 0.3})`;
    ctx.fill();
    ctx.strokeStyle = `rgba(255, 215, 0, ${0.7 + pulse * 0.3})`;
    ctx.lineWidth = 2 + pulse;
    ctx.stroke();
    ctx.restore();
  }

  // Boss 小兵渲染
  if (state.bossMinions && state.bossMinions.length > 0) {
    for (const minion of state.bossMinions) {
      drawEntity(ctx, minion, minion.color || '#886644', 'm', state);
    }
  }

  if (state.monster && isInVisionRange(state, state.monster.x, state.monster.y)) {
    drawEntity(ctx, state.monster, state.monster.color || COLOR.MONSTER, 'M', state);
  }

  if (state.gamePhase !== GAME_PHASE.GAME_OVER && state.gamePhase !== GAME_PHASE.VICTORY) {
    drawEntity(ctx, state.player, COLOR.PLAYER, 'P', state);
  }

  // 战争迷雾 + 玩家光源（探索模式，实体之上；教程期间禁用）
  if (!state.isTutorialFloor) {
    renderFogOfWar(ctx, state);
  }
  renderLightSource(ctx, state);

  // 技能特效（在实体之上、浮动文字之下）
  renderSkillEffects(ctx, state);

  // Phase 14: 粒子系统（技能特效之上，浮动文字之下）
  if (state.particles) state.particles.render(ctx);

  // 战斗边框
  drawBattleBorder(ctx, state, canvasWidth, canvasHeight);

  ctx.restore();

  renderFloatingTexts(ctx, state);

  // 装备掉落卡片（最顶层）
  renderLootCard(ctx, state);

  if (state.gamePhase === GAME_PHASE.BATTLE) {
    drawStatusIcons(ctx, state);
  }

  // 楼层过渡动画（最顶层，覆盖一切）
  renderFloorTransition(ctx, state);
}

function drawBattleBorder(ctx, state, w, h) {
  if (state.gamePhase !== GAME_PHASE.BATTLE) return;
  if (state.isBossFloor) {
    ctx.strokeStyle = RENDER.BOSS_BORDER_COLOR;
    ctx.lineWidth = RENDER.BOSS_BORDER_WIDTH;
    const bw = RENDER.BOSS_BORDER_WIDTH / 2;
    ctx.strokeRect(bw, bw, w - bw * 2, h - bw * 2);
  } else {
    ctx.strokeStyle = RENDER.BATTLE_BORDER_COLOR;
    ctx.lineWidth = RENDER.BATTLE_BORDER_WIDTH;
    const bw = RENDER.BATTLE_BORDER_WIDTH;
    ctx.strokeRect(bw / 2, bw / 2, w - bw, h - bw);
  }
}

function drawCampBackground(ctx, w, h) {
  ctx.fillStyle = '#1a1a2e';
  ctx.fillRect(0, 0, w, h);

  const cx = w / 2, cy = h / 3;
  const glow = ctx.createRadialGradient(cx, cy, 10, cx, cy, 80);
  glow.addColorStop(0, 'rgba(255, 180, 50, 0.4)');
  glow.addColorStop(0.5, 'rgba(255, 100, 20, 0.15)');
  glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = '#ffaa30'; ctx.font = 'bold 30px monospace';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('🔥', cx, cy);
  ctx.fillStyle = '#ffdd88'; ctx.font = 'bold 20px monospace';
  ctx.fillText('CAMP', cx, cy - 60);
  ctx.fillStyle = '#444466'; ctx.font = '14px monospace';
  ctx.fillText('🏕', cx, cy + 80);
}
