import { applyMonsterDamage } from './damageSystem';

/**
 * 普通怪物AI：根据 attackRate 决定攻击或防御
 */
export function monsterAct(state) {
  const { player, monster } = state;

  if (Math.random() < monster.attackRate) {
    const baseDmg = Math.floor(
      Math.random() * (monster.attackMax - monster.attackMin + 1)
    ) + monster.attackMin;
    const { damage, notes } = applyMonsterDamage(state, baseDmg);
    const noteStr = notes.length > 0 ? `（${notes.join('，')}）` : '';
    state.battleLog.push(`${monster.name}对你造成${damage}点伤害${noteStr}`);
  } else {
    monster.isDefending = true;
    state.battleLog.push(`${monster.name}进入防御姿态`);
  }
}
