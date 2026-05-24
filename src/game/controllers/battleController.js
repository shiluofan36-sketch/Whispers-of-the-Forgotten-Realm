import { SKILLS } from '../constants';
import { executeBattleTurn } from '../battle/battleEngine';
import { playerUseItem } from '../battle/playerActions';
import { canUseSkill } from '../skills';
import { getItem } from '../inventory/inventoryManager';

export function handleBattleAction(state, action) {
  executeBattleTurn(state, { type: 'action', action });
}

export function handleSkill(state, skillKey) {
  if (!canUseSkill(state, skillKey)) {
    state.battleLog.push('MP不足！');
    return false;
  }
  executeBattleTurn(state, { type: 'skill', skillKey });
  return true;
}

export function handleUseItem(state, slot) {
  const item = getItem(state, slot);
  if (!item) return false;
  playerUseItem(state, slot);
  return true;
}
