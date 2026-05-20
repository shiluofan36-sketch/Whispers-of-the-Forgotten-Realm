// 地图常量
export const GRID_SIZE = 10;       // 10x10 网格
export const CELL_SIZE = 48;       // 每个格子的像素大小

// 玩家常量
export const PLAYER_HP = 100;           // 玩家初始血量
export const PLAYER_ATTACK_MIN = 5;     // 玩家最小攻击力
export const PLAYER_ATTACK_MAX = 15;    // 玩家最大攻击力
export const PLAYER_MP = 20;            // 玩家初始MP
export const PLAYER_STR = 5;            // 初始力量
export const PLAYER_DEF = 3;            // 初始防御
export const PLAYER_AGI = 5;            // 初始敏捷

// 技能常量
export const HEAL_AMOUNT = 15;          // 治疗恢复量
export const POST_BATTLE_HEAL = 20;     // 战斗胜利后恢复量

// 升级系统
export const EXP_BASE = 50;             // 升级经验 = level * EXP_BASE
export const LEVEL_UP_HP = 10;          // 升级增加最大HP
export const LEVEL_UP_ATK_MIN = 1;      // 升级增加最小攻击
export const LEVEL_UP_ATK_MAX = 2;      // 升级增加最大攻击
export const LEVEL_UP_MP = 5;           // 升级增加最大MP
export const LEVEL_UP_STR = 1;          // 升级增加力量
export const LEVEL_UP_DEF = 1;          // 升级增加防御
export const LEVEL_UP_AGI = 1;          // 升级增加敏捷

// 暴击系统
export const BASE_CRIT = 0.10;          // 基础暴击率 10%
export const AGI_CRIT = 0.02;           // 每点敏捷 +2% 暴击率
export const CRIT_MULT = 2.0;           // 暴击伤害倍率

// MP系统
export const MP_RESTORE = 5;            // 战斗胜利恢复MP

// ============================================================
//  怪物类型（纯数据驱动，新增类型只需加配置）
// ============================================================
export const MONSTER_TYPES = {
  GOBLIN: {
    name: '哥布林',
    hp: 30,  maxHp: 30,
    attackMin: 5,  attackMax: 15,
    attackRate: 0.8,   // 80%攻击 / 20%防御
    color: '#ff6644',  // 橙红色
    exp: 10,
  },
  SKELETON: {
    name: '骷髅兵',
    hp: 50,  maxHp: 50,
    attackMin: 4,  attackMax: 10,
    attackRate: 0.5,   // 50%攻击 / 50%防御
    color: '#dddddd',  // 白灰色
    exp: 20,
  },
  SLIME: {
    name: '史莱姆',
    hp: 80,  maxHp: 80,
    attackMin: 2,  attackMax: 6,
    attackRate: 0.4,   // 40%攻击 / 60%防御
    color: '#44cc44',  // 绿色
    exp: 30,
  },
  SHADOW: {
    name: '暗影',
    hp: 25,  maxHp: 25,
    attackMin: 8,  attackMax: 18,
    attackRate: 0.85,  // 高攻击倾向
    color: '#bb44ff',  // 紫色
    exp: 40,
  },
  GIANT_RAT: {
    name: '巨鼠',
    hp: 35,  maxHp: 35,
    attackMin: 5,  attackMax: 12,
    attackRate: 0.65,  // 中等攻击倾向
    color: '#bb8844',  // 棕色
    exp: 15,
  },
};

// ============================================================
//  道具类型
// ============================================================
export const ITEM_TYPES = {
  SMALL_POTION:   { name: '小药水',   effect: 'heal',        value: 20, maxStack: 10 },
  MP_POTION:      { name: 'MP药水',   effect: 'mpHeal',      value: 15, maxStack: 10 },
  ATTACK_SCROLL:  { name: '攻击卷轴', effect: 'attackBuff',  value: 5,  maxStack: 5  },
  DEFENSE_SCROLL: { name: '防御卷轴', effect: 'defenseBuff', value: 1,  maxStack: 5  },
};

// 背包容量（Phase 7: 从3格升级到10格基础容量）
export const INVENTORY_BASE_SLOTS = 10;

// 掉落概率
export const DROP_RATE = 0.5;

// 物品最大堆叠数（Phase 7: 堆叠系统）
export const MAX_STACK = {
  SMALL_POTION: 10,
  MP_POTION: 10,
  ATTACK_SCROLL: 5,
  DEFENSE_SCROLL: 5,
  MATERIAL: 99,
};

