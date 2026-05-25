// 瓦片系统：像素数据 + 生物群落调色板（唯一配置源）
// 每个瓦片 8x8 像素数据，渲染时放大到 CELL_SIZE (48px → 每像素=6px)

export const TILE_SIZE = 8; // 源像素尺寸

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
};

// 生物群落调色板：每种瓦片类型在不同主题下的颜色映射
export const BIOME_PALETTES = {
  forest: {
    floor:   { F: '#1a3a1a', D: '#153215', L: '#1f4420', G: '#1a4a1a', V: '#1f5520', C: '#0f2f0f' },
    wall:    { W: '#3a3a2a', S: '#2a2a1a' },
    lava:    { E: '#ff4400', F: '#2a1010' },
    cracked: { F: '#1a3a1a', C: '#0f2f0f' },
    stairs:  { T: '#aa8844', F: '#1a3a1a' },
    bg:      '#0d1f0d',
    grid:    '#1a3a1a',
  },
  cave: {
    floor:   { F: '#1a1a2e', D: '#151528', L: '#1f1f35', G: '#1a1a2e', V: '#1a2a2e', C: '#101020' },
    wall:    { W: '#3a3a4a', S: '#2a2a3a' },
    lava:    { E: '#ff4400', F: '#2a1010' },
    cracked: { F: '#1a1a2e', C: '#101020' },
    stairs:  { T: '#998866', F: '#1a1a2e' },
    bg:      '#0f0f1a',
    grid:    '#1a1a2e',
  },
  ruins: {
    floor:   { F: '#2a1a1a', D: '#241515', L: '#302020', G: '#2a2018', V: '#302218', C: '#1a1010' },
    wall:    { W: '#4a3a2a', S: '#3a2a1a' },
    lava:    { E: '#ff5500', F: '#2a1010' },
    cracked: { F: '#2a1a1a', C: '#1a1010' },
    stairs:  { T: '#ccaa66', F: '#2a1a1a' },
    bg:      '#150d0d',
    grid:    '#2a1a1a',
  },
  lava: {
    floor:   { F: '#3a1010', D: '#2a0808', L: '#4a1515', G: '#3a1010', V: '#3a1508', C: '#1a0505' },
    wall:    { W: '#2a1510', S: '#1a0a05' },
    lava:    { E: '#ff6600', F: '#3a1010' },
    cracked: { F: '#3a1010', C: '#1a0505' },
    stairs:  { T: '#cc8833', F: '#3a1010' },
    bg:      '#1a0808',
    grid:    '#3a1010',
  },
  graveyard: {
    floor:   { F: '#1a1a1e', D: '#151518', L: '#202025', G: '#1a1e1a', V: '#1e221e', C: '#0f0f12' },
    wall:    { W: '#3a3a3e', S: '#252528' },
    lava:    { E: '#884488', F: '#1a1a1e' },
    cracked: { F: '#1a1a1e', C: '#0f0f12' },
    stairs:  { T: '#888877', F: '#1a1a1e' },
    bg:      '#0e0e12',
    grid:    '#1a1a1e',
  },
  ice: {
    floor:   { F: '#1a2a3a', D: '#152232', L: '#203040', G: '#1a2a3a', V: '#20303a', C: '#101a2a' },
    wall:    { W: '#3a4a5a', S: '#2a3a4a' },
    lava:    { E: '#ff4488', F: '#2a1020' },
    cracked: { F: '#1a2a3a', C: '#101a2a' },
    stairs:  { T: '#99bbdd', F: '#1a2a3a' },
    bg:      '#0d1822',
    grid:    '#1a2a3a',
  },
  void: {
    floor:   { F: '#0a0a14', D: '#060610', L: '#0e0e18', G: '#0a0a14', V: '#0e0a14', C: '#04040a' },
    wall:    { W: '#2a1a3a', S: '#1a0a2a' },
    lava:    { E: '#aa44ff', F: '#1a0a14' },
    cracked: { F: '#0a0a14', C: '#04040a' },
    stairs:  { T: '#7744aa', F: '#0a0a14' },
    bg:      '#05050a',
    grid:    '#0a0a14',
  },
};

// 障碍物在瓦片地图上的特殊颜色（替换默认岩石/树）
export const OBSTACLE_TILE_COLORS = {
  rock: { W: '#666666', S: '#444444' },
  tree: { W: '#225522', S: '#114411' },
};
