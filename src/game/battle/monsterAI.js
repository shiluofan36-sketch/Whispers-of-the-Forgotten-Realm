import { applyMonsterDamage } from './damageSystem';
import { addFloatingText, entityCenter } from '../effects/floatingTextManager';
import { triggerPlayerFlash } from '../effects/entityFlash';
import { playSfx } from '../audio/audioManager';
import { applyStatusEffect } from '../statusEffects/statusManager';
import { playAttackLunge, playHitReaction } from '../animation/animationManager';

/**
 * 普通怪物AI：根据 attackRate 决定攻击或防御
 * 精英怪有特殊效果
 */
export function monsterAct(state) {
  const { player, monster } = state;

  if (Math.random() < monster.attackRate) {
    // Phase 13: 怪物攻击前冲
    playAttackLunge(monster, player.x, player.y);

    const baseDmg = Math.floor(
      Math.random() * (monster.attackMax - monster.attackMin + 1)
    ) + monster.attackMin;
    const { damage, notes } = applyMonsterDamage(state, baseDmg);

    if (notes.includes('闪避')) {
      state.battleLog.push('你闪避了攻击！');
      return;
    }

    const pos = entityCenter(player, state);
    const blockTypes = ['护盾减半', '防御卷轴减半', '防御姿态减半'];
    const isBlocked = notes.some(n => blockTypes.includes(n));
    if (isBlocked) {
      addFloatingText(state, pos.px, pos.py, 'BLOCK', 'block');
      playSfx('block');
    }
    addFloatingText(state, pos.px, pos.py + 16, `-${damage}`, 'damage');
    triggerPlayerFlash(player);
    playHitReaction(player, false);
    playSfx('attack');

    // 精英词缀效果
    if (monster.isElite && monster.eliteModifier) {
      if (monster.eliteModifier.onAttack === 'poison') {
        applyStatusEffect(state.statusEffects, 'poison', 3);
        state.battleLog.push(`${monster.name}的攻击附带了中毒效果！`);
      }
      if (monster.eliteModifier.onAttack === 'freeze') {
        applyStatusEffect(state.statusEffects, 'freeze', 2);
        state.battleLog.push(`${monster.name}的冰霜光环冻结了你！`);
      }
      if (monster.eliteModifier.critBonus) {
        if (Math.random() < monster.eliteModifier.critBonus) {
          const extraDmg = Math.floor(damage * 0.5);
          player.hp = Math.max(0, player.hp - extraDmg);
          addFloatingText(state, pos.px, pos.py - 16, `CRIT! -${extraDmg}`, 'crit');
          if (state.particles) state.particles.emit('crit', pos.px, pos.py);
        }
      }
    }

    const noteStr = notes.length > 0 ? `（${notes.join('，')}）` : '';
    state.battleLog.push(`${monster.name}对你造成${damage}点伤害${noteStr}`);
  } else {
    monster.isDefending = true;
    state.battleLog.push(`${monster.name}进入防御姿态`);
  }
}
