// 地图常量
export const GRID_SIZE = 10;
export const CELL_SIZE = 48;

// 障碍物
export const OBSTACLE_COUNT = 6;
export const OBSTACLE_GEN_MAX_ATTEMPTS = 100;
export const OBSTACLE_STYLE = {
  rock: { color: '#888888', label: 'R' },
  tree: { color: '#228833', label: 'T' },
};

// 渲染常量
export const RENDER = {
  PADDING: 4,
  BATTLE_BORDER_COLOR: '#ff4444',
  BATTLE_BORDER_WIDTH: 4,
  SHIELD_LINE_WIDTH: 3,
  HP_BAR_HEIGHT: 4,
  HP_BAR_OFFSET_Y: -6,
  ENTITY_LABEL_COLOR: '#000',
  ENTITY_FONT: 'bold 14px monospace',
  OBSTACLE_FONT: 'bold 12px monospace',
  OBSTACLE_LABEL_COLOR: '#ffffff',
};

// 颜色常量
export const COLOR = {
  BG:        '#1a1a2e',
  GRID:      '#2a2a4a',
  PLAYER:    '#00ff88',
  MONSTER:   '#ff4444',
  TEXT:      '#ffffff',
  HP_BAR:    '#ff4444',
  HP_BG:     '#333333',
  BATTLE_BG: '#2a1a1a',
  SHIELD:    '#44aaff',
};

// 楼梯渲染
export const STAIRS_COLOR = '#ffdd00';
export const STAIRS_LOCKED_COLOR = '#cc3333';
export const STAIRS_LABEL = '>';
export const STAIRS_LOCKED_LABEL = 'X';

// 障碍物主题
export const OBSTACLE_THEME = {
  forest: { rock: '#888888', tree: '#228833' },
  cave:   { rock: '#777799', tree: '#887744' },
  ruins:  { rock: '#998866', tree: '#665544' },
};
