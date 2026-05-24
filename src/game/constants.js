// 统一从 shared/config 导出所有游戏常量（单一配置源）
export {
  GRID_SIZE, CELL_SIZE, OBSTACLE_COUNT, OBSTACLE_GEN_MAX_ATTEMPTS,
  OBSTACLE_STYLE, RENDER, COLOR, STAIRS_COLOR, STAIRS_LOCKED_COLOR,
  STAIRS_LABEL, STAIRS_LOCKED_LABEL, OBSTACLE_THEME, THEME_BG,
} from '../../shared/config/index.js';

export {
  PLAYER_HP, PLAYER_ATTACK_MIN, PLAYER_ATTACK_MAX, PLAYER_MP,
  PLAYER_STR, PLAYER_DEF, PLAYER_AGI, HEAL_AMOUNT, POST_BATTLE_HEAL,
  MP_RESTORE, EXP_BASE, LEVEL_UP_HP, LEVEL_UP_ATK_MIN, LEVEL_UP_ATK_MAX,
  LEVEL_UP_MP, LEVEL_UP_STR, LEVEL_UP_DEF, LEVEL_UP_AGI,
  INVENTORY_BASE_SLOTS, DROP_RATE,
} from '../../shared/config/index.js';

export {
  BASE_CRIT, AGI_CRIT, CRIT_MULT,
} from '../../shared/config/index.js';

export {
  MONSTER_TYPES, BOSS_TYPES, GOLD_DROPS,
  ELITE_MODIFIERS, ELITE_CHANCE, ELITE_DROP_BONUS, ELITE_GOLD_MULT,
} from '../../shared/config/index.js';

export {
  TOTAL_FLOORS, FLOORS, FLOOR_HP_SCALE, FLOOR_ATK_SCALE,
  FLOOR_MONSTER_COUNT, FLOOR_CLEAR_HP_PCT, FLOOR_CLEAR_MP_PCT,
  FLOOR_CLEAR_EXP_PER_FLOOR,
} from '../../shared/config/index.js';

export {
  ITEM_TYPES, MAX_STACK, EQUIPMENT_TYPES,
} from '../../shared/config/index.js';

export { SKILLS } from '../../shared/config/index.js';

export {
  CAMP_HP_RESTORE, CAMP_MP_RESTORE, SHOP_ITEMS,
} from '../../shared/config/index.js';

export { ACHIEVEMENTS } from '../../shared/config/index.js';

export { GAME_PHASE } from '../../shared/config/index.js';
