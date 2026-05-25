// 地图渲染：网格 / 障碍物 / 楼梯 / 房间
import {
  GRID_SIZE, CELL_SIZE, RENDER,
} from '../constants';
import { ROOM_TYPES } from '../rooms/roomData';
import { getObstacleTile, getStairsTile } from './tileRenderer';

// 网格绘制已移至 tileRenderer.drawTileGrid()

export function drawObstacles(ctx, obstacles, biome) {
  for (const obs of obstacles) {
    const px = obs.x * CELL_SIZE, py = obs.y * CELL_SIZE;
    const tileCanvas = getObstacleTile(biome, obs.type);
    if (tileCanvas) {
      ctx.drawImage(tileCanvas, px, py);
    } else {
      // 回退：纯色矩形
      ctx.fillStyle = obs.color || '#888888';
      ctx.fillRect(px + 4, py + 4, CELL_SIZE - 8, CELL_SIZE - 8);
    }
  }
}

export function drawStairs(ctx, stairs, locked, biome) {
  const px = stairs.x * CELL_SIZE, py = stairs.y * CELL_SIZE;
  const tileCanvas = getStairsTile(biome, locked);
  if (tileCanvas) {
    ctx.drawImage(tileCanvas, px, py);
  } else {
    // 回退：纯色矩形 + 文字
    ctx.fillStyle = locked ? '#cc3333' : '#ffdd00';
    ctx.fillRect(px + 4, py + 4, CELL_SIZE - 8, CELL_SIZE - 8);
    ctx.fillStyle = locked ? '#ffffff' : '#000000';
    ctx.font = 'bold 20px monospace';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(locked ? 'X' : '>', px + CELL_SIZE / 2, py + CELL_SIZE / 2);
  }
}

export function drawRoom(ctx, room) {
  const roomDef = Object.values(ROOM_TYPES).find(r => r.type === room.type);
  if (!roomDef) return;
  const x = room.x * CELL_SIZE, y = room.y * CELL_SIZE;
  ctx.fillStyle = roomDef.color + '33';
  ctx.fillRect(x + 2, y + 2, CELL_SIZE - 4, CELL_SIZE - 4);
  ctx.strokeStyle = roomDef.color; ctx.lineWidth = 2;
  ctx.strokeRect(x + 2, y + 2, CELL_SIZE - 4, CELL_SIZE - 4);
  ctx.fillStyle = roomDef.color; ctx.font = 'bold 20px monospace';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(roomDef.symbol, x + CELL_SIZE / 2, y + CELL_SIZE / 2);
}
