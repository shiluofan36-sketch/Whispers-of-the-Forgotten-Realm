import { BOSS_TYPES } from '../constants';
import { applyMonsterDamage } from '../battle/damageSystem';
import { addFloatingText, entityCenter, addEnrageWarning } from '../effects/floatingTextManager';
import { triggerPlayerFlash, triggerEntityFlash } from '../effects/entityFlash';
import { triggerScreenShake } from '../effects/screenShake';
import { playSfx } from '../audio/audioManager';
import { applyStatusEffect } from '../statusEffects/statusManager';
import { playAttackLunge, playHitReaction, playEnrageAnim } from '../animation/animationManager';
import { triggerBossHitStop } from '../animation/hitStopManager';
import { createBossSkillEffect } from '../animation/effectFactory';

/**
 * Boss特殊攻击（火焰吐息/暗影箭等，从配置读取技能名和伤害值）
 */
export function bossSpecialAttack(state, skill) {
  const boss = state.monster;
  const { damage, notes } = applyMonsterDamage(state, skill.damage);

  if (notes.includes('闪避')) {
    state.battleLog.push(`${boss.name}使用${skill.name}！但你闪避了！`);
    return;
  }

  const noteStr = notes.length > 0 ? `（${notes.join('，')}）` : '';
  state.battleLog.push(`${boss.name}使用${skill.name}！造成${damage}点伤害${noteStr}`);

  // Phase 13: Boss 攻击动画
  playAttackLunge(boss, state.player.x, state.player.y);
  triggerBossHitStop(state);

  // Phase 13: Boss 技能特效
  const skillKey = skill.name?.toUpperCase().replace(/\s+/g, '_') || 'BOSS_SKILL';
  createBossSkillEffect(state, skillKey, { x: boss.x, y: boss.y }, { x: state.player.x, y: state.player.y });

  // Phase 12: Boss技能附带状态
  if (skill.status) {
    applyStatusEffect(state.statusEffects, skill.status, skill.statusDuration || 2);
    state.battleLog.push(`你受到了${skill.status}效果！`);
  }

  const pos = entityCenter(state.player, state);
  addFloatingText(state, pos.px, pos.py, `-${damage}`, 'damage');
  triggerPlayerFlash(state.player);
  playHitReaction(state.player, true);
  triggerScreenShake(state, 4, 0.15);
  playSfx('boss_skill');
}

/**
 * Boss治疗技能（生命吸取等）
 */
export function bossHeal(state, skill) {
  const boss = state.monster;
  const actualHeal = Math.min(skill.healAmount, boss.maxHp - boss.hp);
  boss.hp += actualHeal;
  state.battleLog.push(`${boss.name}使用${skill.name}，恢复了${actualHeal}点生命！`);
}

/**
 * Boss普通攻击
 */
export function bossAttack(state) {
  const { monster } = state;
  playAttackLunge(monster, state.player.x, state.player.y);

  const baseDmg = Math.floor(
    Math.random() * (monster.attackMax - monster.attackMin + 1)
  ) + monster.attackMin;
  const { damage, notes } = applyMonsterDamage(state, baseDmg);

  if (notes.includes('闪避')) {
    state.battleLog.push(`${monster.name}的攻击被你闪避了！`);
    return;
  }

  const noteStr = notes.length > 0 ? `（${notes.join('，')}）` : '';
  state.battleLog.push(`${monster.name}对你造成${damage}点伤害${noteStr}`);

  const pos = entityCenter(state.player, state);
  addFloatingText(state, pos.px, pos.py, `-${damage}`, 'damage');
  triggerPlayerFlash(state.player);
  playHitReaction(state.player, true);
}

/**
 * Boss防御
 */
export function bossDefend(state) {
  state.monster.isDefending = true;
  state.battleLog.push(`${state.monster.name}进入防御姿态`);
}

/**
 * 检查并触发Boss狂暴
 */
export function checkBossEnrage(state) {
  const boss = state.monster;
  if (!boss || !boss.bossKey) return;

  const config = BOSS_TYPES[boss.bossKey];
  if (!boss.enraged && boss.hp / boss.maxHp <= config.enrageThreshold) {
    boss.enraged = true;
    boss.attackMin += config.enrageAtkBonus;
    boss.attackMax += config.enrageAtkBonus;
    state.battleLog.push(`${boss.name}进入狂暴状态！攻击力大幅提升！`);

    // Phase 13: Boss 狂暴动画
    playEnrageAnim(boss);
    triggerBossHitStop(state);

    // Boss狂暴警告大字 + 粒子 + 音效
    const pos = entityCenter(boss, state);
    addEnrageWarning(state, pos.px, pos.py - 20);
    triggerScreenShake(state, 6, 0.2);
    playSfx('boss_enrage');
    if (state.particles) state.particles.emit('enrage', pos.px, pos.py);
  }
}
