import { GAME_PHASE } from '../constants';
import { runRewardPipeline } from './rewards/rewardPipeline';

export function grantBattleRewards(state) {
  return runRewardPipeline(state);
}

export function grantBattleDefeat(state) {
  state.player.hp = 0;

  // Phase 15: 凤凰羽毛复活
  if (state.currentRelic?.revive) {
    const hpRestore = Math.floor(state.player.maxHp * 0.5);
    state.player.hp = hpRestore;
    state.currentRelic = null;
    state.battleLog.push(`[遗物] 凤凰羽毛生效！你恢复了 ${hpRestore} HP 并继续战斗。`);
    // 清除 buff（状态已重置），继续战斗
    return false; // 不进入死亡，继续战斗
  }

  state.gamePhase = GAME_PHASE.GAME_OVER;
  state.battleLog.push('你被击败了...');
  return true;
}
