import { HEAL_AMOUNT, SKILLS } from '../constants';
import { calcPlayerDamage } from './damageSystem';
import { tickShieldTurns, consumeAttackBuff } from './battleEffects';
import { useItem } from '../inventory/inventoryManager';
import { addFloatingText, entityCenter } from '../effects/floatingTextManager';
import { triggerEntityFlash } from '../effects/entityFlash';
import { playSfx } from '../audio/audioManager';
import { applyDamageToMinions } from '../boss/bossSummonSystem';
import { applyStatusEffect } from '../statusEffects/statusManager';
import { setSkillCooldown, tickCooldowns } from '../skills';
import { playAttackLunge, playHitReaction } from '../animation/animationManager';
import { triggerCritHitStop } from '../animation/hitStopManager';
import { createSkillEffect } from '../animation/effectFactory';

/**
 * 玩家普攻
 */
export function playerAttack(state) {
  const { player, monster } = state;
  const wasDefending = monster.isDefending;
  const { damage, isCrit } = calcPlayerDamage(player, monster);

  // Phase 13: 攻击前冲动画
  playAttackLunge(player, monster.x, monster.y);

  // 攻击卷轴额外伤害
  const atkBuff = consumeAttackBuff(player);
  if (atkBuff > 0) {
    state.battleLog.push(`攻击卷轴生效！+${atkBuff}额外伤害`);
  }

  const totalDmg = damage + atkBuff;

  // Boss战时30%概率打到小兵
  if (monster.bossKey && applyDamageToMinions(state, totalDmg)) {
    return;
  }

  monster.hp = Math.max(0, monster.hp - totalDmg);

  // Phase 13: 暴击 Hit Stop
  if (isCrit) triggerCritHitStop(state);

  // 浮动文字 + 受击闪烁 + 音效
  const pos = entityCenter(monster, state);
  if (wasDefending) {
    addFloatingText(state, pos.px, pos.py, 'BLOCK', 'block');
    playSfx('block');
  } else if (isCrit) {
    addFloatingText(state, pos.px, pos.py, `-${totalDmg}`, 'crit');
    addFloatingText(state, pos.px, pos.py - 20, 'CRIT!', 'crit');
    playSfx('crit');
    if (state.particles) state.particles.emit('crit', pos.px, pos.py);
  } else {
    addFloatingText(state, pos.px, pos.py, `-${totalDmg}`, 'damage');
    playSfx('attack');
  }
  triggerEntityFlash(monster, !!monster.bossKey);
  playHitReaction(monster, !!monster.bossKey);

  const defNote = wasDefending ? '（防御减半）' : '';
  if (isCrit) {
    state.battleLog.push(`CRITICAL HIT! 对${monster.name}造成${totalDmg}点伤害${defNote}`);
  } else {
    state.battleLog.push(`对${monster.name}造成${totalDmg}点伤害${defNote}`);
  }

  // Phase 12: 词缀效果
  applyPlayerOnHitEffects(state, totalDmg);

  // Phase 12: 反射精英怪
  if (monster.isElite && monster.eliteModifier?.thorns) {
    const reflect = monster.eliteModifier.thorns;
    player.hp = Math.max(0, player.hp - reflect);
    const playerPos = entityCenter(player, state);
    addFloatingText(state, playerPos.px, playerPos.py, `-${reflect}`, 'damage');
    state.battleLog.push(`${monster.name}的荆棘光环反弹${reflect}伤害！`);
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
  const healMultiplier = 1 + (player.healPower || 0);
  const baseHeal = Math.floor(HEAL_AMOUNT * healMultiplier);
  const actualHeal = Math.min(baseHeal, player.maxHp - player.hp);
  player.hp += actualHeal;

  const pos = entityCenter(player, state);
  addFloatingText(state, pos.px, pos.py, `+${actualHeal}`, 'heal');
  playSfx('heal');

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
    playAttackLunge(player, monster.x, monster.y);
    const { damage, isCrit } = calcPlayerDamage(player, monster);
    const finalDmg = Math.floor(damage * skill.multiplier);

    if (monster.bossKey && applyDamageToMinions(state, finalDmg)) {
      return;
    }

    monster.hp = Math.max(0, monster.hp - finalDmg);

    if (isCrit) triggerCritHitStop(state);
    createSkillEffect(state, skillKey, { x: player.x, y: player.y }, { x: monster.x, y: monster.y });

    const pos = entityCenter(monster, state);
    if (isCrit) {
      addFloatingText(state, pos.px, pos.py, `-${finalDmg}`, 'crit');
      addFloatingText(state, pos.px, pos.py - 20, 'CRIT!', 'crit');
      if (state.particles) state.particles.emit('crit', pos.px, pos.py);
    } else {
      state.battleLog.push(`对${monster.name}造成${finalDmg}点伤害`);
    }
  }

  if (skillKey === 'SHIELD') {
    player.shieldTurns = skill.turns;
    createSkillEffect(state, skillKey, { x: player.x, y: player.y }, { x: player.x, y: player.y });
    state.battleLog.push(`获得护盾，${skill.turns}回合内受到伤害减半`);
  }

  if (skillKey === 'DRAIN') {
    playAttackLunge(player, monster.x, monster.y);
    const { damage, isCrit } = calcPlayerDamage(player, monster);

    const hitMinion = monster.bossKey && applyDamageToMinions(state, damage);

    if (!hitMinion) {
      monster.hp = Math.max(0, monster.hp - damage);

      if (isCrit) triggerCritHitStop(state);
      createSkillEffect(state, skillKey, { x: player.x, y: player.y }, { x: monster.x, y: monster.y });

      const pos = entityCenter(monster, state);
      if (isCrit) {
        addFloatingText(state, pos.px, pos.py, `-${damage}`, 'crit');
        addFloatingText(state, pos.px, pos.py - 20, 'CRIT!', 'crit');
        if (state.particles) state.particles.emit('crit', pos.px, pos.py);
      } else {
        addFloatingText(state, pos.px, pos.py, `-${damage}`, 'damage');
      }
      triggerEntityFlash(monster, !!monster.bossKey);
      playHitReaction(monster, !!monster.bossKey);
    }

    const healAmount = Math.floor(damage * skill.drainRate);
    const actualHeal = Math.min(healAmount, player.maxHp - player.hp);
    player.hp += actualHeal;

    const playerPos = entityCenter(player, state);
    addFloatingText(state, playerPos.px, playerPos.py, `+${actualHeal}`, 'heal');

    if (hitMinion) {
      state.battleLog.push(`吸血恢复${actualHeal} HP`);
    } else if (isCrit) {
      state.battleLog.push(`CRITICAL HIT! 对${monster.name}造成${damage}点伤害，恢复${actualHeal} HP`);
    } else {
      state.battleLog.push(`对${monster.name}造成${damage}点伤害，恢复${actualHeal} HP`);
    }
  }

  // Phase 12: 毒击
  if (skillKey === 'POISON_STRIKE') {
    playAttackLunge(player, monster.x, monster.y);
    const { damage, isCrit } = calcPlayerDamage(player, monster);
    const finalDmg = Math.floor(damage * (skill.multiplier || 1));
    monster.hp = Math.max(0, monster.hp - finalDmg);

    if (isCrit) triggerCritHitStop(state);
    createSkillEffect(state, skillKey, { x: player.x, y: player.y }, { x: monster.x, y: monster.y });

    const pos = entityCenter(monster, state);
    addFloatingText(state, pos.px, pos.py, `-${finalDmg}`, 'damage');
    triggerEntityFlash(monster, !!monster.bossKey);
    playHitReaction(monster, !!monster.bossKey);

    if (monster.statusEffects) {
      applyStatusEffect(monster.statusEffects, 'poison', skill.statusDuration);
      state.battleLog.push(`${monster.name}中毒了！`);
    }
    if (isCrit) state.battleLog.push(`CRITICAL HIT! 对${monster.name}造成${finalDmg}点伤害`);
    else state.battleLog.push(`对${monster.name}造成${finalDmg}点伤害`);
  }

  // Phase 12: 冰霜屏障
  if (skillKey === 'ICE_BARRIER') {
    player.shieldTurns = skill.shieldTurns;
    createSkillEffect(state, skillKey, { x: player.x, y: player.y }, { x: player.x, y: player.y });
    if (monster.statusEffects) {
      applyStatusEffect(monster.statusEffects, 'freeze', 2);
      state.battleLog.push(`${monster.name}被冰霜屏障冻结了！`);
    }
    state.battleLog.push(`获得冰霜护盾，${skill.shieldTurns}回合内受伤害减半`);
  }

  // Set cooldown
  setSkillCooldown(state, skillKey);
}

