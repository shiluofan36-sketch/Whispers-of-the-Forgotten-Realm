/**
 * 新手教程核心协调器
 * 职责：启动教程 / 步骤推进 / 教程楼层生成 / 操作权限检查
 */
import { GAME_PHASE, OBSTACLE_THEME } from '../constants';
import { hasWorldFlag, setWorldFlag } from '../world/worldFlags';
import { returnToCamp } from '../expedition/expeditionManager';
import { addItem } from '../inventory/inventoryManager';
import { lockStairs, unlockStairs } from '../dungeon/stairsSystem';
import { resetVisitedTiles, updateVisitedTiles } from '../renderer/fogOfWar';
import { autoSave } from '../save/saveManager';
import {
  TUTORIAL_STEPS, TUTORIAL_FLOOR_LAYOUTS,
  TUTORIAL_DUMMY, TUTORIAL_GOLEM_1, TUTORIAL_GOLEM_2,
  TUTORIAL_INSTRUCTOR_CONFIG, TUTORIAL_REWARDS,
  getTutorialStepMeta,
} from './tutorialData';

/**
 * 检测是否需要开始教程（在 createInitialState 末尾调用）
 */
export function startTutorialIfNeeded(state) {
  if (hasWorldFlag(state, 'tutorialCompleted')) return false;
  if (state.tutorialStep >= 13) return false;

  // 从存档恢复 -- 如果之前在地牢篇中途，重新生成对应教程楼层
  if (state.tutorialStep >= 1 && state.tutorialStep <= 6) {
    const floor = state.tutorialStep <= 2 ? 1 : state.tutorialStep <= 4 ? 2 : 3;
    generateTutorialFloor(state, floor);
    state.gamePhase = GAME_PHASE.EXPLORATION;
    return true;
  }

  // 全新开始
  state.tutorialStep = 1;
  state.isTutorialFloor = true;
  generateTutorialFloor(state, 1);
  state.gamePhase = GAME_PHASE.EXPLORATION;
  state.battleLog.push('教官·艾丹：「欢迎来到训练场！让我们从最基础的移动开始吧。」');
  return true;
}

/**
 * 教程步骤推进
 */
export function advanceTutorialStep(state) {
  state.tutorialStep += 1;

  switch (state.tutorialStep) {
    case 2:
      state.battleLog.push('教官：「很好！现在走向训练假人，接触它进入战斗。」');
      break;

    case 3:
      generateTutorialFloor(state, 2);
      state.gamePhase = GAME_PHASE.EXPLORATION;
      state.battleLog.push('教官：「不错！接下来学习基础战斗指令。」');
      break;

    case 4:
      respawnGolem2(state);
      state.gamePhase = GAME_PHASE.EXPLORATION;
      state.battleLog.push('教官：「药水已放入你的背包，试试道具和技能！」');
      break;

    case 5:
      generateTutorialFloor(state, 3);
      state.gamePhase = GAME_PHASE.EXPLORATION;
      state.battleLog.push('教官：「来吧！让我亲自测试你的综合实力！」');
      break;

    case 6:
      unlockStairs(state);
      state.stairsLocked = false;
      state.enemiesRemaining = 0;
      state.floorCleared = true;
      state.battleLog.push('教官：「干得漂亮！楼梯已解锁，走出来回到营地吧。」');
      break;

    case 7: {
      returnToCamp(state);
      state.player.gold += TUTORIAL_REWARDS.gold;
      const swordKey = TUTORIAL_REWARDS.sword.itemKey;
      addItem(state, swordKey, 1);
      for (const potionKey of TUTORIAL_REWARDS.potions) {
        addItem(state, potionKey, 1);
      }
      state.isTutorialFloor = false;
      state.battleLog.push(`获得 ${TUTORIAL_REWARDS.gold} Gold + 训练之剑 + 药水！`);
      state.pendingEvent = makePendingEvent(7);
      break;
    }

    case 8:
    case 9:
    case 10:
    case 11:
    case 12:
      state.pendingEvent = makePendingEvent(state.tutorialStep);
      break;

    case 13:
      completeTutorial(state);
      break;
  }

  autoSave(state, 'tutorial_progress');
}

/**
 * 教程完成
 */
export function completeTutorial(state) {
  setWorldFlag(state, 'tutorialCompleted');
  state.tutorialStep = 13;
  state.isTutorialFloor = false;
  state.pendingEvent = null;
  state.tutorialMarker = null;
  state.battleLog.push('训练完成！祝你好运，冒险者！');
  autoSave(state, 'tutorial_progress');
}

/**
 * 生成教程固定楼层
 */
