import { isInBounds, isObstacle } from './map';

/**
 * 根据方向键计算玩家新位置
 * 检查边界和障碍物
 *
 * @param {{x: number, y: number}} player - 玩家当前位置
 * @param {string} direction - 'up' | 'down' | 'left' | 'right'
 * @param {Array} obstacles - 障碍物数组
 * @returns {{x: number, y: number} | null} - 新位置，越界/碰障碍物返回 null
 */
export function getNewPosition(player, direction, obstacles) {
  const moves = {
    up:    { x: player.x,     y: player.y - 1 },
    down:  { x: player.x,     y: player.y + 1 },
    left:  { x: player.x - 1, y: player.y     },
    right: { x: player.x + 1, y: player.y     },
  };

  const newPos = moves[direction];
  if (!newPos) return null;

  // 边界检查
  if (!isInBounds(newPos.x, newPos.y)) return null;

  // 障碍物检查
  if (isObstacle(newPos.x, newPos.y, obstacles)) return null;

  return newPos;
}
