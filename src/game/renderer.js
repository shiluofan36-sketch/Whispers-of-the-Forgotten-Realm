import {
  GRID_SIZE, CELL_SIZE, COLOR, GAME_PHASE, RENDER,
} from './constants';
import { renderFloatingTexts } from './effects/floatingTextManager';
import { getScreenShakeOffset } from './effects/screenShake';
import { renderSkillEffects } from './animation/skillEffectRenderer';
import { renderLootCard } from './animation/lootAnimation';
import { drawGrid, drawObstacles, drawStairs, drawRoom } from './renderer/mapRenderer';
import { drawEntity, drawStatusIcons } from './renderer/entityRenderer';

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

  ctx.fillStyle = state.gamePhase === GAME_PHASE.BATTLE
    ? COLOR.BATTLE_BG
    : (state.floorBg || COLOR.BG);
  ctx.fillRect(-shake.dx, -shake.dy, canvasWidth + Math.abs(shake.dx) * 2, canvasHeight + Math.abs(shake.dy) * 2);

  drawGrid(ctx);
  drawObstacles(ctx, state.obstacles);

  if (state.room && state.gamePhase === GAME_PHASE.EXPLORATION) {
    drawRoom(ctx, state.room);
  }

  if (state.stairs && state.gamePhase === GAME_PHASE.EXPLORATION) {
    drawStairs(ctx, state.stairs, state.stairsLocked);
  }

  // Boss 小兵渲染
  if (state.bossMinions && state.bossMinions.length > 0) {
    for (const minion of state.bossMinions) {
      drawEntity(ctx, minion, minion.color || '#886644', 'm', state);
    }
  }

  if (state.monster) {
    drawEntity(ctx, state.monster, state.monster.color || COLOR.MONSTER, 'M', state);
  }

  if (state.gamePhase !== GAME_PHASE.GAME_OVER && state.gamePhase !== GAME_PHASE.VICTORY) {
    drawEntity(ctx, state.player, COLOR.PLAYER, 'P', state);
  }

  // 技能特效（在实体之上、浮动文字之下）
  renderSkillEffects(ctx, state);

  // 战斗边框
  if (state.gamePhase === GAME_PHASE.BATTLE) {
    if (state.isBossFloor) {
      ctx.strokeStyle = '#ffaa00'; ctx.lineWidth = 6;
      const bw = 3;
      ctx.strokeRect(bw, bw, canvasWidth - bw * 2, canvasHeight - bw * 2);
    } else {
      ctx.strokeStyle = RENDER.BATTLE_BORDER_COLOR;
      ctx.lineWidth = RENDER.BATTLE_BORDER_WIDTH;
      const bw = RENDER.BATTLE_BORDER_WIDTH;
      ctx.strokeRect(bw / 2, bw / 2, canvasWidth - bw, canvasHeight - bw);
    }
  }

  ctx.restore();

  renderFloatingTexts(ctx, state);

  // 装备掉落卡片（最顶层）
  renderLootCard(ctx, state);

  if (state.gamePhase === GAME_PHASE.BATTLE) {
    drawStatusIcons(ctx, state);
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
