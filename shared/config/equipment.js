// 装备类型（唯一配置源：shared/config/equipment.js）
export const EQUIPMENT_TYPES = {
  // 武器
  WOODEN_SWORD: {
    itemKey: 'WOODEN_SWORD', name: '木剑', slot: 'weapon', rarity: 'common',
    bonus: { attackMin: 3, attackMax: 3 },
    price: 80,
  },
  IRON_SWORD: {
    itemKey: 'IRON_SWORD', name: '铁剑', slot: 'weapon', rarity: 'rare',
    bonus: { attackMin: 6, attackMax: 6 },
    price: 200,
  },
  // 防具
  LEATHER_ARMOR: {
    itemKey: 'LEATHER_ARMOR', name: '皮甲', slot: 'armor', rarity: 'common',
    bonus: { defense: 3, maxHp: 20 },
    price: 100,
  },
  IRON_ARMOR: {
    itemKey: 'IRON_ARMOR', name: '铁甲', slot: 'armor', rarity: 'rare',
    bonus: { defense: 5, maxHp: 40 },
    price: 250,
  },
  // 饰品
  RING_OF_POWER: {
    itemKey: 'RING_OF_POWER', name: '力量之戒', slot: 'accessory', rarity: 'common',
    bonus: { strength: 3, agility: 2 },
    price: 150,
  },
  AMULET_OF_WISDOM: {
    itemKey: 'AMULET_OF_WISDOM', name: '智慧护符', slot: 'accessory', rarity: 'rare',
    bonus: { maxMp: 15, defense: 2 },
    price: 180,
  },
  // Build流派装备
  STEEL_PLATE: {
    itemKey: 'STEEL_PLATE', name: '钢板甲', slot: 'armor', rarity: 'rare',
    bonus: { defense: 8, maxHp: 30 },
    price: 300, build: 'warrior',
  },
  BERSERKER_AXE: {
    itemKey: 'BERSERKER_AXE', name: '狂战士斧', slot: 'weapon', rarity: 'rare',
    bonus: { attackMin: 10, attackMax: 10, defense: -2 },
    price: 280, build: 'warrior',
  },
  ASSASSIN_BLADE: {
    itemKey: 'ASSASSIN_BLADE', name: '刺客之刃', slot: 'weapon', rarity: 'rare',
    bonus: { attackMin: 5, attackMax: 12, agility: 5 },
    price: 280, build: 'crit',
  },
  SHADOW_BOOTS: {
    itemKey: 'SHADOW_BOOTS', name: '暗影之靴', slot: 'accessory', rarity: 'rare',
    bonus: { agility: 8, defense: 1 },
    price: 250, build: 'crit',
  },
  WIZARD_STAFF: {
    itemKey: 'WIZARD_STAFF', name: '法师之杖', slot: 'weapon', rarity: 'rare',
    bonus: { attackMin: 3, attackMax: 8, maxMp: 20, strength: 3 },
    price: 300, build: 'skill',
  },
  MANA_AMULET: {
    itemKey: 'MANA_AMULET', name: '魔力护符', slot: 'accessory', rarity: 'rare',
    bonus: { maxMp: 25, defense: 2 },
    price: 260, build: 'skill',
  },
  BLOOD_BLADE: {
    itemKey: 'BLOOD_BLADE', name: '吸血之刃', slot: 'weapon', rarity: 'epic',
    bonus: { attackMin: 8, attackMax: 14, maxHp: -15 },
    price: 400, build: 'drain',
  },
  VAMPIRE_CLOAK: {
    itemKey: 'VAMPIRE_CLOAK', name: '吸血鬼斗篷', slot: 'armor', rarity: 'epic',
    bonus: { defense: 4, agility: 4, maxHp: -10 },
    price: 350, build: 'drain',
  },
  // Boss专属掉落
  DRAGON_SCALE: {
    itemKey: 'DRAGON_SCALE', name: '龙鳞甲', slot: 'armor', rarity: 'epic',
    bonus: { defense: 8, maxHp: 60 },
    price: 0, bossDrop: 'ANCIENT_DRAGON',
  },
  DEMON_HORN: {
    itemKey: 'DEMON_HORN', name: '恶魔之角', slot: 'accessory', rarity: 'epic',
    bonus: { attackMin: 8, attackMax: 8, defense: -2 },
    price: 0, bossDrop: 'DEMON_LORD',
  },
  NECRO_STAFF: {
    itemKey: 'NECRO_STAFF', name: '亡灵法杖', slot: 'weapon', rarity: 'epic',
    bonus: { attackMin: 4, attackMax: 12, maxMp: 10 },
    price: 0, bossDrop: 'NECROMANCER',
  },
  SHADOW_CLOAK: {
    itemKey: 'SHADOW_CLOAK', name: '暗影斗篷', slot: 'armor', rarity: 'epic',
    bonus: { defense: 6, agility: 5, maxMp: 15 },
    price: 0, bossDrop: 'SHADOW_LORD',
  },
  FIRE_CROWN: {
    itemKey: 'FIRE_CROWN', name: '火焰王冠', slot: 'accessory', rarity: 'epic',
    bonus: { attackMin: 10, attackMax: 10, strength: 5 },
    price: 0, bossDrop: 'FIRE_ELEMENTAL',
  },
  // Phase 12: 传奇装备（Unique effects）
  ASHBRINGER: {
    itemKey: 'ASHBRINGER', name: '灰烬使者', slot: 'weapon', rarity: 'legendary',
    bonus: { attackMin: 12, attackMax: 18, burnChance: 0.25 },
    uniqueEffect: 'fireCrit', price: 0,
    desc: '暴击造成额外灼烧伤害',
  },
  SOUL_DRINKER: {
    itemKey: 'SOUL_DRINKER', name: '噬魂者', slot: 'weapon', rarity: 'legendary',
    bonus: { attackMin: 10, attackMax: 16, lifesteal: 0.15 },
    uniqueEffect: 'vampireBurst', price: 0,
    desc: '吸血超过生命上限时转化为临时护盾',
  },
  CROWN_OF_FROST: {
    itemKey: 'CROWN_OF_FROST', name: '冰霜之冠', slot: 'accessory', rarity: 'legendary',
    bonus: { freezeChance: 0.20, defense: 4, maxMp: 20 },
    uniqueEffect: 'freezeSpread', price: 0,
    desc: '冻结的敌人受到伤害时，冻结效果扩散',
  },
  DEATH_MANTLE: {
    itemKey: 'DEATH_MANTLE', name: '死亡披风', slot: 'armor', rarity: 'legendary',
    bonus: { defense: 5, thorns: 12, maxHp: 30 },
    uniqueEffect: 'deathThorns', price: 0,
    desc: '荆棘伤害翻倍，受到致命伤时保留1HP（每场战斗一次）',
  },
  SAGE_STONE: {
    itemKey: 'SAGE_STONE', name: '贤者之石', slot: 'accessory', rarity: 'legendary',
    bonus: { maxHp: 40, maxMp: 30, healPower: 0.30 },
    uniqueEffect: 'healOverflow', price: 0,
    desc: '过量治疗转化为MP恢复',
  },
};

// 道具类型
export const ITEM_TYPES = {
  SMALL_POTION:   { name: '小药水',   effect: 'heal',        value: 20, maxStack: 10 },
  MP_POTION:      { name: 'MP药水',   effect: 'mpHeal',      value: 15, maxStack: 10 },
  ATTACK_SCROLL:  { name: '攻击卷轴', effect: 'attackBuff',  value: 5,  maxStack: 5  },
  DEFENSE_SCROLL: { name: '防御卷轴', effect: 'defenseBuff', value: 1,  maxStack: 5  },
};

export const MAX_STACK = {
  SMALL_POTION: 10,
  MP_POTION: 10,
  ATTACK_SCROLL: 5,
  DEFENSE_SCROLL: 5,
  MATERIAL: 99,
};
