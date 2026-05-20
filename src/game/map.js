import { GRID_SIZE, OBSTACLE_COUNT, OBSTACLE_GEN_MAX_ATTEMPTS } from './constants';

/**
 * 在地图上随机找一个空地（不能与排除列表中的坐标重叠）
 * @param {{x: number, y: number}} exclude - 单个要避开的坐标（通常是玩家位置）
 * @param {Array} obstacles - 障碍物数组（可选）
 * @returns {{x: number, y: number}}
 */
export function findEmptyCell(exclude, obstacles = []) {
  let x, y;
  do {
    x = Math.floor(Math.random() * GRID_SIZE);
    y = Math.floor(Math.random() * GRID_SIZE);
  } while (
    (x === exclude.x && y === exclude.y) ||
    isObstacle(x, y, obstacles)
  );
  return { x, y };
}

/**
 * 检查两个坐标是否相同（碰撞检测）
 */
export function isSameCell(a, b) {
  return a.x === b.x && a.y === b.y;
}

/**
 * 检查坐标是否在地图范围内
 */
export function isInBounds(x, y) {
  return x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE;
}

/**
 * 检查指定坐标是否有障碍物
 */
export function isObstacle(x, y, obstacles) {
  return obstacles.some(o => o.x === x && o.y === y);
}

/**
 * 在地图上随机生成障碍物
 * @param {number} count - 障碍物数量
 * @param {Array} excludeList - 要避开的坐标列表 [{x,y}, ...]
 * @returns {Array} - 障碍物数组 [{x, y, type: 'rock'|'tree'}, ...]
 */
export function generateObstacles(count, excludeList = []) {
  const obstacles = [];
  const types = ['rock', 'tree'];

  for (let i = 0; i < count; i++) {
    let x, y;
    let attempts = 0;
    do {
      x = Math.floor(Math.random() * GRID_SIZE);
      y = Math.floor(Math.random() * GRID_SIZE);
      attempts++;
    } while (
      attempts < OBSTACLE_GEN_MAX_ATTEMPTS && (
        excludeList.some(e => e.x === x && e.y === y) ||
        isObstacle(x, y, obstacles)
      )
    );

    if (attempts < OBSTACLE_GEN_MAX_ATTEMPTS) {
      obstacles.push({
        x,
        y,
        type: types[Math.floor(Math.random() * types.length)],
      });
    }
  }

  return obstacles;
}
