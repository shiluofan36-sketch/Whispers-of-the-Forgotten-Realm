/**
 * 营地管理器
 * 职责：营地行为编排（营火 / 商店 / 仓库 / 地牢入口）
 */
import { CAMP_HP_RESTORE, CAMP_MP_RESTORE, GAME_PHASE } from '../constants';
import { autoSave } from '../save/saveManager';

/**
 * 营火回复：免费回满 HP 和 MP
 */
export function restAtCampfire(state) {
  const { player } = state;
  const hpHealed = player.maxHp - player.hp;
  const mpHealed = player.maxMp - player.mp;

  player.hp = player.maxHp;
  player.mp = player.maxMp;

  // 仅在实际恢复时才输出日志
  if (hpHealed > 0 || mpHealed > 0) {
    state.battleLog.push(`在营火旁休息，恢复了${hpHealed} HP, ${mpHealed} MP`);
  }
  autoSave(state, 'return_camp');
}

/**
 * 进入地牢（开始远征）
 * 由 expeditionManager.startExpedition 实际处理
 */
export function enterDungeon(state, floor) {
  if (floor < 1 || floor > state.unlockedFloors) return false;
  state.selectedFloor = floor;
  return true;
}
