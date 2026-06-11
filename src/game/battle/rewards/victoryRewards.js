import { GAME_PHASE, POST_BATTLE_HEAL, MP_RESTORE, FLOORS } from '../../constants';
import { generateMonster } from '../../monsters';
import { scaleMonsterForFloor } from '../../dungeon/difficultyScaling';
import { onMonsterKilled } from '../../dungeon/floorProgression';
import { unlockNextFloor } from '../../expedition/expeditionManager';
import { advanceTutorialStep } from '../../tutorial/tutorialManager';

export function handleBossVictory(state, monster) {
  state.bossDefeated = true;
  state.gamePhase = GAME_PHASE.VICTORY;
  state.battleLog.push(`${monster.name}被击败！`);
  unlockNextFloor(state);
}

export function handlePostBattleRecovery(state) {
  const heal = Math.min(POST_BATTLE_HEAL, state.player.maxHp - state.player.hp);
  state.player.hp += heal;
  const mpRestore = Math.min(MP_RESTORE, state.player.maxMp - state.player.mp);
  state.player.mp += mpRestore;
  state.battleLog.push(`战斗胜利！恢复了${heal}HP, ${mpRestore}MP`);

  // 教程模式：不生成新怪物，改为推进教程步骤
  if (state.isTutorialFloor) {
    state.monster = null;
    advanceTutorialStep(state);
    return;
  }

  const floorConfig = FLOORS[state.currentFloor];
  const pool = floorConfig.monsterPool || null;
  state.monster = generateMonster(state.player, state.obstacles, pool);
  scaleMonsterForFloor(state.monster, state.currentFloor, state.ascensionLevel || 0);
}

export function checkFloorCleared(state) {
  onMonsterKilled(state);
  if (state.enemiesRemaining <= 0) {
    state.monster = null;
  }
  state.gamePhase = GAME_PHASE.EXPLORATION;
  return true;
}
