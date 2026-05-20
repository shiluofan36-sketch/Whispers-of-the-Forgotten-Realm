import { GAME_PHASE } from '../constants';
import { generateFloor } from './floorGenerator';

/**
 * 切换到指定楼层
 */
export function transitionToFloor(state, nextFloor) {
  state.battleLog.push(`下楼...`);
  generateFloor(state, nextFloor);
  state.gamePhase = GAME_PHASE.EXPLORATION;
}

/**
 * 获取当前楼层配置
 */
export function getCurrentFloorConfig(state) {
  return {
    floor: state.currentFloor,
    name: state.floorName,
    isBoss: state.isBossFloor,
  };
}
