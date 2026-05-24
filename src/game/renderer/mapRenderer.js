// 地图渲染：网格 / 障碍物 / 楼梯 / 房间
import {
  GRID_SIZE, CELL_SIZE, COLOR, OBSTACLE_STYLE, RENDER,
  STAIRS_COLOR, STAIRS_LABEL, STAIRS_LOCKED_COLOR, STAIRS_LOCKED_LABEL,
} from '../constants';
import { ROOM_TYPES } from '../rooms/roomData';

export function drawGrid(ctx) {
  ctx.strokeStyle = COLOR.GRID;
  ctx.lineWidth = 1;
  for (let i = 0; i <= GRID_SIZE; i++) {
    const pos = i * CELL_SIZE;
    ctx.beginPath(); ctx.moveTo(pos, 0); ctx.lineTo(pos, GRID_SIZE * CELL_SIZE); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, pos); ctx.lineTo(GRID_SIZE * CELL_SIZE, pos); ctx.stroke();
  }
}

export function drawObstacles(ctx, obstacles) {
  const pad = RENDER.PADDING;
  for (const obs of obstacles) {
    const style = obs.color ? { color: obs.color } : (OBSTACLE_STYLE[obs.type] || OBSTACLE_STYLE.rock);
    const px = obs.x * CELL_SIZE, py = obs.y * CELL_SIZE;
    ctx.fillStyle = style.color;
    ctx.fillRect(px + pad, py + pad, CELL_SIZE - pad * 2, CELL_SIZE - pad * 2);
    ctx.fillStyle = RENDER.OBSTACLE_LABEL_COLOR;
    ctx.font = RENDER.OBSTACLE_FONT;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    const label = OBSTACLE_STYLE[obs.type] ? OBSTACLE_STYLE[obs.type].label : '?';
    ctx.fillText(label, px + CELL_SIZE / 2, py + CELL_SIZE / 2);
  }
}

export function drawStairs(ctx, stairs, locked) {
  const pad = RENDER.PADDING;
  const px = stairs.x * CELL_SIZE, py = stairs.y * CELL_SIZE;
  if (locked) {
    ctx.fillStyle = STAIRS_LOCKED_COLOR;
    ctx.fillRect(px + pad, py + pad, CELL_SIZE - pad * 2, CELL_SIZE - pad * 2);
    ctx.fillStyle = '#ffffff'; ctx.font = 'bold 20px monospace';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(STAIRS_LOCKED_LABEL, px + CELL_SIZE / 2, py + CELL_SIZE / 2);
  } else {
    ctx.fillStyle = STAIRS_COLOR;
    ctx.fillRect(px + pad, py + pad, CELL_SIZE - pad * 2, CELL_SIZE - pad * 2);
    ctx.fillStyle = '#000000'; ctx.font = 'bold 20px monospace';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(STAIRS_LABEL, px + CELL_SIZE / 2, py + CELL_SIZE / 2);
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
