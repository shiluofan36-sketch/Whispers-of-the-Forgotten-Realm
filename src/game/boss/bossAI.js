import { BOSS_TYPES } from '../constants';
import { bossSpecialAttack, bossHeal, bossAttack, bossDefend, checkBossEnrage } from './bossSkills';
import { summonerBossAct, minionAct } from './bossSummonSystem';
import { applyMonsterDamage } from '../battle/damageSystem';
import { addFloatingText, entityCenter } from '../effects/floatingTextManager';
import { triggerPlayerFlash } from '../effects/entityFlash';
import { executeTutorialBossAction, resetTutorialBossState } from '../tutorial/tutorialBossAI';

// 从boss对象或BOSS_TYPES获取配置
function getBossConfig(boss) {
  return boss.config || (BOSS_TYPES[boss.bossKey] || null);
}

/**
 * Boss AI 总入口：根据Boss行为类型分发
 */
export function executeBossAction(state) {
  const boss = state.monster;
  const config = getBossConfig(boss);

  // 狂暴检查（行动前）
  checkBossEnrage(state);

  // 根据行为类型分发
  switch (config.behavior) {
    case 'tutorial':
      executeTutorialBossAction(state);
      break;
    case 'caster':
      casterBossAct(state, config);
      break;
    case 'phase':
      phaseBossAct(state, config);
      break;
    case 'summoner':
      summonerBossWrapper(state, config);
      break;
    default:
      defaultBossAct(state, config);
      break;
  }
}

// ============================================================
//  默认行为：按技能概率随机选择
// ============================================================
function defaultBossAct(state, config) {
  const roll = Math.random();
  let cumulative = 0;

  for (const skill of config.skills) {
    cumulative += skill.rate;
    if (roll < cumulative) {
      switch (skill.type) {
        case 'damage':
          bossSpecialAttack(state, skill);
          return;
        case 'heal':
          bossHeal(state, skill);
          return;
        case 'defend':
          bossDefend(state);
          return;
      }
    }
  }

  bossAttack(state);
}

// ============================================================
//  暗影领主：连续施法型
//  2回合连续技能 → 1回合虚弱(伤害减半、无技能)
// ============================================================
function casterBossAct(state, config) {
  const boss = state.monster;

  // 初始化AI状态
  if (!boss.aiState) {
    boss.aiState = 'casting';
    boss.aiTimer = 2;
  }

  if (boss.aiState === 'casting') {
    // 施法回合：正常技能选择
    boss.aiTimer -= 1;
    if (boss.aiTimer <= 0) {
      boss.aiState = 'weakened';
      boss.weakened = true;
      boss.aiTimer = 1;
      state.battleLog.push(`${boss.name}施法过度，进入虚弱状态！`);
    }
    defaultBossAct(state, config);
  } else {
    // 虚弱回合：仅普通攻击且伤害减半
    boss.aiTimer -= 1;
    if (boss.aiTimer <= 0) {
      boss.aiState = 'casting';
      boss.weakened = false;
      boss.aiTimer = 2;
      state.battleLog.push(`${boss.name}恢复了力量！`);
    }
    // 虚弱普通攻击
    weakenedAttack(state);
  }
}

/**
 * 虚弱普通攻击：伤害减半
 */
function weakenedAttack(state) {
  const { monster } = state;
  const baseDmg = Math.floor(
    (Math.random() * (monster.attackMax - monster.attackMin + 1) + monster.attackMin) * 0.5
  );
  const { damage, notes } = applyMonsterDamage(state, baseDmg);
  const noteStr = notes.length > 0 ? `（${notes.join('，')}）` : '';
  state.battleLog.push(`${monster.name}(虚弱)对你造成${damage}点伤害${noteStr}`);

  const pos = entityCenter(state.player, state);
  addFloatingText(state, pos.px, pos.py, `-${damage}`, 'damage');
  triggerPlayerFlash(state.player);
}

// ============================================================
//  火焰元素：阶段型
//  HP > 70%: 普通模式
//  HP 40~70%: 技能概率+10%
//  HP < 40%: 烈焰狂暴(攻击力+8, 技能概率再+10%)
// ============================================================
function phaseBossAct(state, config) {
  const boss = state.monster;
  const hpRatio = boss.hp / boss.maxHp;
  const bonus = config.phaseBonus || { skillRate: 0.10, atkBonus: 8 };

  // 更新阶段并应用加成
  if (hpRatio <= 0.4 && boss.phase !== 2) {
    boss.phase = 2;
    boss.attackMin += bonus.atkBonus;
    boss.attackMax += bonus.atkBonus;
    state.battleLog.push(`${boss.name}进入烈焰狂暴阶段！攻击力提升！`);
  } else if (hpRatio <= 0.7 && hpRatio > 0.4 && boss.phase !== 1) {
    boss.phase = 1;
    state.battleLog.push(`${boss.name}开始认真战斗！`);
  }

  // 高阶段增加技能概率（通过调整后再次随机）
  const extraRate = boss.phase >= 1 ? bonus.skillRate : 0;
  const extraRate2 = boss.phase >= 2 ? bonus.skillRate : 0;

  const roll = Math.random();
  let cumulative = 0;

  for (const skill of config.skills) {
    cumulative += skill.rate + extraRate + extraRate2;
    if (roll < cumulative) {
      switch (skill.type) {
        case 'damage':
          bossSpecialAttack(state, skill);
          return;
        case 'heal':
          bossHeal(state, skill);
          return;
        case 'defend':
          bossDefend(state);
          return;
      }
    }
  }

  bossAttack(state);
}

// ============================================================
//  亡灵法师：召唤型
//  每3回合召唤骷髅，小兵攻击
// ============================================================
function summonerBossWrapper(state, config) {
  // 先让小兵攻击
  minionAct(state);

  // 检查召唤
  const action = summonerBossAct(state, config);
  if (action === 'summon') return;

  // 正常AI
  defaultBossAct(state, config);
}
