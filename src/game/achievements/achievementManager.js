/**
 * 成就管理器
 * 职责：成就检查和触发
 */
import { ACHIEVEMENTS } from '../constants';

/**
 * 根据游戏事件检查所有成就
 * @returns {string[]} 新解锁的成就 ID 列表
 */
export function checkAchievements(state, event) {
  const newUnlocks = [];

  for (const key of Object.keys(ACHIEVEMENTS)) {
    const achievement = ACHIEVEMENTS[key];
    if (state.unlockedAchievements.includes(achievement.id)) continue;

    let unlocked = false;

    switch (achievement.id) {
      case 'FIRST_KILL':
        unlocked = event.type === 'monster_kill' && state.monstersDefeated >= 1;
        break;
      case 'BOSS_SLAYER':
        unlocked = event.type === 'boss_kill' && event.bossKey === 'ANCIENT_DRAGON';
        break;
      case 'DEMON_SLAYER':
        unlocked = event.type === 'boss_kill' && event.bossKey === 'DEMON_LORD';
        break;
      case 'NECRO_HUNTER':
        unlocked = event.type === 'boss_kill' && event.bossKey === 'NECROMANCER';
        break;
      case 'GOLD_HOARDER':
        unlocked = event.type === 'gold_gain' && state.player.gold >= 500;
        break;
      case 'FLOOR_MASTER':
        unlocked = event.type === 'floor_unlock' && state.unlockedFloors >= 8;
        break;
      case 'CENTURION':
        unlocked = event.type === 'monster_kill' && state.monstersDefeated >= 100;
        break;
      case 'LEVEL_10':
        unlocked = event.type === 'level_up' && state.player.level >= 10;
        break;
      case 'RICH_EXPLORER':
        unlocked = event.type === 'return_camp' && event.expeditionGold >= 200;
        break;
    }

    if (unlocked) {
      state.unlockedAchievements.push(achievement.id);
      state.battleLog.push(`[成就解锁] ${achievement.name}: ${achievement.desc}`);
      newUnlocks.push(achievement.id);
    }
  }

  return newUnlocks;
}

/**
 * 获取所有成就及其解锁状态
 */
export function getAchievementList(state) {
  return Object.keys(ACHIEVEMENTS).map(key => {
    const a = ACHIEVEMENTS[key];
    return {
      ...a,
      unlocked: state.unlockedAchievements.includes(a.id),
    };
  });
}
