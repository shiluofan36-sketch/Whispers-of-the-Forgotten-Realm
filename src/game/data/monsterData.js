// 怪物类型（纯数据驱动，新增类型只需加配置）
export const MONSTER_TYPES = {
  GOBLIN: {
    name: '哥布林',
    hp: 30,  maxHp: 30,
    attackMin: 5,  attackMax: 15,
    attackRate: 0.8,
    color: '#ff6644',
    exp: 10,
  },
  SKELETON: {
    name: '骷髅兵',
    hp: 50,  maxHp: 50,
    attackMin: 4,  attackMax: 10,
    attackRate: 0.5,
    color: '#dddddd',
    exp: 20,
  },
  SLIME: {
    name: '史莱姆',
    hp: 80,  maxHp: 80,
    attackMin: 2,  attackMax: 6,
    attackRate: 0.4,
    color: '#44cc44',
    exp: 30,
  },
  SHADOW: {
    name: '暗影',
    hp: 25,  maxHp: 25,
    attackMin: 8,  attackMax: 18,
    attackRate: 0.85,
    color: '#bb44ff',
    exp: 40,
  },
  GIANT_RAT: {
    name: '巨鼠',
    hp: 35,  maxHp: 35,
    attackMin: 5,  attackMax: 12,
    attackRate: 0.65,
    color: '#bb8844',
    exp: 15,
  },
};

// Boss类型
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
  SHADOW_LORD: {
    bossKey: 'SHADOW_LORD',
    name: '暗影领主',
    hp: 500, maxHp: 500,
    attackMin: 25, attackMax: 40,
    color: '#6600cc', exp: 500,
    skills: [
      { type: 'damage', name: '暗影风暴', damage: 55, rate: 0.30 },
      { type: 'heal', name: '暗影汲取', healAmount: 50, rate: 0.20 },
      { type: 'defend', name: '暗影帷幕', rate: 0.20 },
    ],
    enrageThreshold: 0.35, enrageAtkBonus: 18,
  },
  FIRE_ELEMENTAL: {
    bossKey: 'FIRE_ELEMENTAL',
    name: '火焰元素',
    hp: 600, maxHp: 600,
    attackMin: 30, attackMax: 50,
    color: '#ff6600', exp: 600,
    skills: [
      { type: 'damage', name: '烈焰风暴', damage: 60, rate: 0.35 },
      { type: 'damage', name: '熔岩喷发', damage: 45, rate: 0.25 },
      { type: 'defend', name: '火焰护盾', rate: 0.20 },
    ],
    enrageThreshold: 0.30, enrageAtkBonus: 22,
  },
};

// 金币掉落配置
export const GOLD_DROPS = {
  GOBLIN:     { min: 5,  max: 10  },
  SKELETON:   { min: 10, max: 20  },
  SLIME:      { min: 8,  max: 15  },
  SHADOW:     { min: 20, max: 35  },
  GIANT_RAT:  { min: 3,  max: 8   },
  ANCIENT_DRAGON: { min: 100, max: 200 },
  DEMON_LORD:      { min: 150, max: 280 },
  NECROMANCER:     { min: 180, max: 300 },
  SHADOW_LORD:     { min: 250, max: 400 },
  FIRE_ELEMENTAL:  { min: 300, max: 500 },
};
