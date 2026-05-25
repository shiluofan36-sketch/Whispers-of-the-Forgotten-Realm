import { GRID_SIZE, OBSTACLE_COUNT, FLOORS, OBSTACLE_THEME, OBSTACLE_GEN_MAX_ATTEMPTS, FLOOR_MONSTER_COUNT } from '../constants';
import { generateMonster } from '../monsters';
import { scaleMonsterForFloor } from './difficultyScaling';
import { createBoss } from '../boss/bossFactory';
import { lockStairs } from './stairsSystem';
import { generateRoomForFloor } from '../rooms/roomManager';

/**
 * 为指定楼层生成完整地图：障碍物 + 怪物 + 楼梯
 */
export function generateFloor(state, floor) {
  const config = FLOORS[floor];

  state.currentFloor = floor;
  state.floorName = config.name;
  state.isBossFloor = !!config.isBoss;
  state.floorBg = config.bg;
  state.obstacleTheme = config.obstacleTheme || 'forest';
  state.stairs = null;
  state.floorCleared = false;

  // 设置当前层怪物计数 + 楼梯锁定
  state.enemiesRemaining = FLOOR_MONSTER_COUNT[floor] || 0;
  lockStairs(state);

  // 重置玩家位置到地图中央
  state.player.x = Math.floor(GRID_SIZE / 2);
  state.player.y = Math.floor(GRID_SIZE / 2);

  // 生成障碍物（使用楼层主题）
  state.obstacles = generateFloorObstacles(config, [state.player]);

  // 生成怪物或Boss
  if (config.isBoss) {
    const bossKey = config.bossKey || 'ANCIENT_DRAGON';
    state.monster = createBoss(state.player, state.obstacles, bossKey);
  } else {
    state.monster = generateFloorMonster(config, state.player, state.obstacles, floor, state.ascensionLevel || 0);
  }

  state.room = null; // 清空上一层的房间

  // 非Boss层生成楼梯（初始锁定）
  if (!config.isBoss) {
    state.stairs = findStairsCell(state.player, state.monster, state.obstacles);
    generateRoomForFloor(state);
  }

  state.battleLog = [];
  state.gamePhase = 'exploration';
  state.battleLog.push(`进入${config.name}`);
}

/**
 * 生成楼层障碍物（使用对应主题）
 */
function generateFloorObstacles(floorConfig, excludeList) {
  const theme = OBSTACLE_THEME[floorConfig.obstacleTheme] || OBSTACLE_THEME.forest;
  const obstacles = [];
  const types = ['rock', 'tree'];

  for (let i = 0; i < OBSTACLE_COUNT; i++) {
    let x, y;
    let attempts = 0;
    do {
      x = Math.floor(Math.random() * GRID_SIZE);
      y = Math.floor(Math.random() * GRID_SIZE);
      attempts++;
    } while (
      attempts < OBSTACLE_GEN_MAX_ATTEMPTS && (
        excludeList.some(e => e.x === x && e.y === y) ||
        obstacles.some(o => o.x === x && o.y === y)
      )
    );

    if (attempts < OBSTACLE_GEN_MAX_ATTEMPTS) {
      const type = types[Math.floor(Math.random() * types.length)];
      obstacles.push({ x, y, type, color: theme[type] });
    }
  }

  return obstacles;
}

/**
 * 根据楼层怪物池生成怪物并缩放（使用共享的generateMonster支持精英怪）
 */
function generateFloorMonster(floorConfig, playerPos, obstacles, floor, ascensionLevel = 0) {
  const pool = floorConfig.monsterPool;
  const monster = generateMonster(playerPos, obstacles, pool);
  return scaleMonsterForFloor(monster, floor, ascensionLevel);
}

/**
 * 找到楼梯位置（不与玩家/怪物/障碍物重叠）
 */
function findStairsCell(player, monster, obstacles) {
  let x, y;
  let attempts = 0;
  do {
    x = Math.floor(Math.random() * GRID_SIZE);
    y = Math.floor(Math.random() * GRID_SIZE);
    attempts++;
  } while (
    attempts < 200 && (
      (x === player.x && y === player.y) ||
      (monster && x === monster.x && y === monster.y) ||
      obstacles.some(o => o.x === x && o.y === y)
    )
  );

  return { x, y };
}
