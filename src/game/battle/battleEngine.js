import { GAME_PHASE } from '../constants';
import { executePlayerBattleAction, executePlayerSkill } from './playerActions';
import { monsterAct } from './monsterAI';
import { grantBattleRewards, grantBattleDefeat } from './battleRewards';
import { executeBossAction } from '../boss/bossAI';
import { tickStatusEffects, checkFreezeBlock, triggerBleedOnAction } from '../statusEffects/statusManager';

/**
 * 开始战斗
 */
export function startBattle(state) {
  state.gamePhase = GAME_PHASE.BATTLE;
  state.battleLog = [];
  state.battleTurn = 1;
  state.player.isDefending = false;
  state.monster.isDefending = false;
  state.battleLog.push(`战斗开始！遭遇了${state.monster.name}！`);
}

/**
 * 执行一个完整的战斗回合
 * @param {object} state
 * @param {object} input - { type: 'action', action: 'attack'|'defend'|'heal' } 或 { type: 'skill', skillKey }
 */
export function executeBattleTurn(state, input) {
  if (state.gamePhase !== GAME_PHASE.BATTLE) return;

  // 0. 回合开始：玩家状态结算
  const playerStatusMsgs = tickStatusEffects(state, state.player, state.statusEffects, true);
  for (const msg of playerStatusMsgs) {
    state.battleLog.push(msg);
  }

  // 检查玩家是否因状态效果死亡
  if (state.player.hp <= 0) {
    grantBattleDefeat(state);
    return;
  }

  // 怪物状态结算
  if (state.monster) {
    const monsterMsgs = tickStatusEffects(state, state.monster, state.monster.statusEffects || [], false);
    for (const msg of monsterMsgs) {
      state.battleLog.push(msg);
    }
    // Phase 12: 精英再生
    if (state.monster.isElite && state.monster.eliteModifier?.regen) {
      const heal = Math.min(state.monster.eliteModifier.regen, state.monster.maxHp - state.monster.hp);
      if (heal > 0) {
        state.monster.hp += heal;
        state.battleLog.push(`${state.monster.name}恢复了${heal} HP`);
      }
    }
  }

  // 1. 玩家行动（冻结检查）
  const isFrozen = checkFreezeBlock(state.statusEffects);
  if (isFrozen) {
    state.battleLog.push('你被冻结了，无法行动！');
  } else {
    if (input.type === 'action') {
      executePlayerBattleAction(state, input.action);
    } else if (input.type === 'skill') {
      executePlayerSkill(state, input.skillKey);
    } else {
      return;
    }

    // 玩家行动后流血
    const bleedMsg = triggerBleedOnAction(state.player, state.statusEffects);
    if (bleedMsg) {
      state.battleLog.push(bleedMsg);
      if (state.player.hp <= 0) {
        grantBattleDefeat(state);
        return;
      }
    }
  }

  // 2. 检查怪物是否死亡
  if (state.monster.hp <= 0) {
    grantBattleRewards(state);
    return;
  }

  // 3. 怪物/Boss行动（怪物冻结检查）
  const monsterFrozen = checkFreezeBlock(state.monster.statusEffects || []);
  if (monsterFrozen) {
    state.battleLog.push(`${state.monster.name}被冻结了，无法行动！`);
  } else {
    if (state.isBossFloor && state.monster.bossKey) {
      executeBossAction(state);
    } else {
      monsterAct(state);
    }

    // 怪物行动后流血
    const monsterBleed = triggerBleedOnAction(state.monster, state.monster.statusEffects || []);
    if (monsterBleed) {
      state.battleLog.push(`${state.monster.name}${monsterBleed}`);
    }
  }

  // 4. 检查玩家是否死亡
  if (state.player.hp <= 0) {
    grantBattleDefeat(state);
  }
}
