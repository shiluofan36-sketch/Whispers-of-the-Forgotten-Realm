// 装备词缀定义：前缀 + 后缀
export const PREFIXES = {
  fiery: {
    name: '烈焰',
    bonus: { burnChance: 0.12, critDamageBonus: 0.15 },
    buildTags: ['FIRE'],
  },
  frozen: {
    name: '冰霜',
    bonus: { freezeChance: 0.10, defense: 2 },
    buildTags: ['FROST'],
  },
  heavy: {
    name: '沉重',
    bonus: { attackMin: 3, attackMax: 3, strength: 1 },
    buildTags: ['BERSERK'],
  },
  swift: {
    name: '迅捷',
    bonus: { agility: 4, dodgeRate: 0.06 },
    buildTags: ['CRIT'],
  },
  vampiric: {
    name: '吸血',
    bonus: { lifesteal: 0.10, healPower: 0.05 },
    buildTags: ['VAMPIRE'],
  },
  toxic: {
    name: '剧毒',
    bonus: { poisonChance: 0.15 },
    buildTags: ['POISON'],
  },
  guardian: {
    name: '守护',
    bonus: { defense: 3, maxHp: 20 },
    buildTags: ['TANK'],
  },
  sharp: {
    name: '锋利',
    bonus: { critRateBonus: 0.08, attackMin: 1, attackMax: 3 },
    buildTags: ['CRIT'],
  },
};

export const SUFFIXES = {
  ofPower: {
    name: '力量',
    bonus: { strength: 3 },
    buildTags: ['BERSERK'],
  },
  ofTheFox: {
    name: '狡狐',
    bonus: { agility: 3, dodgeRate: 0.04 },
    buildTags: ['CRIT'],
  },
  ofGiants: {
    name: '巨人',
    bonus: { maxHp: 25 },
    buildTags: ['TANK'],
  },
  ofVenom: {
    name: '毒液',
    bonus: { poisonChance: 0.10 },
    buildTags: ['POISON'],
  },
  ofFrost: {
    name: '冰霜',
    bonus: { freezeChance: 0.08 },
    buildTags: ['FROST'],
  },
  ofFlames: {
    name: '烈焰',
    bonus: { burnChance: 0.08, critDamageBonus: 0.10 },
    buildTags: ['FIRE'],
  },
  ofVampires: {
    name: '血族',
    bonus: { lifesteal: 0.06 },
    buildTags: ['VAMPIRE'],
  },
  ofThorns: {
    name: '荆棘',
    bonus: { thorns: 6 },
    buildTags: ['TANK'],
  },
  ofTheOwl: {
    name: '夜枭',
    bonus: { critRateBonus: 0.05, healPower: 0.08 },
    buildTags: ['CRIT', 'VAMPIRE'],
  },
};
