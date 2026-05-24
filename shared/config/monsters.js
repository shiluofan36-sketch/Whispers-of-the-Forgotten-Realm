// 怪物类型（唯一配置源：shared/config/monsters.js）
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

// 精英怪词缀
export const ELITE_MODIFIERS = {
  BERSERK: {
    key: 'BERSERK', name: '狂暴',
    hpMult: 1.5, atkMult: 1.5, defMult: 0.8,
    color: '#ff4444', onAttack: null,
  },
  VENOMOUS: {
    key: 'VENOMOUS', name: '剧毒',
    hpMult: 1.3, atkMult: 1.2, defMult: 1.0,
    color: '#88ff44', onAttack: 'poison',
  },
  SWIFT: {
    key: 'SWIFT', name: '迅捷',
    hpMult: 1.2, atkMult: 1.3, defMult: 0.9,
    color: '#ffdd00', onAttack: null, critBonus: 0.15,
  },
  IRON: {
    key: 'IRON', name: '钢铁',
    hpMult: 1.8, atkMult: 1.1, defMult: 1.5,
    color: '#aaaaff', onAttack: null,
  },
  REFLECTIVE: {
    key: 'REFLECTIVE', name: '反射',
    hpMult: 1.4, atkMult: 0.9, defMult: 1.3,
    color: '#ff88ff', onAttack: null, thorns: 5,
  },
  REGENERATING: {
    key: 'REGENERATING', name: '再生',
    hpMult: 1.5, atkMult: 1.0, defMult: 1.0,
    color: '#88ff88', onAttack: null, regen: 8,
  },
  FROZEN_AURA: {
    key: 'FROZEN_AURA', name: '冰霜光环',
    hpMult: 1.3, atkMult: 1.1, defMult: 1.1,
    color: '#44ddff', onAttack: 'freeze',
  },
};

export const ELITE_CHANCE = 0.15;
export const ELITE_DROP_BONUS = 0.20;
export const ELITE_GOLD_MULT = 2.0;

// 金币掉落配置
export const GOLD_DROPS = {
  GOBLIN:          { min: 5,  max: 10  },
  SKELETON:        { min: 10, max: 20  },
  SLIME:           { min: 8,  max: 15  },
  SHADOW:          { min: 20, max: 35  },
  GIANT_RAT:       { min: 3,  max: 8   },
  ANCIENT_DRAGON:  { min: 100, max: 200 },
  DEMON_LORD:      { min: 150, max: 280 },
  NECROMANCER:     { min: 180, max: 300 },
  SHADOW_LORD:     { min: 250, max: 400 },
  FIRE_ELEMENTAL:  { min: 300, max: 500 },
};
