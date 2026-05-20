import { GAME_PHASE } from '../constants';
import { executePlayerBattleAction, executePlayerSkill } from './playerActions';
import { monsterAct } from './monsterAI';
import { grantBattleRewards, grantBattleDefeat } from './battleRewards';
import { executeBossAction } from '../boss/bossAI';

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

  // 1. 玩家行动
  if (input.type === 'action') {
    executePlayerBattleAction(state, input.action);
  } else if (input.type === 'skill') {
    executePlayerSkill(state, input.skillKey);
  } else {
    return;
  }

  // 2. 检查怪物是否死亡
  if (state.monster.hp <= 0) {
    grantBattleRewards(state);
    return;
  }

  // 3. 怪物/Boss行动
  if (state.isBossFloor && state.monster.bossKey) {
    executeBossAction(state);
  } else {
    monsterAct(state);
  }

  // 4. 检查玩家是否死亡
  if (state.player.hp <= 0) {
    grantBattleDefeat(state);
  }
}
