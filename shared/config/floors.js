// 地牢楼层系统（唯一配置源：shared/config/floors.js）
export const TOTAL_FLOORS = 12;

export const FLOORS = {
  1: {
    name: '森林', nameEn: 'Forest',
    bg: '#1a3a1a',
    monsterPool: ['GOBLIN', 'GIANT_RAT', 'SLIME'],
    obstacleTheme: 'forest',
    dropRateBonus: 0,
  },
  2: {
    name: '洞穴', nameEn: 'Cave',
    bg: '#1a1a2e',
    monsterPool: ['SKELETON', 'SLIME', 'SHADOW'],
    obstacleTheme: 'cave',
    dropRateBonus: 0.05,
  },
  3: {
    name: '遗迹', nameEn: 'Ruins',
    bg: '#2a1a1a',
    monsterPool: ['SHADOW', 'SKELETON', 'GOBLIN'],
    obstacleTheme: 'ruins',
    dropRateBonus: 0.10,
  },
  4: {
    name: '龙巢', nameEn: 'Dragon Lair',
    bg: '#3a1a1a',
    isBoss: true, bossKey: 'ANCIENT_DRAGON',
    obstacleTheme: 'lava',
    dropRateBonus: 0,
  },
  5: {
    name: '冰霜之地', nameEn: 'Frost Land',
    bg: '#1a2a3a',
    monsterPool: ['SKELETON', 'SHADOW', 'GOBLIN'],
    obstacleTheme: 'ice',
    dropRateBonus: 0.15,
  },
  6: {
    name: '恶魔殿堂', nameEn: 'Demon Hall',
    bg: '#3a1a2a',
    isBoss: true, bossKey: 'DEMON_LORD',
    obstacleTheme: 'lava',
    dropRateBonus: 0,
  },
  7: {
    name: '墓地', nameEn: 'Graveyard',
    bg: '#1a1a1e',
    monsterPool: ['SHADOW', 'SKELETON', 'SLIME'],
    obstacleTheme: 'graveyard',
    dropRateBonus: 0.20,
  },
  8: {
    name: '亡灵圣殿', nameEn: 'Necropolis',
    bg: '#1a2a1a',
    isBoss: true, bossKey: 'NECROMANCER',
    obstacleTheme: 'graveyard',
    dropRateBonus: 0,
  },
  9: {
    name: '虚空裂隙', nameEn: 'Void Rift',
    bg: '#0a0a14',
    monsterPool: ['SHADOW', 'SKELETON', 'SLIME'],
    obstacleTheme: 'void',
    dropRateBonus: 0.25,
  },
  10: {
    name: '暗影王座', nameEn: 'Shadow Throne',
    bg: '#1a0a2a',
    isBoss: true, bossKey: 'SHADOW_LORD',
    obstacleTheme: 'void',
    dropRateBonus: 0,
  },
  11: {
    name: '熔岩深渊', nameEn: 'Lava Depths',
    bg: '#3a1010',
    monsterPool: ['SHADOW', 'GOBLIN', 'GIANT_RAT'],
    obstacleTheme: 'lava',
    dropRateBonus: 0.28,
  },
  12: {
    name: '元素神殿', nameEn: 'Elemental Shrine',
    bg: '#3a2a1a',
    isBoss: true, bossKey: 'FIRE_ELEMENTAL',
    obstacleTheme: 'lava',
    dropRateBonus: 0,
  },
};

export const FLOOR_HP_SCALE = 0.15;
export const FLOOR_ATK_SCALE = 0.10;

export const FLOOR_MONSTER_COUNT = {
  1: 2, 2: 3, 3: 3, 4: 0, 5: 3, 6: 0,
  7: 4, 8: 0, 9: 4, 10: 0, 11: 4, 12: 0,
};

export const FLOOR_CLEAR_HP_PCT = 0.20;
export const FLOOR_CLEAR_MP_PCT = 0.30;
export const FLOOR_CLEAR_EXP_PER_FLOOR = 20;
