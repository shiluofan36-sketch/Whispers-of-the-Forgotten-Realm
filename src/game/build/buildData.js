// Build 类型定义 + 协同效应
export const BUILD_TYPES = {
  FIRE: {
    key: 'FIRE',
    name: '烈焰',
    color: '#ff6600',
    stats: ['burnChance', 'critDamageBonus'],
    threshold: 0.10,  // 拥有此build的装备至少此比例才判定
  },
  FROST: {
    key: 'FROST',
    name: '冰霜',
    color: '#44ccff',
    stats: ['freezeChance', 'defense'],
    threshold: 0.08,
  },
  POISON: {
    key: 'POISON',
    name: '剧毒',
    color: '#88ff44',
    stats: ['poisonChance'],
    threshold: 0.08,
  },
  VAMPIRE: {
    key: 'VAMPIRE',
    name: '吸血',
    color: '#cc4444',
    stats: ['lifesteal', 'healPower'],
    threshold: 0.06,
  },
  CRIT: {
    key: 'CRIT',
    name: '暴击',
    color: '#ffdd00',
    stats: ['critRateBonus', 'agility'],
    threshold: 0.05,
  },
  TANK: {
    key: 'TANK',
    name: '坦克',
    color: '#aaaaff',
    stats: ['defense', 'maxHp', 'thorns'],
    threshold: 8,
  },
  BERSERK: {
    key: 'BERSERK',
    name: '狂战',
    color: '#ff4444',
    stats: ['strength', 'attackMin', 'attackMax'],
    threshold: 5,
  },
};

// 协同：拥有多个build时的奖励
export const BUILD_SYNERGIES = {
  'FIRE+CRIT': { name: '爆燃', bonus: { burnChance: 0.05, critDamageBonus: 0.10 } },
  'FROST+CRIT': { name: '碎冰', bonus: { critRateBonus: 0.05, freezeChance: 0.05 } },
  'POISON+VAMPIRE': { name: '血毒', bonus: { poisonChance: 0.05, lifesteal: 0.03 } },
  'TANK+VAMPIRE': { name: '不死', bonus: { maxHp: 15, lifesteal: 0.03 } },
  'FIRE+FROST': { name: '元素掌控', bonus: { burnChance: 0.05, freezeChance: 0.05 } },
  'BERSERK+CRIT': { name: '狂暴', bonus: { attackMin: 2, attackMax: 2, critRateBonus: 0.03 } },
  'POISON+TANK': { name: '腐蚀', bonus: { poisonChance: 0.05, thorns: 4 } },
};
