import { STATUS_EFFECTS } from './effectDefinitions';
import { addFloatingText, entityCenter } from '../effects/floatingTextManager';

/**
 * 给实体施加状态效果
 * @param {Array} effects - 实体的statusEffects数组
 * @param {string} type - burn|poison|freeze|bleed
 * @param {number} duration - 持续回合数
 */
export function applyStatusEffect(effects, type, duration) {
  const config = STATUS_EFFECTS[type];
  if (!config) return;

  // 同类型刷新持续时间
  const existing = effects.find(e => e.type === type);
  if (existing) {
    existing.duration = Math.max(existing.duration, duration);
    return;
  }

  effects.push({ type, duration });
}

/**
 * 每回合结算所有状态效果（在回合开始时调用）
 * @returns {Array} 本回合触发的效果描述
 */
export function tickStatusEffects(state, entity, effects, isPlayer) {
  const messages = [];

  for (let i = effects.length - 1; i >= 0; i--) {
    const eff = effects[i];
    const config = STATUS_EFFECTS[eff.type];
    if (!config) {
      effects.splice(i, 1);
      continue;
    }

    // 每回合持续伤害
    if (config.damagePerTurn > 0) {
      entity.hp = Math.max(0, entity.hp - config.damagePerTurn);
      messages.push(`${config.label}造成${config.damagePerTurn}点伤害`);

      // 浮动文字 + 粒子
      const pos = entityCenter(entity);
      addFloatingText(state, pos.px, pos.py, `-${config.damagePerTurn}`, eff.type);

      // 状态异常粒子映射
      const statusParticleMap = { burn: 'enrage', poison: 'poison', freeze: 'ice', bleed: 'crit' };
      const particleType = statusParticleMap[eff.type];
      if (particleType && state.particles) {
        state.particles.emit(particleType, pos.px, pos.py);
      }
    }

    // 减少持续时间
    eff.duration -= 1;
    if (eff.duration <= 0) {
      messages.push(`${config.label}效果消失`);
      effects.splice(i, 1);
    }
  }

  return messages;
}

/**
 * 检查冻结是否阻止行动
 * @returns {boolean} true表示被冻结无法行动
 */
export function checkFreezeBlock(effects) {
  const freeze = effects.find(e => e.type === 'freeze');
  if (!freeze) return false;
  return Math.random() < STATUS_EFFECTS.freeze.actionPenalty;
}

/**
 * 行动后触发流血伤害
 * @returns {string|null} 伤害描述
 */
export function triggerBleedOnAction(entity, effects) {
  const bleed = effects.find(e => e.type === 'bleed');
  if (!bleed) return null;

  const dmg = STATUS_EFFECTS.bleed.damageOnAction;
  entity.hp = Math.max(0, entity.hp - dmg);
  return `流血造成${dmg}点伤害`;
}

/**
 * 清除所有状态效果
 */
export function clearAllStatusEffects(effects) {
  effects.length = 0;
}
