import { POST_BATTLE_HEAL, DROP_RATE, MP_RESTORE, GAME_PHASE, FLOORS, GOLD_DROPS, MONSTER_TYPES, BOSS_TYPES } from '../constants';
import { generateMonster } from '../monsters';
import { getRandomItem, getItemInfo } from '../items';
import { addItem } from '../inventory/inventoryManager';
import { addExp } from '../level';
import { clearBuffs } from './battleEffects';
import { scaleMonsterForFloor } from '../dungeon/difficultyScaling';
import { onMonsterKilled } from '../dungeon/floorProgression';
import { unlockNextFloor } from '../expedition/expeditionManager';
import { getBossEquipment, getRandomEquipment, getEquipmentInfo } from '../equipment/equipmentManager';
import { checkAchievements } from '../achievements/achievementManager';

/**
 * 战斗胜利后：EXP + 金币 + 掉落 + HP/MP恢复 + 怪物刷新 or 胜利判定
 */
export function grantBattleRewards(state) {
  const { monster } = state;

  state.monstersDefeated += 1;
  state.battleLog.push(`${monster.name}被击败！`);

  // 成就检查
  if (monster.bossKey) {
    checkAchievements(state, { type: 'boss_kill', bossKey: monster.bossKey });
  } else {
    checkAchievements(state, { type: 'monster_kill' });
  }

  // 金币掉落（进入远征金币）
  const goldDropped = rollGoldDrop(monster);
  if (goldDropped > 0) {
    state.expeditionGold += goldDropped;
    state.battleLog.push(`获得了 ${goldDropped} Gold！`);
    checkAchievements(state, { type: 'gold_gain' });
  }

  // 物品掉落
  if (Math.random() < DROP_RATE + (FLOORS[state.currentFloor]?.dropRateBonus || 0)) {
    const itemKey = getRandomItem();
    const itemInfo = getItemInfo(itemKey);
    const added = addItem(state, itemKey, 1);
    if (added && itemInfo) {
      state.battleLog.push(`${monster.name}掉落了${itemInfo.name}！`);
    }
  }

  // 装备掉落：Boss 100% 掉专属装备，普通怪 5% 掉随机装备
  if (monster.bossKey) {
    const bossEq = getBossEquipment(monster.bossKey);
    if (bossEq) {
      const eqInfo = getEquipmentInfo(bossEq);
      const added = addItem(state, bossEq, 1);
      if (added && eqInfo) {
        state.battleLog.push(`${monster.name}掉落了${eqInfo.name}！`);
      }
    }
  } else if (Math.random() < 0.05) {
    const eqKey = getRandomEquipment();
    if (eqKey) {
      const eqInfo = getEquipmentInfo(eqKey);
      const added = addItem(state, eqKey, 1);
      if (added && eqInfo) {
        state.battleLog.push(`${monster.name}掉落了${eqInfo.name}！`);
      }
    }
  }

  // EXP
  addExp(state, monster.exp);

  // 清除buff
  clearBuffs(state);

  // Boss层：击败Boss即胜利
  if (state.isBossFloor) {
    state.bossDefeated = true;
    state.gamePhase = GAME_PHASE.VICTORY;
    state.battleLog.push(`${monster.name}被击败！`);
    unlockNextFloor(state);
    return true;
  }

  // 清层计数
  onMonsterKilled(state);

  // 楼层未清完：刷新怪物 + 战后恢复
  if (state.enemiesRemaining > 0) {
    const heal = Math.min(POST_BATTLE_HEAL, state.player.maxHp - state.player.hp);
    state.player.hp += heal;
    const mpRestore = Math.min(MP_RESTORE, state.player.maxMp - state.player.mp);
    state.player.mp += mpRestore;
    state.battleLog.push(`战斗胜利！恢复了${heal}HP, ${mpRestore}MP`);

    const floorConfig = FLOORS[state.currentFloor];
    const pool = floorConfig.monsterPool || null;
    state.monster = generateMonster(state.player, state.obstacles, pool);
    scaleMonsterForFloor(state.monster, state.currentFloor);
  } else {
    state.monster = null;
  }

  state.gamePhase = GAME_PHASE.EXPLORATION;

  return true;
}

/**
 * 根据怪物类型随机金币掉落
 */
function rollGoldDrop(monster) {
  const typeKey = monster.typeKey || monster.bossKey;
  if (!typeKey) return 0;

  const range = GOLD_DROPS[typeKey];
  if (!range) return 0;

  return Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
}

/**
 * 战斗失败：Phase 7 改为死亡结算（不再直接 GAME_OVER）
 */
export function grantBattleDefeat(state) {
  state.player.hp = 0;
  state.gamePhase = GAME_PHASE.GAME_OVER;
  state.battleLog.push('你被击败了...');
  return true;
}
