import { GAME_PHASE, SKILLS, TOTAL_FLOORS } from './constants';
import { createInitialState } from './state';
import { keyToDirection } from './input';
import { getNewPosition } from './player';
import { isSameCell } from './map';
import { generateFloor } from './dungeon/floorGenerator';
import { transitionToFloor } from './dungeon/floorManager';
import { canUseStairs } from './dungeon/stairsSystem';
import { executeBattleTurn, startBattle } from './battle/battleEngine';
import { playerUseItem } from './battle/playerActions';
import { canUseSkill } from './skills';
import { getItem } from './inventory/inventoryManager';
import { render } from './renderer';

// Phase 7: 营地/远征/商店/仓库 模块
import { restAtCampfire } from './camp/campManager';
import { buyItem } from './camp/shopManager';
import { depositToStorage, withdrawFromStorage } from './inventory/storageManager';
import { startExpedition, returnToCamp, handleDeath } from './expedition/expeditionManager';
// Phase 8: 装备模块
import { equipItem, unequipItem } from './equipment/equipmentManager';

/**
 * 游戏控制器
 * 职责：输入路由 + 模块编排（不处理具体战斗/移动逻辑）
 */
export function createGame() {
  const state = createInitialState();

  let onUpdate = null;

  /** 将键盘按键映射到技能 key */
  function keyToSkill(key) {
    for (const skillKey of Object.keys(SKILLS)) {
      if (SKILLS[skillKey].key === key) return skillKey;
    }
    return null;
  }

  /** 触发 UI 更新 */
  function notify() {
    if (onUpdate) onUpdate();
  }

  return {
    getState() {
      return state;
    },

    setOnUpdate(callback) {
      onUpdate = callback;
    },

    /**
     * 处理键盘输入
     */
    handleInput(event) {
      if (state.gamePhase === GAME_PHASE.GAME_OVER) return;
      if (state.gamePhase === GAME_PHASE.VICTORY) return;
      if (state.gamePhase === GAME_PHASE.CAMP) return;

      // 数字键 1/2/3：使用背包道具
      if (event.key === '1' || event.key === '2' || event.key === '3') {
        const slot = parseInt(event.key) - 1;
        this.handleUseItem(slot);
        return;
      }

      // Q/E/R：技能快捷键（仅战斗模式）
      if (state.gamePhase === GAME_PHASE.BATTLE) {
        const skillKey = keyToSkill(event.key.toLowerCase());
        if (skillKey) {
          this.handleSkill(skillKey);
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

        notify();
      }
    },

    /**
     * Phase 7: 营地/远征/商店/仓库 统一入口
     * @param {string} action - 'campfire' | 'shop_buy' | 'storage_deposit' | 'storage_withdraw' | 'start_expedition' | 'return_camp'
     * @param {*} payload - 附加参数
     */
    handleCampAction(action, payload) {
      switch (action) {
        case 'campfire':
          restAtCampfire(state);
          break;

        case 'shop_buy': {
          const result = buyItem(state, payload);
          notify();
          return result; // 返回购买结果给 UI
        }

        case 'storage_deposit':
          depositToStorage(state, payload);
          break;

        case 'storage_withdraw':
          withdrawFromStorage(state, payload);
          break;

        case 'start_expedition':
          startExpedition(state, payload);
          break;

        case 'equip': {
          const result = equipItem(state, payload);
          notify();
          return result;
        }

        case 'unequip': {
          const result = unequipItem(state, payload);
          notify();
          return result;
        }

        case 'return_camp': {
          // 根据当前阶段决定结算方式
          if (state.gamePhase === GAME_PHASE.GAME_OVER) {
            handleDeath(state);
          } else if (state.gamePhase === GAME_PHASE.VICTORY) {
            returnToCamp(state);
            state.bossDefeated = false;
          } else {
            returnToCamp(state);
          }
          break;
        }
      }
      notify();
    },

    /** 使用背包道具 */
    handleUseItem(slot) {
      const item = getItem(state, slot);
      if (!item) return;
      playerUseItem(state, slot);
      notify();
    },

    /** 战斗行动（攻击/防御/治疗） */
    handleBattleAction(action) {
      executeBattleTurn(state, { type: 'action', action });
      notify();
    },

    /** 技能（含MP检查，不足时不消耗回合） */
    handleSkill(skillKey) {
      if (!canUseSkill(state, skillKey)) {
        state.battleLog.push('MP不足！');
        notify();
        return;
      }
      executeBattleTurn(state, { type: 'skill', skillKey });
      notify();
    },

    /** 渲染一帧 */
    renderFrame(ctx) {
      render(ctx, state);
    },
  };
}
