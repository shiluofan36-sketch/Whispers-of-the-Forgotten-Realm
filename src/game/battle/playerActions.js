import { HEAL_AMOUNT, SKILLS } from '../constants';
import { calcPlayerDamage } from './damageSystem';
import { tickShieldTurns, consumeAttackBuff } from './battleEffects';
import { useItem } from '../inventory/inventoryManager';

/**
 * 玩家普攻
 */
export function playerAttack(state) {
  const { player, monster } = state;
  const wasDefending = monster.isDefending;
  const { damage, isCrit } = calcPlayerDamage(player, monster);

  // 攻击卷轴额外伤害
  const atkBuff = consumeAttackBuff(player);
  if (atkBuff > 0) {
    state.battleLog.push(`攻击卷轴生效！+${atkBuff}额外伤害`);
  }

  const totalDmg = damage + atkBuff;
  monster.hp = Math.max(0, monster.hp - totalDmg);

  const defNote = wasDefending ? '（防御减半）' : '';
  if (isCrit) {
    state.battleLog.push(`CRITICAL HIT! 对${monster.name}造成${totalDmg}点伤害${defNote}`);
  } else {
    state.battleLog.push(`对${monster.name}造成${totalDmg}点伤害${defNote}`);
  }
}

/**
 * 玩家防御
 */
export function playerDefend(state) {
  state.player.isDefending = true;
  state.battleLog.push('你进入防御姿态');
}

/**
 * 玩家治疗
 */
export function playerHeal(state) {
  const { player } = state;
  if (player.hp >= player.maxHp) {
    state.battleLog.push('生命值已满，无法恢复');
    return;
  }
  const actualHeal = Math.min(HEAL_AMOUNT, player.maxHp - player.hp);
  player.hp += actualHeal;
  state.battleLog.push(`你恢复了${actualHeal}点生命`);
}

/**
 * 玩家使用技能
 */
export function playerUseSkill(state, skillKey) {
  const skill = SKILLS[skillKey];
  const { player, monster } = state;

  player.mp -= skill.mp;
  state.battleLog.push(`使用【${skill.name}】(消耗 ${skill.mp} MP)`);

  if (skillKey === 'HEAVY_STRIKE') {
    const { damage, isCrit } = calcPlayerDamage(player, monster);
    const finalDmg = Math.floor(damage * skill.multiplier);
    monster.hp = Math.max(0, monster.hp - finalDmg);
    if (isCrit) {
      state.battleLog.push(`CRITICAL HIT! 对${monster.name}造成${finalDmg}点伤害`);
    } else {
      state.battleLog.push(`对${monster.name}造成${finalDmg}点伤害`);
    }
  }

  if (skillKey === 'SHIELD') {
    player.shieldTurns = skill.turns;
    state.battleLog.push(`获得护盾，${skill.turns}回合内受到伤害减半`);
  }

  if (skillKey === 'DRAIN') {
    const { damage, isCrit } = calcPlayerDamage(player, monster);
    monster.hp = Math.max(0, monster.hp - damage);
    const healAmount = Math.floor(damage * skill.drainRate);
    const actualHeal = Math.min(healAmount, player.maxHp - player.hp);
    player.hp += actualHeal;
    if (isCrit) {
      state.battleLog.push(`CRITICAL HIT! 对${monster.name}造成${damage}点伤害，恢复${actualHeal} HP`);
    } else {
      state.battleLog.push(`对${monster.name}造成${damage}点伤害，恢复${actualHeal} HP`);
    }
  }
}

/**
 * 玩家使用道具（委托给 inventoryManager）
 */
export function playerUseItem(state, slotIndex) {
  useItem(state, slotIndex);
}

/**
 * 执行玩家战斗行动（由battleEngine调用）
 */
export function executePlayerBattleAction(state, action) {
  if (action === 'attack') playerAttack(state);
  else if (action === 'defend') playerDefend(state);
  else if (action === 'heal') playerHeal(state);

  tickShieldTurns(state);
  state.battleTurn += 1;
  state.turn += 1;
}

/**
 * 执行玩家技能（由battleEngine调用，包含回合推进）
 */
export function executePlayerSkill(state, skillKey) {
  playerUseSkill(state, skillKey);
  tickShieldTurns(state);
  state.battleTurn += 1;
  state.turn += 1;
}
