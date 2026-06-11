// 瓦片系统：像素数据 + 生物群落调色板（唯一配置源）
// 每个瓦片 24×24 像素数据，渲染时放大到 CELL_SIZE (72px → 每像素=3px)

export const TILE_SIZE = 24; // 源像素尺寸

// 瓦片类型定义：8x8 像素数据字符串数组
// 字符映射到调色板索引（见 BIOME_PALETTES）
//   . = 透明/地面
//   F = 地板主色
//   D = 地板暗色
//   L = 地板亮色
//   W = 墙壁主色
//   S = 墙壁阴影
//   H = 高亮
//   C = 裂纹
//   E = 熔岩发光
//   G = 草地
//   V = 植被
//   T = 楼梯阶
export const TILE_DATA = {
  // 普通地牢地板
  dungeon: [
    'FFFFFFFF',
    'FFFFFFFF',
    'FFDDFFFF',
    'FFFFFFFF',
    'FFFFDDFF',
    'FFFFFFFF',
    'FFDDFFFF',
    'FFFFFFFF',
  ],
  // 草地
  grass: [
    'GGGGGGGG',
    'GGGVGGGG',
    'GGGGGVGG',
    'GGGGGGGG',
    'GVGGGGGG',
    'GGGGGGVG',
    'GGGGGGGG',
    'GGVGGGGG',
  ],
  // 石板地
  stone: [
    'LFFFLFFL',
    'FFFFFFFF',
    'FFFFFFFL',
    'LFFFFLFF',
    'FFFFFFFF',
    'FLFFFFFF',
    'FFFFFFLF',
    'LFFLFFFF',
  ],
  // 墙壁
  wall: [
    'WWWWWWWW',
    'WSSWWSSW',
    'WWWWWWWW',
    'WSSWWSSW',
    'WWWWWWWW',
    'SWWSSWWS',
    'WWWWWWWW',
    'WSSWWSSW',
  ],
  // 熔岩地
  lava: [
    'EEFEEFEE',
    'FEEFEEFE',
    'EEFEEFEE',
    'FEEEEEFE',
    'EEFEEFEE',
    'FEFEEFEE',
    'EEEEFEEE',
    'FEEFEEFE',
  ],
  // 碎裂地板
  cracked: [
    'FFCFFFFF',
    'FFFFCFFF',
    'CFFFFFFC',
    'FFFFCFFF',
    'FFFCFFFF',
    'FCFCFFFF',
    'FFFFFCFF',
    'CFFFFFFF',
  ],
  // 石头：圆润的巨石
  rock: [
    '........',
    '..DDDD..',
    '.DRRRRD.',
    '.DRRRRD.',
    '.DRRRRD.',
    '.DRRRRD.',
    '..DDDD..',
    '........',
  ],
  // 树：松树/针叶树
  tree: [
    '....L...',
    '...LLL..',
    '..LLLLL.',
    '...LLL..',
    '..LWWWL.',
    '..LWWWL.',
    '...WWW..',
    '....W...',
  ],
};

