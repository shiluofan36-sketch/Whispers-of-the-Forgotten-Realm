import { SKILLS } from '../constants';
import { executeBattleTurn } from '../battle/battleEngine';
import { playerUseItem } from '../battle/playerActions';
import { canUseSkill } from '../skills';
import { getItem } from '../inventory/inventoryManager';
import { isActionAllowed } from '../tutorial/tutorialManager';

export function handleBattleAction(state, action) {
  // 教程步骤3：只允许基本攻击/防御/治疗
  if (state.tutorialStep === 3) {
    if (action === 'attack' && !isActionAllowed(state, 'battle_attack')) {
      state.battleLog.push('教官：「这一阶段只练习基本攻击、防御和治疗。」');
      return;
    }
    if (action === 'defend' && !isActionAllowed(state, 'battle_defend')) {
      state.battleLog.push('教官：「这一阶段只练习基本攻击、防御和治疗。」');
      return;
    }
    if (action === 'heal' && !isActionAllowed(state, 'battle_heal')) {
      state.battleLog.push('教官：「这一阶段只练习基本攻击、防御和治疗。」');
      return;
    }
  }

  executeBattleTurn(state, { type: 'action', action });
}

export function handleSkill(state, skillKey) {
  // 教程步骤3：禁止技能
  if (state.tutorialStep === 3) {
    state.battleLog.push('教官：「先学好基础，技能之后再用。」');
    return false;
  }
  // 教程步骤4：只允许 HEAVY_STRIKE (Q键)
  if (state.tutorialStep === 4) {
    if (skillKey !== 'HEAVY_STRIKE') {
      state.battleLog.push('教官：「试着按 Q 键使用重击技能。」');
      return false;
    }
  }

  if (!canUseSkill(state, skillKey)) {
    state.battleLog.push('MP不足！');
    return false;
  }
  executeBattleTurn(state, { type: 'skill', skillKey });
  return true;
}

export function handleUseItem(state, slot) {
  // 教程步骤3：禁止使用道具（先学基础）
  if (state.tutorialStep === 3) {
    state.battleLog.push('教官：「先练好基本功再考虑道具。」');
    return false;
  }

  const item = getItem(state, slot);
  if (!item) return false;
  playerUseItem(state, slot);
  return true;
}
