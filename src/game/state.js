import {
  GRID_SIZE, PLAYER_HP, GAME_PHASE,
  PLAYER_ATTACK_MIN, PLAYER_ATTACK_MAX,
  PLAYER_MP, PLAYER_STR, PLAYER_DEF, PLAYER_AGI,
  INVENTORY_BASE_SLOTS,
} from './constants';
import { loadGame } from './save/saveManager';
import { applySaveData } from './save/saveSchema';

/**
 * 创建初始游戏状态
 * 优先从 localStorage 加载存档，无存档时创建新游戏
 */
export function createInitialState() {
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

    // 背景色
    floorBg: '#1a1a2e',

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
  };

  // 尝试加载存档
  const saveData = loadGame();
  if (saveData) {
    applySaveData(state, saveData);
  }

  return state;
}
