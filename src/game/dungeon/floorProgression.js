import {
  FLOOR_CLEAR_HP_PCT, FLOOR_CLEAR_MP_PCT,
  FLOOR_CLEAR_EXP_PER_FLOOR,
} from '../constants';
import { getRandomItem, getItemInfo } from '../items';
import { addItem } from '../inventory/inventoryManager';
import { unlockStairs } from './stairsSystem';
import { unlockNextFloor } from '../expedition/expeditionManager';

/**
 * 检查当前层是否全部清除
 */
export function isFloorCleared(state) {
  return state.enemiesRemaining <= 0 && !state.isBossFloor;
}

/**
 * 怪物被击杀后调用：递减计数器 + 检查清层
 */
export function onMonsterKilled(state) {
  if (state.isBossFloor) return; // Boss层不计数

  state.enemiesRemaining -= 1;

  if (state.enemiesRemaining <= 0) {
    state.enemiesRemaining = 0;
    grantFloorClearRewards(state);
    unlockStairs(state);
  }
}

/**
 * 清层奖励：HP恢复 + MP恢复 + 随机道具 + EXP
 */
function grantFloorClearRewards(state) {
  const { player } = state;
  const floor = state.currentFloor;

  // HP恢复
  const hpHeal = Math.floor(player.maxHp * FLOOR_CLEAR_HP_PCT);
  const actualHp = Math.min(hpHeal, player.maxHp - player.hp);
  player.hp += actualHp;

  // MP恢复
  const mpHeal = Math.floor(player.maxMp * FLOOR_CLEAR_MP_PCT);
  const actualMp = Math.min(mpHeal, player.maxMp - player.mp);
  player.mp += actualMp;

  // 随机道具
  const itemKey = getRandomItem();
  const itemInfo = getItemInfo(itemKey);
  const added = addItem(state, itemKey, 1);
  const itemMsg = (added && itemInfo) ? `获得${itemInfo.name}` : '背包已满';

  // EXP
  const expBonus = floor * FLOOR_CLEAR_EXP_PER_FLOOR;
  player.exp += expBonus;

  // 日志
  state.battleLog.push('====================');
  state.battleLog.push(`FLOOR CLEARED!`);
  state.battleLog.push(`Floor ${floor} Complete`);
  state.battleLog.push('====================');
  state.battleLog.push(`恢复 ${actualHp} HP, ${actualMp} MP`);
  state.battleLog.push(`获得 ${expBonus} EXP (楼层奖励)`);
  state.battleLog.push(`${itemMsg}`);
  state.battleLog.push('楼梯已解锁！');

  // 解锁下一楼层（用于营地选择）
  unlockNextFloor(state);

  // UI反馈标记
  state.floorCleared = true;
}
