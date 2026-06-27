// 营地 Meta 升级系统（Phase 11）
export const META_UPGRADES = {
  storage: {
    key: 'storage',
    name: '仓库扩展',
    levels: [
      { level: 0, cost: 0,    effect: '基础存储', bonus: 0 },
      { level: 1, cost: 200,  effect: '背包容量 +5', bonus: 5 },
      { level: 2, cost: 500,  effect: '背包容量 +5', bonus: 5 },
      { level: 3, cost: 1000, effect: '背包容量 +10', bonus: 10 },
    ],
    maxLevel: 3,
  },
  blacksmith: {
    key: 'blacksmith',
    name: '铁匠铺',
    levels: [
      { level: 0, cost: 0,   effect: '基础装备可用', bonus: 0 },
      { level: 1, cost: 300, effect: '稀有装备上架', bonus: 1 },
      { level: 2, cost: 800, effect: '史诗装备上架', bonus: 2 },
    ],
    maxLevel: 2,
  },
  potionShop: {
    key: 'potionShop',
    name: '药剂店',
    levels: [
      { level: 0, cost: 0,   effect: '标准药水', bonus: 0 },
      { level: 1, cost: 150, effect: '药水价格 -20%', bonus: 20 },
      { level: 2, cost: 400, effect: '药水价格 -35%', bonus: 35 },
      { level: 3, cost: 700, effect: '药水价格 -50%', bonus: 50 },
    ],
    maxLevel: 3,
  },
  adventurerHall: {
    key: 'adventurerHall',
    name: '冒险者大厅',
    levels: [
      { level: 0, cost: 0,   effect: '无加成', bonus: 0 },
      { level: 1, cost: 250, effect: '远征开始 +10 HP', bonus: 10 },
      { level: 2, cost: 600, effect: '远征开始 +25 HP +5 MP', bonus: 25 },
      { level: 3, cost: 1200,effect: '远征开始 +50 HP +10 MP +2 STR', bonus: 50 },
    ],
    maxLevel: 3,
  },
};
