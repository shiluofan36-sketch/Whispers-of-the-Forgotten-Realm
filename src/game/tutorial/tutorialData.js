/**
 * 新手教程静态配置
 * 包含：12步定义 / 3个固定楼层布局 / 教程Boss / 教程怪物
 */

// 12步教程定义（索引 0 占位，1-12 对应实际步骤）
export const TUTORIAL_STEPS = [
  null,
  {
    step: 1, chapter: 'dungeon', floor: 1,
    title: 'Step 1/12：移动训练',
    guidance: '使用 WASD 或方向键移动到金色发光标记处',
    allowedActions: ['move'],
    nextTrigger: 'reach_marker',
  },
  {
    step: 2, chapter: 'dungeon', floor: 1,
    title: 'Step 2/12：接触怪物',
    guidance: '走向训练假人，与之接触进入战斗',
    allowedActions: ['move'],
    nextTrigger: 'start_battle',
  },
  {
    step: 3, chapter: 'dungeon', floor: 2,
    title: 'Step 3/12：基础战斗',
    guidance: '尝试使用【攻击】【防御】【治疗】三个基础指令',
    allowedActions: ['battle_attack', 'battle_defend', 'battle_heal'],
    nextTrigger: 'defeat_monster',
  },
  {
    step: 4, chapter: 'dungeon', floor: 2,
    title: 'Step 4/12：道具与技能',
    guidance: '按【1】使用道具，按【Q】释放重击技能',
    allowedActions: ['battle_attack', 'battle_defend', 'battle_heal', 'battle_skill_Q', 'use_item'],
    nextTrigger: 'defeat_monster',
  },
  {
    step: 5, chapter: 'dungeon', floor: 3,
    title: 'Step 5/12：综合试炼',
    guidance: '教官亲自下场！综合运用所有学到的技巧',
    allowedActions: ['battle_attack', 'battle_defend', 'battle_heal', 'battle_skill_all', 'use_item'],
    nextTrigger: 'defeat_boss',
  },
  {
    step: 6, chapter: 'dungeon', floor: 3,
    title: 'Step 6/12：进入营地',
    guidance: '击败教官后楼梯已解锁，走向楼梯',
    allowedActions: ['move'],
    nextTrigger: 'reach_stairs',
  },
  {
    step: 7, chapter: 'camp', floor: null,
    title: 'Step 7/12：篝火休息',
    guidance: '欢迎回到营地！首先在篝火旁休息，恢复生命和魔法',
    allowedActions: ['camp_campfire'],
    nextTrigger: 'campfire',
  },
  {
    step: 8, chapter: 'camp', floor: null,
    title: 'Step 8/12：商店购物',
    guidance: '去商店购买一瓶小型生命药水（20G）',
    allowedActions: ['camp_shop_buy'],
    nextTrigger: 'shop_buy',
  },
  {
    step: 9, chapter: 'camp', floor: null,
    title: 'Step 9/12：装备武器',
    guidance: '打开装备面板，把教官赠予的训练之剑装备上',
    allowedActions: ['camp_equip'],
    nextTrigger: 'equip',
  },
  {
    step: 10, chapter: 'camp', floor: null,
    title: 'Step 10/12：仓库存取',
    guidance: '打开仓库，把多余的物品存入仓库中（仓库物品死亡不会丢失）',
    allowedActions: ['camp_storage_deposit'],
    nextTrigger: 'storage_deposit',
  },
  {
    step: 11, chapter: 'camp', floor: null,
    title: 'Step 11/12：查看地下城',
    guidance: '打开地下城之门，查看可挑战的楼层',
    allowedActions: ['camp_floor_select'],
    nextTrigger: 'view_floor_select',
  },
  {
    step: 12, chapter: 'camp', floor: null,
    title: 'Step 12/12：开始冒险',
    guidance: '你已经准备好了！选择 Floor 1，开始真正的冒险吧',
    allowedActions: ['camp_start_expedition'],
    nextTrigger: 'start_expedition',
  },
];

// 3个教程固定楼层布局（10x10网格）
export const TUTORIAL_FLOOR_LAYOUTS = {
  1: {
    name: '训练森林',
    nameEn: 'Training Forest',
    bg: '#1a3a1a',
    obstacleTheme: 'forest',
    playerStart: { x: 5, y: 5 },
    obstacles: [
      { x: 2, y: 2, type: 'tree' },
      { x: 7, y: 3, type: 'rock' },
      { x: 3, y: 7, type: 'tree' },
    ],
    marker: { x: 7, y: 5 },
    dummy: { x: 8, y: 5 },
    stairs: null,
  },
  2: {
    name: '训练洞穴',
    nameEn: 'Training Cave',
    bg: '#1a1a2e',
    obstacleTheme: 'cave',
    playerStart: { x: 5, y: 5 },
    obstacles: [
      { x: 3, y: 2, type: 'rock' },
      { x: 6, y: 4, type: 'rock' },
      { x: 2, y: 6, type: 'rock' },
      { x: 7, y: 7, type: 'rock' },
    ],
    golem1: { x: 8, y: 5 },
    golem2: { x: 2, y: 8 },
    stairs: null,
  },
  3: {
    name: '训练竞技场',
    nameEn: 'Training Arena',
    bg: '#2a1a0a',
    obstacleTheme: 'lava',
    playerStart: { x: 5, y: 8 },
    obstacles: [],
    boss: { x: 5, y: 3 },
    stairs: { x: 5, y: 1 },
  },
};

// 训练假人（步骤1-2）
export const TUTORIAL_DUMMY = {
  name: '训练假人',
  hp: 20, maxHp: 20,
  attackMin: 2, attackMax: 4,
  attackRate: 0.3, color: '#888888', exp: 5,
  isTutorial: true,
};

// 训练石魔（步骤3）
export const TUTORIAL_GOLEM_1 = {
  name: '训练石魔',
  hp: 40, maxHp: 40,
  attackMin: 4, attackMax: 8,
  attackRate: 0.4, color: '#999999', exp: 10,
  isTutorial: true,
};

// 强化石魔（步骤4）
export const TUTORIAL_GOLEM_2 = {
  name: '强化石魔',
  hp: 60, maxHp: 60,
  attackMin: 6, attackMax: 12,
  attackRate: 0.5, color: '#bb8844', exp: 15,
  isTutorial: true,
};

// 教程Boss：教官·艾丹
export const TUTORIAL_INSTRUCTOR_CONFIG = {
  bossKey: 'TUTORIAL_INSTRUCTOR',
  name: '教官·艾丹',
  hp: 200, maxHp: 200,
  attackMin: 8, attackMax: 15,
  color: '#4499ff', exp: 50,
  skills: [
    { type: 'damage', name: '训练攻击', damage: 12, rate: 0.45 },
    { type: 'defend', name: '防御姿态', rate: 0.35 },
    { type: 'heal', name: '教官休整', amount: 30, rate: 0.10 },
  ],
  enrageThreshold: 0.3,
  enrageAtkBonus: 10,
  behavior: 'tutorial',
  isTutorial: true,
};

// 教程通关奖励
export const TUTORIAL_REWARDS = {
  gold: 200,
  sword: {
    itemKey: 'TUTORIAL_SWORD',
    name: '训练之剑',
    slot: 'weapon',
    rarity: 'common',
    bonus: { attackMin: 2, attackMax: 2 },
    price: 0,
  },
  potions: ['SMALL_POTION', 'SMALL_POTION', 'MP_POTION'],
};

// 获取当前步骤的配置
export function getTutorialStepMeta(step) {
  return TUTORIAL_STEPS[step] || null;
}
