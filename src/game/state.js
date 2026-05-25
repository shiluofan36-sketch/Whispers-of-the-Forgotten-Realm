import {
  GRID_SIZE, PLAYER_HP, GAME_PHASE,
  PLAYER_ATTACK_MIN, PLAYER_ATTACK_MAX,
  PLAYER_MP, PLAYER_STR, PLAYER_DEF, PLAYER_AGI,
  INVENTORY_BASE_SLOTS,
} from './constants';
import { loadGame } from './save/saveManager';
import { applySaveData } from './save/saveSchema';
import { on } from './eventBus/gameEvents';
import { checkAchievements } from './achievements/achievementManager';
import { setWorldFlag } from './world/worldFlags';
import { createParticleSystem } from './effects/particles/particleSystem';

// 注册全局事件监听（仅执行一次）
let listenersRegistered = false;
function registerEventListeners() {
  if (listenersRegistered) return;
  listenersRegistered = true;

  on('monster_killed', (state) => {
    checkAchievements(state, { type: 'monster_kill' });
  });

  on('boss_killed', (state, { bossKey }) => {
    checkAchievements(state, { type: 'boss_kill', bossKey });
    const flagMap = {
      ANCIENT_DRAGON: 'dragonSlain',
      DEMON_LORD: 'demonSlain',
      SHADOW_LORD: 'shadowSlain',
      FIRE_ELEMENTAL: 'fireElementalSlain',
      NECROMANCER: 'necromancerSlain',
    };
    if (flagMap[bossKey]) setWorldFlag(state, flagMap[bossKey]);
  });
}

/**
 * 创建初始游戏状态
 * 优先从 localStorage 加载存档，无存档时创建新游戏
 */
export function createInitialState() {
  registerEventListeners();

  // 基础状态（新游戏默认值）
  const state = {
    // 玩家数据
    player: {
      x: Math.floor(GRID_SIZE / 2),
      y: Math.floor(GRID_SIZE / 2),
      hp: PLAYER_HP,
      maxHp: PLAYER_HP,
      isDefending: false,
      attackBuff: 0,
      defenseBuff: 0,
      level: 1,
      exp: 0,
      attackMin: PLAYER_ATTACK_MIN,
      attackMax: PLAYER_ATTACK_MAX,
      strength: PLAYER_STR,
      defense: PLAYER_DEF,
      agility: PLAYER_AGI,
      mp: PLAYER_MP,
      maxMp: PLAYER_MP,
      shieldTurns: 0,
      // Phase 12: 装备词缀bonus属性
      critRateBonus: 0,
      critDamageBonus: 0,
      lifesteal: 0,
      poisonChance: 0,
      burnChance: 0,
      freezeChance: 0,
      dodgeRate: 0,
      thorns: 0,
      healPower: 0,
      gold: 0,                         // Phase 7: 永久金币
      equipment: {                     // Phase 8: 装备槽位
        weapon: null,
        armor: null,
        accessory: null,
      },
    },

    // 怪物数据
    monster: null,

    // 回合数据
    turn: 0,
    battleTurn: 0,

    // 战斗日志
    battleLog: [],

    // 游戏阶段（默认营地）
    gamePhase: GAME_PHASE.CAMP,

    // 击败怪物计数
    monstersDefeated: 0,

    // 背包（Phase 7: 改为 [{itemKey, quantity}] 格式）
    inventory: [],

    // 障碍物
    obstacles: [],

    // 地牢楼层
    currentFloor: 0,
    floorName: '营地',
    isBossFloor: false,
    stairs: null,
    stairsLocked: false,
    enemiesRemaining: 0,
    bossDefeated: false,
    floorCleared: false,

    // 背景色 + 生物群落主题
    floorBg: '#1a1a2e',
    obstacleTheme: 'forest',

    // ============================================================
    //  Phase 7 新增字段
    // ============================================================

    // 金钱系统
    expeditionGold: 0,                 // 本次远征临时金币（死亡丢失）

    // 背包容量（可升级，初始10格）
    inventorySlots: INVENTORY_BASE_SLOTS,

    // 仓库（永久保存，无限容量）
    storage: [],

    // 已解锁最高楼层
    unlockedFloors: 1,

    // 当前远征选择的目标楼层
    selectedFloor: null,

    // Phase 8: 已解锁成就列表
    unlockedAchievements: [],

    // Phase 10: 战斗反馈
    floatingTexts: [],
    screenShake: { intensity: 0, duration: 0, timer: 0 },

    // Phase 10: 状态异常（玩家）
    statusEffects: [],

    // Phase 12: 技能冷却
    skillCooldowns: {},

    // Phase 10: Boss召唤小兵
    bossMinions: [],

    // Phase 11: 特殊房间（当前楼层）
    room: null,

    // Phase 11: 待处理的选择型事件
    pendingEvent: null,

    // Phase 11: 营地NPC列表（固定4人）
    npcs: ['blacksmith', 'merchant', 'hunter', 'scholar'],

    // Phase 11: 世界观碎片历史
    loreHistory: [],

    // Phase 11: 世界状态记忆（长期flag）
    worldFlags: {},

    // Phase 11: 营地Meta升级（持久化在player上）
    metaProgress: {
      storage: 0,
      blacksmith: 0,
      potionShop: 0,
      adventurerHall: 0,
    },

    // Phase 12: 难度等级
    ascensionLevel: 0,

    // Phase 12: 当前遗物（远征内有效）
    currentRelic: null,

    // Phase 13: 动画系统
    animation: {
      idlePhase: 0,
      hitStopTimer: 0,
      skillEffects: [],
      lootCard: null,
    },

    // Phase 14: 粒子系统
    particles: createParticleSystem(200),
  };

  // 尝试加载存档
  const saveData = loadGame();
  if (saveData) {
    applySaveData(state, saveData);
  }

  return state;
}
