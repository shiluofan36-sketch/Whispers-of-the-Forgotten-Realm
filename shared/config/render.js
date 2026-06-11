// 渲染常量（唯一配置源：shared/config/render.js）
export const GRID_SIZE = 10;
export const CELL_SIZE = 72;

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
  BOSS_BORDER_COLOR: '#ffaa00',
  BOSS_BORDER_WIDTH: 6,
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

// Phase 14: 统一稀有度颜色（单一配置源）
export const RARITY_COLORS = {
  common:    '#9CA3AF',
  rare:      '#3B82F6',
  epic:      '#A855F7',
  legendary: '#F59E0B',
};

export const RARITY_GLOW = {
  common:    null,
  rare:      '#3B82F6',
  epic:      '#A855F7',
  legendary: '#F59E0B',
};

export const STAIRS_COLOR = '#ffdd00';
export const STAIRS_LOCKED_COLOR = '#cc3333';
export const STAIRS_LABEL = '>';
export const STAIRS_LOCKED_LABEL = 'X';

export const OBSTACLE_THEME = {
  forest:    { rock: '#7a8a6a', tree: '#2a6a2a' },
  cave:      { rock: '#5a5a6a', tree: '#4a6a8a' },
  ruins:     { rock: '#9a8a6a', tree: '#5a4a3a' },
  lava:      { rock: '#3a1a1a', tree: '#3a1515', bg: '#3a1010', grid: '#4a1a1a' },
  graveyard: { rock: '#7a7a7a', tree: '#3a3a3a', bg: '#1a1a1e', grid: '#2a2a3a' },
  ice:       { rock: '#9abacc', tree: '#8abacc', bg: '#1a2a3a', grid: '#2a3a4a' },
  void:      { rock: '#4a3a5a', tree: '#3a2a4a', bg: '#0a0a14', grid: '#1a1a2a' },
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
