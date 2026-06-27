import { GAME_PHASE } from '../constants';
import { executePlayerBattleAction, executePlayerSkill } from './playerActions';
import { monsterAct } from './monsterAI';
import { grantBattleRewards, grantBattleDefeat } from './battleRewards';
import { executeBossAction } from '../boss/bossAI';
import { tickStatusEffects, checkFreezeBlock, triggerBleedOnAction } from '../statusEffects/statusManager';
import { DIR } from '../renderer/spriteDirections';
import { checkTutorialBossDefeated, resetTutorialBossState } from '../tutorial/tutorialBossAI';

/**
 * 开始战斗
 */
export function startBattle(state) {
  state.gamePhase = GAME_PHASE.BATTLE;
  state.battleLog = [];
  state.battleTurn = 1;
  state.player.isDefending = false;
  state.monster.isDefending = false;
  // 战斗朝向：玩家面朝右，怪物面朝左
  state.player.facing = DIR.RIGHT;
  state.monster.facing = DIR.LEFT;
  state.battleLog.push(`战斗开始！遭遇了${state.monster.name}！`);

  // 教程Boss：重置血量节点提示状态
  if (state.monster?.isTutorial && state.monster.bossKey) {
    resetTutorialBossState();
  }
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

  // 回合遗物效果（如每回合掉血）
  if (state.currentRelic?.onTurn) {
    state.currentRelic.onTurn(state);
  }

  // 检查玩家是否因状态效果死亡
  if (state.player.hp <= 0) {
    if (!grantBattleDefeat(state)) return; // 凤凰羽毛复活，不进入死亡
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

    // 检查怪物是否因状态效果死亡
    if (state.monster.hp <= 0) {
      if (state.monster.isTutorial) {
        if (state.monster.bossKey) {
          checkTutorialBossDefeated(state);
        } else {
          grantBattleRewards(state);
        }
      } else {
        grantBattleRewards(state);
      }
      return;
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
        if (!grantBattleDefeat(state)) return; // 凤凰羽毛复活
        return;
      }
    }
  }

  // 2. 检查怪物是否死亡
  if (state.monster.hp <= 0) {
    // 教程怪物：阻止真正的死亡，特殊处理
    if (state.monster.isTutorial) {
      if (state.monster.bossKey) {
        checkTutorialBossDefeated(state);
      } else {
        // 教程普通怪物：正常结算但不重生
        grantBattleRewards(state);
      }
      return;
    }
    grantBattleRewards(state);
    return;
  }

  // 教程Boss：每回合检查是否应该投降（HP降到1的情况）
  if (state.monster.isTutorial && state.monster.bossKey) {
    if (checkTutorialBossDefeated(state)) return;
  }

  // 教官已投降：锁定玩家操作，Boss 也不再攻击
  if (state.monster?.surrendered) {
    state.battleLog.push('教官已放下武器，训练结束。请点击「继续」回到营地。');
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
    // 教程中不会死亡
    if (state.isTutorialFloor || state.monster?.isTutorial) {
      state.player.hp = 1;
      state.battleLog.push('教官出手救了你！「注意血量，合理使用治疗和防御。」');
      return;
    }
    grantBattleDefeat(state);
    return;
  }
}