/**
 * 玩家使用道具（委托给 inventoryManager）
 */
export function playerUseItem(state, slotIndex) {
  useItem(state, slotIndex);
}

/**
 * Phase 12: 玩家击中时触发词缀效果
 */
function applyPlayerOnHitEffects(state, damageDealt) {
  const { player, monster } = state;

  // 吸血
  if ((player.lifesteal || 0) > 0) {
    const healAmount = Math.floor(damageDealt * player.lifesteal);
    if (healAmount > 0) {
      const actualHeal = Math.min(healAmount, player.maxHp - player.hp);
      player.hp += actualHeal;
      const pos = entityCenter(player, state);
      addFloatingText(state, pos.px, pos.py, `+${actualHeal}`, 'heal');
      state.battleLog.push(`吸血恢复 ${actualHeal} HP`);
    }
  }

  // 荆棘（怪物受到反伤）
  if ((player.thorns || 0) > 0 && monster) {
    monster.hp = Math.max(0, monster.hp - player.thorns);
    state.battleLog.push(`荆棘反弹 ${player.thorns} 伤害`);
  }

  // 中毒
  if ((player.poisonChance || 0) > 0 && Math.random() < player.poisonChance) {
    if (monster.statusEffects) {
      applyStatusEffect(monster.statusEffects, 'poison', 3);
      state.battleLog.push(`武器附毒！${monster.name}中毒了`);
    }
  }

  // 灼烧
  if ((player.burnChance || 0) > 0 && Math.random() < player.burnChance) {
    if (monster.statusEffects) {
      applyStatusEffect(monster.statusEffects, 'burn', 3);
      state.battleLog.push(`烈焰点燃了${monster.name}！`);
    }
  }

  // 冻结
  if ((player.freezeChance || 0) > 0 && Math.random() < player.freezeChance) {
    if (monster.statusEffects) {
      applyStatusEffect(monster.statusEffects, 'freeze', 3);
      state.battleLog.push(`${monster.name}被冰霜冻结！`);
    }
  }
}

/**
 * 执行玩家战斗行动（由battleEngine调用）
 */
export function executePlayerBattleAction(state, action) {
  if (action === 'attack') playerAttack(state);
  else if (action === 'defend') playerDefend(state);
  else if (action === 'heal') playerHeal(state);

  tickShieldTurns(state);
  tickCooldowns(state);
  state.battleTurn += 1;
  state.turn += 1;
}

export function executePlayerSkill(state, skillKey) {
  playerUseSkill(state, skillKey);
  tickShieldTurns(state);
  tickCooldowns(state);
  state.battleTurn += 1;
  state.turn += 1;
}
