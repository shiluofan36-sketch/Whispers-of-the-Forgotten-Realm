import { GAME_PHASE, SKILLS, TOTAL_FLOORS } from '../constants';
import { keyToDirection } from '../input';
import { getNewPosition } from '../player';
import { isSameCell } from '../map';
import { canUseStairs } from '../dungeon/stairsSystem';
import { transitionToFloor } from '../dungeon/floorManager';
import { startBattle } from '../battle/battleEngine';
import { triggerRoom } from '../rooms/roomManager';

function keyToSkill(key) {
  for (const skillKey of Object.keys(SKILLS)) {
    if (SKILLS[skillKey].key === key) return skillKey;
  }
  return null;
}

export function handleInput(state, event, {
  onUseItem,
  onSkill,
}) {
  if (state.gamePhase === GAME_PHASE.GAME_OVER) return;
  if (state.gamePhase === GAME_PHASE.VICTORY) return;
  if (state.gamePhase === GAME_PHASE.CAMP) return;

  // 数字键 1/2/3：使用背包道具
  if (event.key === '1' || event.key === '2' || event.key === '3') {
    const slot = parseInt(event.key) - 1;
    if (onUseItem) onUseItem(slot);
    return;
  }

  // Q/E/R：技能快捷键（仅战斗模式）
  if (state.gamePhase === GAME_PHASE.BATTLE) {
    const skillKey = keyToSkill(event.key.toLowerCase());
    if (skillKey && onSkill) {
      onSkill(skillKey);
      return;
    }
  }

  // 探索模式：WASD 移动
  if (state.gamePhase === GAME_PHASE.EXPLORATION) {
    const direction = keyToDirection(event);
    if (!direction) return;

    const newPos = getNewPosition(state.player, direction, state.obstacles);
    if (!newPos) return;

    state.player.x = newPos.x;
    state.player.y = newPos.y;
    state.turn += 1;

    // 踩到特殊房间
    if (state.room && isSameCell(state.player, state.room)) {
      triggerRoom(state);
    }

    // 踩到楼梯
    if (state.stairs && isSameCell(state.player, state.stairs)) {
      const check = canUseStairs(state);
      if (!check.allowed) {
        state.battleLog.push(check.reason);
      } else {
        const nextFloor = state.currentFloor + 1;
        if (nextFloor <= TOTAL_FLOORS) {
          transitionToFloor(state, nextFloor);
        }
      }
    }

    // 碰到怪物 → 进入战斗
    if (state.monster && isSameCell(state.player, state.monster)) {
      startBattle(state);
    }
  }
}
