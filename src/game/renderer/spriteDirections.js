// 精灵四方向常量（俯视角游戏约定）

export const DIR = {
  DOWN:  'down',   // 面朝屏幕下方 → 显示正面
  UP:    'up',     // 面朝屏幕上方 → 显示背面
  LEFT:  'left',   // 面朝屏幕左侧 → 显示左侧面
  RIGHT: 'right',  // 面朝屏幕右侧 → 显示右侧面
};

export const ALL_DIRS = ['down', 'up', 'left', 'right'];

/**
 * 根据移动向量计算朝向
 */
export function directionFromDelta(dx, dy) {
  if (Math.abs(dx) >= Math.abs(dy)) {
    return dx > 0 ? DIR.RIGHT : DIR.LEFT;
  } else {
    return dy > 0 ? DIR.DOWN : DIR.UP;
  }
}
