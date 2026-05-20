// 道具类型
export const ITEM_TYPES = {
  SMALL_POTION:   { name: '小药水',   effect: 'heal',        value: 20, maxStack: 10 },
  MP_POTION:      { name: 'MP药水',   effect: 'mpHeal',      value: 15, maxStack: 10 },
  ATTACK_SCROLL:  { name: '攻击卷轴', effect: 'attackBuff',  value: 5,  maxStack: 5  },
  DEFENSE_SCROLL: { name: '防御卷轴', effect: 'defenseBuff', value: 1,  maxStack: 5  },
};

// 物品最大堆叠数
export const MAX_STACK = {
  SMALL_POTION: 10,
  MP_POTION: 10,
  ATTACK_SCROLL: 5,
  DEFENSE_SCROLL: 5,
  MATERIAL: 99,
};

// 装备类型
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
  // Boss专属掉落 (epic)
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
};
