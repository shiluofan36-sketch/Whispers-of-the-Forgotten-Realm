import { MONSTER_TYPES } from '../constants';
import { applyMonsterDamage } from '../battle/damageSystem';
import { addFloatingText, entityCenter } from '../effects/floatingTextManager';
import { triggerPlayerFlash, triggerEntityFlash } from '../effects/entityFlash';
import { playSfx } from '../audio/audioManager';

/**
 * Boss召唤系统
 * 亡灵法师每3回合召唤骷髅小兵
 */

/**
 * 检查并执行召唤
 */
export function tryBossSummon(state) {
  const boss = state.monster;
  const minions = state.bossMinions || [];

  // 清除已死亡的小兵
  state.bossMinions = minions.filter(m => m.hp > 0);
}

/**
 * 亡灵法师AI：优先召唤，否则按原逻辑
 * @returns {string|null} 行动类型，null表示继续正常AI
 */
export function summonerBossAct(state, config) {
  const boss = state.monster;

  // 初始化召唤计数器
  if (boss.summonCooldown === undefined) {
    boss.summonCooldown = config.summonInterval || 3;
  }

  boss.summonCooldown -= 1;

  // 冷却完毕且小兵未满
  if (boss.summonCooldown <= 0) {
    // 先清理已死亡的小兵
    state.bossMinions = (state.bossMinions || []).filter(m => m.hp > 0);
    const minions = state.bossMinions || [];
    const maxMinions = config.summonMax || 2;

    if (minions.length < maxMinions) {
      summonMinion(state, config.summonType || 'SKELETON');
      boss.summonCooldown = config.summonInterval || 3;
      return 'summon';
    }

    boss.summonCooldown = config.summonInterval || 3;
  }

  return null; // 正常AI
}

/**
 * 召唤一个小兵
 */
function summonMinion(state, typeKey) {
  if (!state.bossMinions) state.bossMinions = [];

  const type = MONSTER_TYPES[typeKey];
  if (!type) return;

  // 小兵缩放属性
  const scale = 0.5;
  const minion = {
    x: state.monster.x,
    y: state.monster.y,
    hp: Math.floor(type.hp * scale),
    maxHp: Math.floor(type.maxHp * scale),
    name: type.name + '喽啰',
    isDefending: false,
    typeKey,
    color: type.color,
    attackMin: Math.floor(type.attackMin * scale),
    attackMax: Math.floor(type.attackMax * scale),
    attackRate: type.attackRate * 0.7,
    exp: 0, // 小兵不提供经验
    isMinion: true,
    flashTimer: 0,
    facing: 'left', // 战斗中面朝玩家（左侧）
  };

  state.bossMinions.push(minion);
  state.battleLog.push(`${state.monster.name}召唤了${minion.name}！`);
}

/**
 * 小兵攻击玩家
 */
export function minionAct(state) {
  const minions = state.bossMinions || [];
  if (minions.length === 0) return;

  // 随机一个小兵攻击
  const alive = minions.filter(m => m.hp > 0);
  if (alive.length === 0) return;

  const minion = alive[Math.floor(Math.random() * alive.length)];

  if (Math.random() < minion.attackRate) {
    const baseDmg = Math.floor(
      Math.random() * (minion.attackMax - minion.attackMin + 1)
    ) + minion.attackMin;
    const { damage, notes } = applyMonsterDamage(state, baseDmg);

    const pos = entityCenter(state.player, state);
    addFloatingText(state, pos.px, pos.py, `-${damage}`, 'damage');
    triggerPlayerFlash(state.player);
    playSfx('attack');

    const noteStr = notes.length > 0 ? `（${notes.join('，')}）` : '';
    state.battleLog.push(`${minion.name}对你造成${damage}点伤害${noteStr}`);
  }
}

/**
 * 小兵受到玩家攻击伤害分摊（玩家攻击时可能打到小兵）
 */
export function applyDamageToMinions(state, damage) {
  const minions = state.bossMinions || [];
  const alive = minions.filter(m => m.hp > 0);
  if (alive.length === 0) return false;

  // 30%概率打到小兵
  if (Math.random() < 0.3) {
    const target = alive[Math.floor(Math.random() * alive.length)];
    target.hp = Math.max(0, target.hp - damage);
    const wasDestroyed = target.hp <= 0;

    // 飘字反馈
    const pos = entityCenter(target, state);
    addFloatingText(state, pos.px, pos.py, `命中${target.name}！`, 'info');

    // 受击闪烁
    triggerEntityFlash(target, false);

    // 攻击音效
    playSfx('attack');

    state.battleLog.push(`攻击命中${target.name}！造成${damage}点伤害`);
    if (wasDestroyed) {
      state.battleLog.push(`${target.name}被消灭！`);
    }
    return true;
  }

  return false;
}