// ============================================================
//  障碍物
// ============================================================
export const OBSTACLE_COUNT = 6;
export const OBSTACLE_GEN_MAX_ATTEMPTS = 100;  // 障碍物生成最大尝试次数

// 障碍物渲染配置
export const OBSTACLE_STYLE = {
  rock: { color: '#888888', label: 'R' },
  tree: { color: '#228833', label: 'T' },
};

// ============================================================
//  渲染常量（Canvas 绘制参数，集中管理便于调参）
// ============================================================
export const RENDER = {
  PADDING: 4,                          // 实体方块内边距
  BATTLE_BORDER_COLOR: '#ff4444',      // 战斗边框颜色
  BATTLE_BORDER_WIDTH: 4,              // 战斗边框线宽
  SHIELD_LINE_WIDTH: 3,                // 防御盾牌边框线宽
  HP_BAR_HEIGHT: 4,                    // 血条高度
  HP_BAR_OFFSET_Y: -6,                 // 血条相对实体的垂直偏移
  ENTITY_LABEL_COLOR: '#000',          // 实体标签文字颜色
  ENTITY_FONT: 'bold 14px monospace',  // 实体标签字体
  OBSTACLE_FONT: 'bold 12px monospace',// 障碍物标签字体
  OBSTACLE_LABEL_COLOR: '#ffffff',     // 障碍物标签文字颜色
};

// ============================================================
//  颜色常量
// ============================================================
export const COLOR = {
  BG:        '#1a1a2e',  // 探索背景色
  GRID:      '#2a2a4a',  // 网格线颜色
  PLAYER:    '#00ff88',  // 玩家颜色
  MONSTER:   '#ff4444',  // 怪物默认颜色（兜底）
  TEXT:      '#ffffff',  // 文字颜色
  HP_BAR:    '#ff4444',  // 血条颜色
  HP_BG:     '#333333',  // 血条背景
  BATTLE_BG: '#2a1a1a',  // 战斗模式背景色
  SHIELD:    '#44aaff',  // 防御指示器颜色
};

// 技能定义
export const SKILLS = {
  HEAVY_STRIKE: { name: '重击',   mp: 5,  multiplier: 1.8, key: 'q' },
  SHIELD:       { name: '护盾',   mp: 8,  turns: 2,         key: 'e' },
  DRAIN:        { name: '吸血',   mp: 10, drainRate: 0.5,   key: 'r' },
};

// ============================================================
//  地牢楼层系统
// ============================================================
export const TOTAL_FLOORS = 8;

export const FLOORS = {
  1: {
    name: '森林',
    nameEn: 'Forest',
    bg: '#1a3a1a',
    monsterPool: ['GOBLIN', 'GIANT_RAT', 'SLIME'],
    obstacleTheme: 'forest',
    dropRateBonus: 0,
  },
  2: {
    name: '洞穴',
    nameEn: 'Cave',
    bg: '#1a1a2e',
    monsterPool: ['SKELETON', 'SLIME', 'SHADOW'],
    obstacleTheme: 'cave',
    dropRateBonus: 0.05,
  },
  3: {
    name: '遗迹',
    nameEn: 'Ruins',
    bg: '#2a1a1a',
    monsterPool: ['SHADOW', 'SKELETON', 'GOBLIN'],
    obstacleTheme: 'ruins',
    dropRateBonus: 0.10,
  },
  4: {
    name: '龙巢',
    nameEn: 'Dragon Lair',
    bg: '#3a1a1a',
    isBoss: true,
    bossKey: 'ANCIENT_DRAGON',
    obstacleTheme: 'ruins',
    dropRateBonus: 0,
  },
  5: {
    name: '深渊',
    nameEn: 'Depths',
    bg: '#1a1a3a',
    monsterPool: ['SKELETON', 'SHADOW', 'GOBLIN'],
    obstacleTheme: 'cave',
    dropRateBonus: 0.15,
  },
  6: {
    name: '恶魔殿堂',
    nameEn: 'Demon Hall',
    bg: '#3a1a2a',
    isBoss: true,
    bossKey: 'DEMON_LORD',
    obstacleTheme: 'ruins',
    dropRateBonus: 0,
  },
  7: {
    name: '地狱边境',
    nameEn: 'Hell Border',
    bg: '#2a1a1a',
    monsterPool: ['SHADOW', 'SKELETON', 'SLIME'],
    obstacleTheme: 'ruins',
    dropRateBonus: 0.20,
  },
  8: {
    name: '亡灵圣殿',
    nameEn: 'Necropolis',
    bg: '#1a2a1a',
    isBoss: true,
    bossKey: 'NECROMANCER',
    obstacleTheme: 'forest',
    dropRateBonus: 0,
  },
};

