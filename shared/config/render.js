// 渲染常量（唯一配置源：shared/config/render.js）
export const GRID_SIZE = 10;
export const CELL_SIZE = 48;

export const OBSTACLE_COUNT = 6;
export const OBSTACLE_GEN_MAX_ATTEMPTS = 100;
export const OBSTACLE_STYLE = {
  rock: { color: '#888888', label: 'R' },
  tree: { color: '#228833', label: 'T' },
};

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

export const STAIRS_COLOR = '#ffdd00';
export const STAIRS_LOCKED_COLOR = '#cc3333';
export const STAIRS_LABEL = '>';
export const STAIRS_LOCKED_LABEL = 'X';

export const OBSTACLE_THEME = {
  forest:    { rock: '#888888', tree: '#228833' },
  cave:      { rock: '#777799', tree: '#887744' },
  ruins:     { rock: '#998866', tree: '#665544' },
  lava:      { rock: '#444444', tree: '#cc4400', bg: '#3a1010', grid: '#4a1a1a' },
  graveyard: { rock: '#666677', tree: '#445544', bg: '#1a1a1e', grid: '#2a2a3a' },
  ice:       { rock: '#aabbdd', tree: '#ccddff', bg: '#1a2a3a', grid: '#2a3a4a' },
  void:      { rock: '#331144', tree: '#221133', bg: '#0a0a14', grid: '#1a1a2a' },
};

export const THEME_BG = {
  forest:    '#1a3a1a',
  cave:      '#1a1a2e',
  ruins:     '#2a1a1a',
  lava:      '#3a1010',
  graveyard: '#1a1a1e',
  ice:       '#1a2a3a',
  void:      '#0a0a14',
};
