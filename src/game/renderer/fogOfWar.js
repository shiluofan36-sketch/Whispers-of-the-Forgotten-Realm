// 战争迷雾系统：混合记忆残影
// 视野内完全可见 / 已探索区域隐约可见 / 未探索区域漆黑
import { GRID_SIZE, CELL_SIZE, GAME_PHASE } from '../constants';
import { getLightRadius } from './lightSource';

/**
 * 重置当前楼层的已探索记录（进入新楼层时调用）
 */
export function resetVisitedTiles(state) {
  state.visitedTiles = new Set();
}

/**
 * 标记玩家周围可见格子为已探索
 */
export function updateVisitedTiles(state) {
  if (state.gamePhase !== GAME_PHASE.EXPLORATION) return;
  if (!state.visitedTiles) state.visitedTiles = new Set();

  const { x, y } = state.player;
  const radius = getLightRadius(state);

  for (let dx = -Math.ceil(radius); dx <= Math.ceil(radius); dx++) {
    for (let dy = -Math.ceil(radius); dy <= Math.ceil(radius); dy++) {
      const tx = x + dx;
      const ty = y + dy;
      if (tx >= 0 && tx < GRID_SIZE && ty >= 0 && ty < GRID_SIZE) {
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist <= radius) {
          state.visitedTiles.add(`${tx},${ty}`);
        }
      }
    }
  }
}

/**
 * 检查某个格子是否在玩家视野范围内
 */
export function isInVisionRange(state, col, row) {
  if (state.gamePhase !== GAME_PHASE.EXPLORATION) return true;
  const { x, y } = state.player;
  const radius = getLightRadius(state);
  const dist = Math.sqrt((col - x) ** 2 + (row - y) ** 2);
  return dist <= radius;
}

/**
 * 渲染迷雾叠加层：已探索但不在视野 → 50%暗，未探索 → 85%黑
 */
export function renderFogOfWar(ctx, state) {
  if (state.gamePhase !== GAME_PHASE.EXPLORATION) return;
  if (!state.visitedTiles || state.visitedTiles.size === 0) {
    // 延迟初始化：载入存档或首次进入时，标记初始可见区域
    updateVisitedTiles(state);
  }
  if (!state.visitedTiles || state.visitedTiles.size === 0) {
    // 仍然为空（极端情况），全黑
    ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
    ctx.fillRect(0, 0, GRID_SIZE * CELL_SIZE, GRID_SIZE * CELL_SIZE);
    return;
  }

  const radius = getLightRadius(state);
  const { x: px, y: py } = state.player;

  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      const dist = Math.sqrt((col - px) ** 2 + (row - py) ** 2);
      if (dist <= radius) continue;

      const key = `${col},${row}`;
      const isVisited = state.visitedTiles.has(key);
      const alpha = isVisited ? 0.50 : 0.85;

      ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
      ctx.fillRect(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    }
  }
}
