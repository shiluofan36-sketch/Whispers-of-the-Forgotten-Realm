// 营地配置（唯一配置源：shared/config/camp.js）
export const CAMP_HP_RESTORE = 999;
export const CAMP_MP_RESTORE = 999;

export const SHOP_ITEMS = {
  SMALL_POTION:   { name: 'HP Potion',   itemKey: 'SMALL_POTION',   price: 20 },
  MP_POTION:      { name: 'MP Potion',   itemKey: 'MP_POTION',      price: 25 },
  ATTACK_SCROLL:  { name: 'Attack Scroll', itemKey: 'ATTACK_SCROLL', price: 40 },
  DEFENSE_SCROLL: { name: 'Defense Scroll', itemKey: 'DEFENSE_SCROLL', price: 30 },
  SMALL_BAG:      { name: 'Small Bag (+5)',  price: 100, bagUpgrade: 5  },
  LARGE_BAG:      { name: 'Large Bag (+10)', price: 200, bagUpgrade: 10 },
};
