// 玩家光源系统：生物群落自适应的径向光晕 + 呼吸动画
import { GRID_SIZE, CELL_SIZE, GAME_PHASE } from '../constants';

const BIOME_LIGHT = {
  forest:    { r: 255, g: 210, b: 120, radius: 3.5 },
  cave:      { r: 150, g: 180, b: 220, radius: 2.5 },
  ruins:     { r: 255, g: 180, b: 60,  radius: 3.0 },
  lava:      { r: 255, g: 80,  b: 30,  radius: 4.0 },
  graveyard: { r: 160, g: 140, b: 210, radius: 3.0 },
  ice:       { r: 180, g: 220, b: 255, radius: 3.0 },
  void:      { r: 80,  g: 40,  b: 130, radius: 2.0 },
};

export function getLightRadius(state) {
  const biome = state.obstacleTheme || 'forest';
  const cfg = BIOME_LIGHT[biome] || BIOME_LIGHT.forest;
  const bossPenalty = state.isBossFloor ? 0.5 : 0;
  return Math.max(1.5, cfg.radius - bossPenalty);
}

export function renderLightSource(ctx, state) {
  if (state.gamePhase !== GAME_PHASE.EXPLORATION) return;

  const biome = state.obstacleTheme || 'forest';
  const cfg = BIOME_LIGHT[biome] || BIOME_LIGHT.forest;
  const { x, y } = state.player;
  const baseRadius = getLightRadius(state);

  const cx = x * CELL_SIZE + CELL_SIZE / 2;
  const cy = y * CELL_SIZE + CELL_SIZE / 2;
  const r = baseRadius * CELL_SIZE;
  const canvasSize = GRID_SIZE * CELL_SIZE;

  // 呼吸波动：半径 ±6%，透明度 ±10%
  const time = state.animation?.idlePhase || 0;
  const breathe = 1 + Math.sin(time * 1.3) * 0.06 + Math.sin(time * 3.1) * 0.03;
  const animR = r * breathe;
  const alphaPulse = 1 + Math.sin(time * 1.7) * 0.10;

  // 第1层：脚下明亮光斑（角色像光源本体）
  const coreGradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, animR * 0.25);
  coreGradient.addColorStop(0, `rgba(${cfg.r},${cfg.g},${cfg.b}, ${0.28 * alphaPulse})`);
  coreGradient.addColorStop(0.3, `rgba(${cfg.r},${cfg.g},${cfg.b}, ${0.15 * alphaPulse})`);
  coreGradient.addColorStop(0.6, `rgba(${cfg.r},${cfg.g},${cfg.b}, ${0.05 * alphaPulse})`);
  coreGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = coreGradient;
  ctx.fillRect(0, 0, canvasSize, canvasSize);

  // 第2层：椭圆地面光（Y方向压缩模拟光在地面扩散）
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(1, 0.55);
  ctx.translate(-cx, -cy);
  const groundGradient = ctx.createRadialGradient(cx, cy, animR * 0.2, cx, cy, animR * 1.1);
  groundGradient.addColorStop(0, `rgba(${cfg.r},${cfg.g},${cfg.b}, ${0.08 * alphaPulse})`);
  groundGradient.addColorStop(0.35, `rgba(${cfg.r},${cfg.g},${cfg.b}, ${0.04 * alphaPulse})`);
  groundGradient.addColorStop(0.65, `rgba(${cfg.r},${cfg.g},${cfg.b}, ${0.015 * alphaPulse})`);
  groundGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = groundGradient;
  ctx.fillRect(0, 0, canvasSize, canvasSize);
  ctx.restore();

  // 第3层：主光源（平滑6-stop渐变）
  const mainGradient = ctx.createRadialGradient(cx, cy, animR * 0.12, cx, cy, animR);
  mainGradient.addColorStop(0, `rgba(${cfg.r},${cfg.g},${cfg.b}, ${0.10 * alphaPulse})`);
  mainGradient.addColorStop(0.2, `rgba(${cfg.r},${cfg.g},${cfg.b}, ${0.06 * alphaPulse})`);
  mainGradient.addColorStop(0.4, `rgba(${cfg.r},${cfg.g},${cfg.b}, ${0.035 * alphaPulse})`);
  mainGradient.addColorStop(0.6, `rgba(${cfg.r},${cfg.g},${cfg.b}, ${0.018 * alphaPulse})`);
  mainGradient.addColorStop(0.8, `rgba(${cfg.r},${cfg.g},${cfg.b}, ${0.006 * alphaPulse})`);
  mainGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = mainGradient;
  ctx.fillRect(0, 0, canvasSize, canvasSize);

  // 第4层：外圈微弱环境光（半径 × 1.6）
  const ambientGradient = ctx.createRadialGradient(cx, cy, animR * 0.5, cx, cy, animR * 1.6);
  ambientGradient.addColorStop(0, `rgba(${cfg.r},${cfg.g},${cfg.b}, ${0.025 * alphaPulse})`);
  ambientGradient.addColorStop(0.5, `rgba(${cfg.r},${cfg.g},${cfg.b}, ${0.008 * alphaPulse})`);
  ambientGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = ambientGradient;
  ctx.fillRect(0, 0, canvasSize, canvasSize);
}
