/**
 * 远征管理器
 * 职责：开始远征 / 返回营地结算 / 死亡惩罚
 */
import { GAME_PHASE, TOTAL_FLOORS } from '../constants';
import { generateFloor } from '../dungeon/floorGenerator';
import { saveGame, autoSave } from '../save/saveManager';
import { checkAchievements } from '../achievements/achievementManager';
import { applyMetaBonuses, revertMetaBonuses } from '../meta/metaManager';
import { pickRandomRelic, applyRelic, removeRelic } from '../relics/relicManager';

/**
 * 开始一次远征：生成选定楼层，切换进入探索模式
 */
export function startExpedition(state, floor) {
  if (floor < 1 || floor > state.unlockedFloors) return false;

  state.selectedFloor = floor;
  state.expeditionGold = 0;
  state.battleLog = [];

  generateFloor(state, floor);
  state.gamePhase = GAME_PHASE.EXPLORATION;

  // Phase 11: 应用 Meta 加成
  applyMetaBonuses(state);

  // Phase 12: 随机遗物
  const relic = pickRandomRelic();
  applyRelic(state, relic);

  state.battleLog.push(`远征开始！进入 Floor ${floor}`);
  return true;
}

/**
 * 成功返回营地：结算远征金币 + 自动存档
 */
export function returnToCamp(state) {
  // 远征金币转入永久账户
  const goldEarned = state.expeditionGold;

  if (state.expeditionGold > 0) {
    state.player.gold += state.expeditionGold;
    state.battleLog.push(`带回 ${state.expeditionGold} Gold！`);
    state.expeditionGold = 0;
  }

  // 清空临时战斗/探索状态
  state.monster = null;
  state.stairs = null;
  state.obstacles = [];
  state.isBossFloor = false;
  state.currentFloor = 0;
  state.floorName = '营地';
  state.floorBg = '#1a1a2e';
  state.floorCleared = false;
  state.battleLog = [];
  state.player.isDefending = false;
  state.statusEffects = [];

  state.gamePhase = GAME_PHASE.CAMP;
  state.selectedFloor = null;

  revertMetaBonuses(state);
  removeRelic(state);

  checkAchievements(state, { type: 'return_camp', expeditionGold: goldEarned });
  autoSave(state, 'return_camp');
}

/**
 * 死亡惩罚：丢失远征金币 + 背包内容，保留成长和仓库
 */
export function handleDeath(state) {
  state.battleLog.push(`失去了 ${state.expeditionGold} Gold...`);
  state.expeditionGold = 0;
  state.inventory = [];

  // 保留 HP 为 1（避免营地回血显示异常）
  state.player.hp = 1;

  // 清空临时状态
  state.monster = null;
  state.stairs = null;
  state.obstacles = [];
  state.isBossFloor = false;
  state.currentFloor = 0;
  state.floorName = '营地';
  state.floorBg = '#1a1a2e';
  state.floorCleared = false;
  state.battleLog = [];
  state.player.isDefending = false;
  state.player.attackBuff = 0;
  state.player.defenseBuff = 0;
  state.player.shieldTurns = 0;
  state.statusEffects = [];

  state.gamePhase = GAME_PHASE.CAMP;
  state.selectedFloor = null;

  revertMetaBonuses(state);
  removeRelic(state);

  autoSave(state, 'death');
}

/**
 * 解锁新楼层（清层后调用）
 */
export function unlockNextFloor(state) {
  const next = state.currentFloor + 1;
  if (next > state.unlockedFloors && next <= TOTAL_FLOORS) {
    state.unlockedFloors = next;
    state.battleLog.push(`解锁新楼层：Floor ${next}！`);
    checkAchievements(state, { type: 'floor_unlock' });
    autoSave(state, 'floor_unlock');
  }
}
