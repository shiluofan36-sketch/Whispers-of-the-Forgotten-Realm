// 统一从 data/ 目录导出所有常量
export {
  GRID_SIZE, CELL_SIZE, OBSTACLE_COUNT, OBSTACLE_GEN_MAX_ATTEMPTS,
  OBSTACLE_STYLE, RENDER, COLOR, STAIRS_COLOR, STAIRS_LOCKED_COLOR,
  STAIRS_LABEL, STAIRS_LOCKED_LABEL, OBSTACLE_THEME,
} from './data/renderData.js';

export {
  PLAYER_HP, PLAYER_ATTACK_MIN, PLAYER_ATTACK_MAX, PLAYER_MP,
  PLAYER_STR, PLAYER_DEF, PLAYER_AGI, HEAL_AMOUNT, POST_BATTLE_HEAL,
  MP_RESTORE, EXP_BASE, LEVEL_UP_HP, LEVEL_UP_ATK_MIN, LEVEL_UP_ATK_MAX,
  LEVEL_UP_MP, LEVEL_UP_STR, LEVEL_UP_DEF, LEVEL_UP_AGI,
  INVENTORY_BASE_SLOTS, DROP_RATE,
} from './data/playerData.js';

export {
  BASE_CRIT, AGI_CRIT, CRIT_MULT,
} from './data/combatData.js';

export {
  MONSTER_TYPES, BOSS_TYPES, GOLD_DROPS,
} from './data/monsterData.js';

export {
  TOTAL_FLOORS, FLOORS, FLOOR_HP_SCALE, FLOOR_ATK_SCALE,
  FLOOR_MONSTER_COUNT, FLOOR_CLEAR_HP_PCT, FLOOR_CLEAR_MP_PCT,
  FLOOR_CLEAR_EXP_PER_FLOOR,
} from './data/floorData.js';

export {
  ITEM_TYPES, MAX_STACK, EQUIPMENT_TYPES,
} from './data/itemData.js';

export {
  SKILLS,
} from './data/skillData.js';

export {
  CAMP_HP_RESTORE, CAMP_MP_RESTORE, SHOP_ITEMS,
} from './data/campData.js';

export {
  ACHIEVEMENTS,
} from './data/achievementData.js';

export {
  GAME_PHASE,
} from './data/gamePhaseData.js';
