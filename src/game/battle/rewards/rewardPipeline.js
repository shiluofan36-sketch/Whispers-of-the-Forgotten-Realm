import { GAME_PHASE } from '../../constants';
import { grantGoldReward } from './goldRewards';
import { grantLootRewards } from './lootRewards';
import { handleBossVictory, handlePostBattleRecovery } from './victoryRewards';
import { addExp } from '../../level';
import { clearBuffs } from '../battleEffects';
import { tryTriggerEvent } from '../../events/randomEvents';
import { playSfx } from '../../audio/audioManager';
import { onMonsterKilled } from '../../dungeon/floorProgression';
import { emit } from '../../eventBus/gameEvents';
import { playDeathAnim } from '../../animation/animationManager';

export function runRewardPipeline(state) {
  const { monster } = state;

  state.monstersDefeated += 1;
  state.battleLog.push(`${monster.name}被击败！`);
  playSfx('death');

  // ★ 事件总线：击杀事件
  if (monster.bossKey) {
    emit(state, 'boss_killed', { bossKey: monster.bossKey });
  } else {
    emit(state, 'monster_killed', { typeKey: monster.typeKey });
  }

  // 金币
  grantGoldReward(state, monster);

  // 掉落（道具+装备）
  grantLootRewards(state, monster);

  // 随机事件（非Boss，教程期间跳过）
  if (!monster.bossKey && !state.isTutorialFloor) {
    tryTriggerEvent(state);
  }

  // EXP
  addExp(state, monster.exp);

  // Phase 15: 遗物击杀效果（如瘟疫之种）
  if (state.currentRelic?.onKill) {
    state.currentRelic.onKill(state);
  }

  // 清除战斗buff
  clearBuffs(state);

  // Boss层：胜利
  if (state.isBossFloor) {
    handleBossVictory(state, monster);
    return true;
  }

  // 清层计数（教程模式跳过 -- 由 handlePostBattleRecovery 接管）
  if (!state.isTutorialFloor) {
    onMonsterKilled(state);
  }

  // Phase 13: 死亡动画 — 延迟切换阶段
  state.monster.pendingDeath = true;
  state.monster.deathAnimComplete = false;
  playDeathAnim(state.monster);

  // 保持战斗阶段直到死亡动画结束（updateEffects 中处理）
  // 防止在此期间调用 startExpedition 导致状态竞争
  state.gamePhase = GAME_PHASE.BATTLE;

  return true;
}
