/**
 * 教程Boss AI：教官·艾丹
 * - 不会真正杀死玩家（最低 HP=1）
 * - 在特定血量节点给出教学提示
 * - HP降到1时投降
 */
import { applyMonsterDamage } from '../battle/damageSystem';
import { addFloatingText, entityCenter } from '../effects/floatingTextManager';
import { triggerPlayerFlash } from '../effects/entityFlash';
import { triggerScreenShake } from '../effects/screenShake';
import { playSfx } from '../audio/audioManager';
import { advanceTutorialStep } from './tutorialManager';

let phaseMessageShown = { mid: false, low: false };

export function resetTutorialBossState() {
  phaseMessageShown = { mid: false, low: false };
}

export function executeTutorialBossAction(state) {
  const boss = state.monster;
  const cfg = boss.config;
  if (!cfg) return;

  const hpRatio = boss.hp / boss.maxHp;

  // 教官低血量提示
  if (hpRatio <= 0.5 && !phaseMessageShown.mid) {
    phaseMessageShown.mid = true;
    state.battleLog.push('教官：「不错！你掌握得很快——继续攻击！」');
  }
  if (hpRatio <= 0.2 && !phaseMessageShown.low) {
    phaseMessageShown.low = true;
    state.battleLog.push('教官：「就差一点了！全力进攻！」');
  }

  // 随机选择行动
  const roll = Math.random();
  if (roll < 0.45) {
    tutorialBossAttack(state);
  } else if (roll < 0.80) {
    tutorialBossDefend(state);
  } else {
    tutorialBossHeal(state);
  }
}

function tutorialBossAttack(state) {
  const boss = state.monster;
  const cfg = boss.config;

  let baseDmg = Math.floor(
    Math.random() * (cfg.attackMax - cfg.attackMin + 1)
  ) + cfg.attackMin;

  // 如果玩家HP很低，伤害减半且不会致死
  if (state.player.hp <= 15) {
    baseDmg = Math.floor(baseDmg * 0.4);
  }

  const { damage, notes } = applyMonsterDamage(state, baseDmg);

  // 安全检查：确保不杀死玩家
  if (state.player.hp - damage <= 0) {
    state.battleLog.push('教官的攻击被你勉强挡住！（教官手下留情了）');
    triggerScreenShake(state, 2, 0.1);
    return;
  }

  if (notes.includes('闪避')) {
    state.battleLog.push(`教官的攻击被你闪避了！`);
    return;
  }

  const noteStr = notes.length > 0 ? `（${notes.join('，')}）` : '';
  state.battleLog.push(`教官使用训练攻击，造成${damage}点伤害${noteStr}`);

  const pos = entityCenter(state.player, state);
  addFloatingText(state, pos.px, pos.py, `-${damage}`, 'damage');
  triggerPlayerFlash(state.player);
}

function tutorialBossDefend(state) {
  state.monster.isDefending = true;
  state.battleLog.push('教官进入防御姿态——等他一轮！');
}

function tutorialBossHeal(state) {
  const boss = state.monster;
  const heal = Math.min(25, boss.maxHp - boss.hp);
  if (heal > 0) {
    boss.hp += heal;
    state.battleLog.push(`教官调整姿态，恢复了${heal}点生命`);
  }
}

/**
 * 检查教程Boss是否应该投降
 * 在 battleEngine 中每次玩家行动后调用
 */
export function checkTutorialBossDefeated(state) {
  const boss = state.monster;
  if (!boss || !boss.isTutorial || !boss.bossKey) return false;

  if (boss.hp <= 1) {
    boss.hp = 1;
    state.battleLog.push('教官：「很好！训练结束——你已经掌握了战斗的要领。」');
    state.pendingEvent = {
      name: '训练完成！',
      description: '教官·艾丹收起武器，赞许地点了点头。\n\n「你做得很好，冒险者。楼梯已经解锁，返回营地吧——那里有更多东西等着你。」',
      risk: '无',
      reward: '楼梯解锁，可进入营地',
      isTutorial: true,
      tutorialStep: 5,
      onAccept: (s) => {
        s.pendingEvent = null;
        s.monster = null;
        s.bossDefeated = true;
        s.enemiesRemaining = 0;
        s.gamePhase = 'exploration';
        advanceTutorialStep(s);
      },
      onDecline: (s) => { s.pendingEvent = null; },
    };
    return true;
  }
  return false;
}