export function generateTutorialFloor(state, floorNum) {
  const layout = TUTORIAL_FLOOR_LAYOUTS[floorNum];
  if (!layout) return;

  const theme = OBSTACLE_THEME[layout.obstacleTheme] || OBSTACLE_THEME.forest;

  state.currentFloor = 0;
  state.floorName = layout.name;
  state.isBossFloor = (floorNum === 3);
  state.floorBg = layout.bg;
  state.obstacleTheme = layout.obstacleTheme;
  state.stairs = null;
  state.stairsLocked = true;
  state.enemiesRemaining = 1;
  state.floorCleared = false;
  state.room = null;
  state.bossDefeated = false;
  state.isTutorialFloor = true;

  state.player.x = layout.playerStart.x;
  state.player.y = layout.playerStart.y;

  // 障碍物 -- 按主题着色
  state.obstacles = layout.obstacles.map(o => ({
    x: o.x, y: o.y, type: o.type,
    color: theme[o.type] || '#666666',
  }));

  // 怪物或Boss
  if (floorNum === 1) {
    state.monster = makeMonster(layout.dummy.x, layout.dummy.y, TUTORIAL_DUMMY);
  } else if (floorNum === 2) {
    state.monster = makeMonster(layout.golem1.x, layout.golem1.y, TUTORIAL_GOLEM_1);
  } else if (floorNum === 3) {
    state.monster = makeBoss(layout.boss.x, layout.boss.y);
  }

  // 楼梯
  if (layout.stairs) {
    state.stairs = { x: layout.stairs.x, y: layout.stairs.y };
    lockStairs(state);
  }

  // 步骤1的发光标记
  if (layout.marker) {
    state.tutorialMarker = { x: layout.marker.x, y: layout.marker.y };
  } else {
    state.tutorialMarker = null;
  }

  state.battleLog = [];
  state.gamePhase = GAME_PHASE.EXPLORATION;
  resetVisitedTiles(state);
  updateVisitedTiles(state);
  state.battleLog.push(`进入${layout.name}`);
}

/**
 * Floor 2 步骤4：生成强化石魔
 */
function respawnGolem2(state) {
  const layout = TUTORIAL_FLOOR_LAYOUTS[2];
  state.monster = makeMonster(layout.golem2.x, layout.golem2.y, TUTORIAL_GOLEM_2);
  state.enemiesRemaining = 1;
}

/**
 * 创建教程怪物实体
 */
function makeMonster(x, y, cfg) {
  return {
    x, y,
    hp: cfg.hp, maxHp: cfg.maxHp,
    name: cfg.name,
    attackMin: cfg.attackMin, attackMax: cfg.attackMax,
    attackRate: cfg.attackRate,
    color: cfg.color, exp: cfg.exp,
    isDefending: false,
    isTutorial: true,
    statusEffects: [],
    flashTimer: 0,
    isElite: false,
    eliteModifier: null,
  };
}

/**
 * 创建教程Boss
 */
function makeBoss(x, y) {
  const cfg = TUTORIAL_INSTRUCTOR_CONFIG;
  return {
    x, y,
    hp: cfg.hp, maxHp: cfg.maxHp,
    name: cfg.name,
    attackMin: cfg.attackMin, attackMax: cfg.attackMax,
    color: cfg.color, exp: cfg.exp,
    isDefending: false,
    bossKey: cfg.bossKey,
    config: cfg,
    enraged: false,
    isTutorial: true,
    statusEffects: [],
    flashTimer: 0,
    isElite: false,
    eliteModifier: null,
  };
}

/**
 * 检查操作在当前教程步骤中是否允许
 */
export function isActionAllowed(state, actionType) {
  const meta = getTutorialStepMeta(state.tutorialStep);
  if (!meta) return true;
  return meta.allowedActions.includes(actionType);
}

/**
 * 获取当前步骤引导文字
 */
export function getTutorialGuidance(state) {
  const meta = getTutorialStepMeta(state.tutorialStep);
  return meta ? meta.guidance : '';
}

export function isTutorialActive(state) {
  return state.tutorialStep >= 1 && state.tutorialStep <= 12;
}

export function isTutorialDungeonStep(state) {
  return state.tutorialStep >= 1 && state.tutorialStep <= 6;
}

// ============================================================
//  营地教程的 pendingEvent 对话
// ============================================================

function makePendingEvent(step) {
  const events = {
    7: {
      name: '营地指南 — 篝火休息',
      description: '欢迎回到营地！这是你在冒险途中的安全港湾。点击下方 [篝火休息] 按钮来恢复生命和魔法。',
      risk: '无风险',
      reward: '满血满蓝',
      onAccept: null, // replaced dynamically
      onDecline: null,
    },
    8: {
      name: '营地指南 — 商店购物',
      description: '打开 [商店]，购买一瓶小型生命药水。你有足够的金币来购买它。',
      risk: '花费 20 Gold',
      reward: '获得 1 瓶小型生命药水',
      onAccept: null,
      onDecline: null,
    },
    9: {
      name: '营地指南 — 装备武器',
      description: '教官赠予了你一把训练之剑。打开 [装备] 面板，把训练之剑装备到武器槽位。',
      risk: '无风险',
      reward: '攻击力 +2',
      onAccept: null,
      onDecline: null,
    },
    10: {
      name: '营地指南 — 仓库存取',
      description: '打开 [仓库]，把多余的物品存入仓库。仓库中的物品永久保存，即使死亡也不会丢失。',
      risk: '无风险',
      reward: '物品永久保存',
      onAccept: null,
      onDecline: null,
    },
    11: {
      name: '营地指南 — 地下城之门',
      description: '打开 [地下城之门]，查看已解锁的楼层。教程完成后，你将在这里选择楼层开始远征。',
      risk: '无风险',
      reward: '查看可挑战的楼层',
      onAccept: null,
      onDecline: null,
    },
    12: {
      name: '营地指南 — 开始冒险',
      description: '你已经准备好了！选择 Floor 1，开始你的第一次真正冒险吧！',
      risk: '进入地牢',
      reward: '真正的冒险开始',
      onAccept: null,
      onDecline: null,
    },
  };

  const evt = events[step];
  if (!evt) return null;

  return {
    ...evt,
    isTutorial: true,
    tutorialStep: step,
    onAccept: state => {
      state.pendingEvent = null;
    },
    onDecline: state => {
      state.pendingEvent = null;
    },
  };
}
