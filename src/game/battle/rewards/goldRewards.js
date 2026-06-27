import { GOLD_DROPS, ELITE_GOLD_MULT } from '../../constants';
import { checkAchievements } from '../../achievements/achievementManager';

export function rollGoldDrop(monster) {
  const typeKey = monster.typeKey || monster.bossKey;
  if (!typeKey) return 0;
  const range = GOLD_DROPS[typeKey];
  if (!range) return 0;
  return Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
}

export function grantGoldReward(state, monster) {
  let gold = rollGoldDrop(monster);
  if (monster.isElite) {
    gold = Math.floor(gold * ELITE_GOLD_MULT);
  }
  // Phase 15: 遗物金币加成
  if (state.currentRelic?.goldMult) {
    gold = Math.floor(gold * state.currentRelic.goldMult);
  }
  if (gold > 0) {
    state.expeditionGold += gold;
    state.battleLog.push(`获得了 ${gold} Gold！`);
    checkAchievements(state, { type: 'gold_gain' });
  }
  return gold;
}