// 生物群落调色板：每种瓦片类型在不同主题下的颜色映射
export const BIOME_PALETTES = {
  forest: {
    floor:   { F: '#1a3a1a', D: '#153215', L: '#1f4420', G: '#1a4a1a', V: '#1f5520', C: '#0f2f0f' },
    wall:    { W: '#3a3a2a', S: '#2a2a1a' },
    lava:    { E: '#ff4400', F: '#2a1010' },
    cracked: { F: '#1a3a1a', C: '#0f2f0f' },
    stairs:  { X: '#aa8844', Y: '#664422', K: '#553311', D: '#332211', L: '#ccaa66', F: '#1a3a1a' },
    rock:    { R: '#7a8a6a', K: '#4a5a3a', H: '#9aaa8a' },
    tree:    { E: '#2a6a2a', T: '#6a5a3a', B: '#1a4a1a', L: '#4a9a4a' },
    bg:      '#0d1f0d',
    grid:    '#1a3a1a',
  },
  cave: {
    floor:   { F: '#1a1a2e', D: '#151528', L: '#1f1f35', G: '#1a1a2e', V: '#1a2a2e', C: '#101020' },
    wall:    { W: '#3a3a4a', S: '#2a2a3a' },
    lava:    { E: '#ff4400', F: '#2a1010' },
    cracked: { F: '#1a1a2e', C: '#101020' },
    stairs:  { X: '#998866', Y: '#554433', K: '#443322', D: '#332211', L: '#bbaa88', F: '#1a1a2e' },
    rock:    { R: '#5a5a6a', K: '#2a2a3a', H: '#7a7a8a' },
    tree:    { E: '#4a6a8a', T: '#5a5a7a', B: '#2a4a6a', L: '#6a8aaa' },
    bg:      '#0f0f1a',
    grid:    '#1a1a2e',
  },
  ruins: {
    floor:   { F: '#2a1a1a', D: '#241515', L: '#302020', G: '#2a2018', V: '#302218', C: '#1a1010' },
    wall:    { W: '#4a3a2a', S: '#3a2a1a' },
    lava:    { E: '#ff5500', F: '#2a1010' },
    cracked: { F: '#2a1a1a', C: '#1a1010' },
    stairs:  { X: '#ccaa66', Y: '#886633', K: '#775522', D: '#554422', L: '#ddcc88', F: '#2a1a1a' },
    rock:    { R: '#9a8a6a', K: '#5a4a3a', H: '#baaa8a' },
    tree:    { E: '#5a4a3a', T: '#4a3a2a', B: '#3a2a1a', L: '#7a6a5a' },
    bg:      '#150d0d',
    grid:    '#2a1a1a',
  },
  lava: {
    floor:   { F: '#3a1010', D: '#2a0808', L: '#4a1515', G: '#3a1010', V: '#3a1508', C: '#1a0505' },
    wall:    { W: '#2a1510', S: '#1a0a05' },
    lava:    { E: '#ff6600', F: '#3a1010' },
    cracked: { F: '#3a1010', C: '#1a0505' },
    stairs:  { X: '#cc8833', Y: '#885522', K: '#774411', D: '#553311', L: '#ddaa55', F: '#3a1010' },
    rock:    { R: '#3a1a1a', K: '#1a0a0a', H: '#5a2a2a' },
    tree:    { E: '#3a1515', T: '#2a0a0a', B: '#1a0505', L: '#5a2525' },
    bg:      '#1a0808',
    grid:    '#3a1010',
  },
  graveyard: {
    floor:   { F: '#1a1a1e', D: '#151518', L: '#202025', G: '#1a1e1a', V: '#1e221e', C: '#0f0f12' },
    wall:    { W: '#3a3a3e', S: '#252528' },
    lava:    { E: '#884488', F: '#1a1a1e' },
    cracked: { F: '#1a1a1e', C: '#0f0f12' },
    stairs:  { X: '#888877', Y: '#555544', K: '#444433', D: '#333322', L: '#aaaa99', F: '#1a1a1e' },
    rock:    { R: '#7a7a7a', K: '#4a4a4a', H: '#9a9a9a' },
    tree:    { E: '#3a3a3a', T: '#4a3a3a', B: '#2a2a2a', L: '#5a5a5a' },
    bg:      '#0e0e12',
    grid:    '#1a1a1e',
  },
  ice: {
    floor:   { F: '#1a2a3a', D: '#152232', L: '#203040', G: '#1a2a3a', V: '#20303a', C: '#101a2a' },
    wall:    { W: '#3a4a5a', S: '#2a3a4a' },
    lava:    { E: '#ff4488', F: '#2a1020' },
    cracked: { F: '#1a2a3a', C: '#101a2a' },
    stairs:  { X: '#99bbdd', Y: '#557799', K: '#446688', D: '#335577', L: '#bbddff', F: '#1a2a3a' },
    rock:    { R: '#9abacc', K: '#5a8a9a', H: '#bbddff' },
    tree:    { E: '#8abacc', T: '#6a9aaa', B: '#5a8a9a', L: '#aaccee' },
    bg:      '#0d1822',
    grid:    '#1a2a3a',
  },
  void: {
    floor:   { F: '#0a0a14', D: '#060610', L: '#0e0e18', G: '#0a0a14', V: '#0e0a14', C: '#04040a' },
    wall:    { W: '#2a1a3a', S: '#1a0a2a' },
    lava:    { E: '#aa44ff', F: '#1a0a14' },
    cracked: { F: '#0a0a14', C: '#04040a' },
    stairs:  { X: '#7744aa', Y: '#442266', K: '#331155', D: '#220044', L: '#9966cc', F: '#0a0a14' },
    rock:    { R: '#4a3a5a', K: '#2a1a3a', H: '#6a5a7a' },
    tree:    { E: '#3a2a4a', T: '#2a1a3a', B: '#1a0a2a', L: '#5a4a6a' },
    bg:      '#05050a',
    grid:    '#0a0a14',
  },
};

// 障碍物在瓦片地图上的特殊颜色（替换默认岩石/树）
export const OBSTACLE_TILE_COLORS = {
  rock: { W: '#666666', S: '#444444' },
  tree: { W: '#225522', S: '#114411' },
};
