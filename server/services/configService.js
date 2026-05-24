import { BOSS_TYPES, MONSTER_TYPES, GOLD_DROPS, ELITE_MODIFIERS, FLOORS, ACHIEVEMENTS, EQUIPMENT_TYPES, LORE_FRAGMENTS } from '../../shared/config/index.js';

export function getFullConfig() {
  return {
    bosses: BOSS_TYPES,
    monsters: MONSTER_TYPES,
    goldDrops: GOLD_DROPS,
    eliteModifiers: ELITE_MODIFIERS,
    floors: FLOORS,
    achievements: ACHIEVEMENTS,
    equipment: EQUIPMENT_TYPES,
  };
}

export function getLoreByCategory(category) {
  if (category === 'any') {
    const all = [];
    for (const fragments of Object.values(LORE_FRAGMENTS)) {
      all.push(...fragments);
    }
    return all;
  }
  return LORE_FRAGMENTS[category] || null;
}
