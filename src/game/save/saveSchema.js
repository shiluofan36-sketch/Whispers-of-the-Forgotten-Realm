/**
 * 存档 Schema 定义
 * 职责：定义哪些字段需要持久化 + 存档数据提取/应用
 */

const SAVE_VERSION = 1;

export function getSaveData(state) {
  return {
    version: SAVE_VERSION,
    player: {
      level: state.player.level,
      exp: state.player.exp,
      gold: state.player.gold,
      hp: state.player.hp,
      maxHp: state.player.maxHp,
      mp: state.player.mp,
      maxMp: state.player.maxMp,
      attackMin: state.player.attackMin,
      attackMax: state.player.attackMax,
      strength: state.player.strength,
      defense: state.player.defense,
      agility: state.player.agility,
      equipment: state.player.equipment,
    },
    inventorySlots: state.inventorySlots,
    storage: state.storage,
    unlockedFloors: state.unlockedFloors,
    monstersDefeated: state.monstersDefeated,
    turn: state.turn,
    unlockedAchievements: state.unlockedAchievements,
  };
}

export function applySaveData(state, saveData) {
  if (!saveData || saveData.version !== SAVE_VERSION) return false;

  if (saveData.player) {
    const p = saveData.player;
    if (p.level != null) state.player.level = p.level;
    if (p.exp != null) state.player.exp = p.exp;
    if (p.gold != null) state.player.gold = p.gold;
    if (p.hp != null) { state.player.hp = p.hp; state.player.maxHp = p.maxHp; }
    if (p.mp != null) { state.player.mp = p.mp; state.player.maxMp = p.maxMp; }
    if (p.attackMin != null) { state.player.attackMin = p.attackMin; state.player.attackMax = p.attackMax; }
    if (p.strength != null) state.player.strength = p.strength;
    if (p.defense != null) state.player.defense = p.defense;
    if (p.agility != null) state.player.agility = p.agility;
    if (p.equipment != null) state.player.equipment = p.equipment;
  }

  if (saveData.inventorySlots != null) state.inventorySlots = saveData.inventorySlots;
  if (saveData.storage != null) state.storage = saveData.storage;
  if (saveData.unlockedFloors != null) state.unlockedFloors = saveData.unlockedFloors;
  if (saveData.monstersDefeated != null) state.monstersDefeated = saveData.monstersDefeated;
  if (saveData.turn != null) state.turn = saveData.turn;
  if (saveData.unlockedAchievements != null) state.unlockedAchievements = saveData.unlockedAchievements;

  return true;
}