export const FLOOR_HP_SCALE = 0.15;    // 每层怪物HP增加比例
export const FLOOR_ATK_SCALE = 0.10;   // 每层怪物攻击增加比例

// 楼梯渲染
export const STAIRS_COLOR = '#ffdd00';
export const STAIRS_LOCKED_COLOR = '#cc3333';
export const STAIRS_LABEL = '>';
export const STAIRS_LOCKED_LABEL = 'X';

// 每层需击杀怪物数
export const FLOOR_MONSTER_COUNT = {
  1: 2,
  2: 3,
  3: 3,
  4: 0, // Boss层
  5: 3,
  6: 0, // Boss层
  7: 4,
  8: 0, // Boss层
};

// 清层奖励
export const FLOOR_CLEAR_HP_PCT = 0.20;     // 恢复20%最大HP
export const FLOOR_CLEAR_MP_PCT = 0.30;     // 恢复30%最大MP
export const FLOOR_CLEAR_EXP_PER_FLOOR = 20; // 每层20 EXP

// ============================================================
//  Boss系统
// ============================================================
export const BOSS_TYPES = {
  ANCIENT_DRAGON: {
    bossKey: 'ANCIENT_DRAGON',
    name: '远古巨龙',
    hp: 300, maxHp: 300,
    attackMin: 15, attackMax: 30,
    color: '#ff2200', exp: 200,
    skills: [
      { type: 'damage', name: '火焰吐息', damage: 40, rate: 0.30 },
      { type: 'defend', name: '龙鳞防御', rate: 0.25 },
    ],
    enrageThreshold: 0.5, enrageAtkBonus: 10,
  },
  DEMON_LORD: {
    bossKey: 'DEMON_LORD',
    name: '恶魔领主',
    hp: 400, maxHp: 400,
    attackMin: 20, attackMax: 35,
    color: '#8b00ff', exp: 350,
    skills: [
      { type: 'damage', name: '暗影箭', damage: 50, rate: 0.25 },
      { type: 'heal', name: '生命吸取', healAmount: 40, rate: 0.20 },
    ],
    enrageThreshold: 0.3, enrageAtkBonus: 15,
  },
  NECROMANCER: {
    bossKey: 'NECROMANCER',
    name: '亡灵法师',
    hp: 250, maxHp: 250,
    attackMin: 25, attackMax: 40,
    color: '#44cc44', exp: 400,
    skills: [
      { type: 'damage', name: '死亡凋零', damage: 35, rate: 0.35 },
      { type: 'defend', name: '骨盾', rate: 0.30 },
    ],
    enrageThreshold: 0.4, enrageAtkBonus: 20,
  },
};

// ============================================================
//  障碍物主题 → 颜色覆盖
// ============================================================
export const OBSTACLE_THEME = {
  forest: { rock: '#888888', tree: '#228833' },
  cave:   { rock: '#777799', tree: '#887744' },
  ruins:  { rock: '#998866', tree: '#665544' },
};

// 游戏阶段枚举（Phase 7: 新增 CAMP）
export const GAME_PHASE = {
  CAMP:         'camp',
  EXPLORATION:  'exploration',
  BATTLE:       'battle',
  GAME_OVER:    'game_over',
  VICTORY:      'victory',
};

// ============================================================
//  Phase 7: 金币掉落配置
// ============================================================
export const GOLD_DROPS = {
  GOBLIN:     { min: 5,  max: 10  },
  SKELETON:   { min: 10, max: 20  },
  SLIME:      { min: 8,  max: 15  },
  SHADOW:     { min: 20, max: 35  },
  GIANT_RAT:  { min: 3,  max: 8   },
  ANCIENT_DRAGON: { min: 100, max: 200 },
  DEMON_LORD:      { min: 150, max: 280 },
  NECROMANCER:     { min: 180, max: 300 },
};

// ============================================================
//  Phase 7: 营地配置
// ============================================================
export const CAMP_HP_RESTORE = 999;   // 营火回满
export const CAMP_MP_RESTORE = 999;

