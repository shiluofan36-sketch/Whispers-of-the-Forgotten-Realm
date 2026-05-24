import { GAME_PHASE } from '../constants';
import { runRewardPipeline } from './rewards/rewardPipeline';

export function grantBattleRewards(state) {
  return runRewardPipeline(state);
}

export function grantBattleDefeat(state) {
  state.player.hp = 0;
  state.gamePhase = GAME_PHASE.GAME_OVER;
  state.battleLog.push('你被击败了...');
  return true;
}