// ============================================================
//  Phase 7: 商店配置
// ============================================================
export const SHOP_ITEMS = {
  SMALL_POTION:   { name: 'HP Potion',   itemKey: 'SMALL_POTION',   price: 20 },
  MP_POTION:      { name: 'MP Potion',   itemKey: 'MP_POTION',      price: 25 },
  ATTACK_SCROLL:  { name: 'Attack Scroll', itemKey: 'ATTACK_SCROLL', price: 40 },
  DEFENSE_SCROLL: { name: 'Defense Scroll', itemKey: 'DEFENSE_SCROLL', price: 30 },
  SMALL_BAG:      { name: 'Small Bag (+5)',  price: 100, bagUpgrade: 5  },
  LARGE_BAG:      { name: 'Large Bag (+10)', price: 200, bagUpgrade: 10 },
};

// ============================================================
//  Phase 8: 装备系统
// ============================================================
export const EQUIPMENT_TYPES = {
  // 武器
  WOODEN_SWORD: {
    itemKey: 'WOODEN_SWORD', name: '木剑', slot: 'weapon',
    bonus: { attackMin: 3, attackMax: 3 },
    price: 80,
  },
  IRON_SWORD: {
    itemKey: 'IRON_SWORD', name: '铁剑', slot: 'weapon',
    bonus: { attackMin: 6, attackMax: 6 },
    price: 200,
  },
  // 防具
  LEATHER_ARMOR: {
    itemKey: 'LEATHER_ARMOR', name: '皮甲', slot: 'armor',
    bonus: { defense: 3, maxHp: 20 },
    price: 100,
  },
  IRON_ARMOR: {
    itemKey: 'IRON_ARMOR', name: '铁甲', slot: 'armor',
    bonus: { defense: 5, maxHp: 40 },
    price: 250,
  },
  // 饰品
  RING_OF_POWER: {
    itemKey: 'RING_OF_POWER', name: '力量之戒', slot: 'accessory',
    bonus: { strength: 3, agility: 2 },
    price: 150,
  },
  AMULET_OF_WISDOM: {
    itemKey: 'AMULET_OF_WISDOM', name: '智慧护符', slot: 'accessory',
    bonus: { maxMp: 15, defense: 2 },
    price: 180,
  },
  // Boss专属掉落
  DRAGON_SCALE: {
    itemKey: 'DRAGON_SCALE', name: '龙鳞甲', slot: 'armor',
    bonus: { defense: 8, maxHp: 60 },
    price: 0, bossDrop: 'ANCIENT_DRAGON',
  },
  DEMON_HORN: {
    itemKey: 'DEMON_HORN', name: '恶魔之角', slot: 'accessory',
    bonus: { attackMin: 8, attackMax: 8, defense: -2 },
    price: 0, bossDrop: 'DEMON_LORD',
  },
  NECRO_STAFF: {
    itemKey: 'NECRO_STAFF', name: '亡灵法杖', slot: 'weapon',
    bonus: { attackMin: 4, attackMax: 12, maxMp: 10 },
    price: 0, bossDrop: 'NECROMANCER',
  },
};

// ============================================================
//  Phase 8: 成就系统
// ============================================================
export const ACHIEVEMENTS = {
  FIRST_KILL: {
    id: 'FIRST_KILL', name: '初次狩猎',
    desc: '击败第一只怪物',
  },
  BOSS_SLAYER: {
    id: 'BOSS_SLAYER', name: '屠龙者',
    desc: '击败远古巨龙',
  },
  GOLD_HOARDER: {
    id: 'GOLD_HOARDER', name: '守财奴',
    desc: '累计获得 500 金币',
  },
  FLOOR_MASTER: {
    id: 'FLOOR_MASTER', name: '楼层大师',
    desc: '解锁全部 8 层',
  },
  CENTURION: {
    id: 'CENTURION', name: '百人斩',
    desc: '击败 100 只怪物',
  },
  LEVEL_10: {
    id: 'LEVEL_10', name: '初出茅庐',
    desc: '达到 10 级',
  },
  RICH_EXPLORER: {
    id: 'RICH_EXPLORER', name: '富裕探险家',
    desc: '单次远征获得 200 金币',
  },
  DEMON_SLAYER: {
    id: 'DEMON_SLAYER', name: '恶魔猎手',
    desc: '击败恶魔领主',
  },
  NECRO_HUNTER: {
    id: 'NECRO_HUNTER', name: '亡灵克星',
    desc: '击败亡灵法师',
  },
};
