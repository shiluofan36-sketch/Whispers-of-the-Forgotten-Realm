import { GAME_PHASE } from '../constants';
import { restAtCampfire } from '../camp/campManager';
import { buyItem } from '../camp/shopManager';
import { depositToStorage, withdrawFromStorage } from '../inventory/storageManager';
import { startExpedition, returnToCamp, handleDeath } from '../expedition/expeditionManager';
import { equipItem, unequipItem } from '../equipment/equipmentManager';
import { deleteSave, autoSave } from '../save/saveManager';
import { talkToNpc } from '../npc/npcManager';
import { buyUpgrade } from '../meta/metaManager';
import { advanceTutorialStep } from '../tutorial/tutorialManager';

// 教程营地步骤7-12允许的操作映射
const TUTORIAL_CAMP_ACTIONS = {
  7: 'campfire',
  8: 'shop_buy',
  9: 'equip',
  10: 'storage_deposit',
  11: 'tutorial_advance', // 由 CampPanel 面板切换触发
  12: 'start_expedition',
};

export function handleCampAction(state, action, payload) {
  // 教程营地步骤：只允许特定操作
  if (state.tutorialStep >= 7 && state.tutorialStep <= 12) {
    const expected = TUTORIAL_CAMP_ACTIONS[state.tutorialStep];

    if (action === expected || action === 'event_accept' || action === 'event_decline') {
      // 允许的操作，执行后根据操作推进步骤
      const result = executeAction(state, action, payload);
      // 推进步骤（event_accept/decline 和 tutorial_advance 由调用方控制推进时机）
      if (action === expected && action !== 'event_accept' && action !== 'event_decline' && action !== 'tutorial_advance') {
        advanceTutorialStep(state);
      }
      return result;
    }

    // 教程步骤11特殊处理：允许打开选层视图后手动推进
    if (state.tutorialStep === 11 && action === 'tutorial_advance') {
      advanceTutorialStep(state);
      return;
    }

    // 不允许的操作：给出引导提示
    const hints = {
      7: '请先点击 [篝火休息] 恢复状态',
      8: '请先打开 [商店] 购买药水',
      9: '请先打开 [装备] 穿上训练之剑',
      10: '请先打开 [仓库] 存入物品',
      11: '请先打开 [地下城之门] 查看楼层',
      12: '请在楼层选择中选择 Floor 1 开始冒险',
    };
    if (state.battleLog) {
      state.battleLog.push(hints[state.tutorialStep] || '请先完成当前教程步骤');
    }
    return;
  }

  return executeAction(state, action, payload);
}

// 原有逻辑抽取
function executeAction(state, action, payload) {
  switch (action) {
    case 'campfire':
      restAtCampfire(state);
      break;

    case 'shop_buy': {
      const result = buyItem(state, payload);
      return result;
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
      // payload is inventory slot index
      const slot = state.inventory[payload];
      if (!slot) return { success: false, message: '无效的背包位置' };
      const result = equipItem(state, slot.itemKey, slot.generated || null);
      if (result.success) {
        // Remove from inventory
        state.inventory.splice(payload, 1);
      }
      return result;
    }

    case 'unequip': {
      const result = unequipItem(state, payload);
      return result;
    }

    case 'ascend':
      if (state.unlockedFloors >= 12 && (state.ascensionLevel || 0) < 5) {
        state.ascensionLevel = (state.ascensionLevel || 0) + 1;
        state.unlockedFloors = 1;
        autoSave(state, 'meta_buy');
      }
      break;

    case 'delete_save':
      deleteSave();
      break;

    case 'event_accept':
      if (state.pendingEvent) {
        state.pendingEvent.onAccept(state);
        state.pendingEvent = null;
      }
      break;

    case 'event_decline':
      if (state.pendingEvent) {
        state.pendingEvent.onDecline(state);
        state.pendingEvent = null;
      }
      break;

    case 'npc_talk': {
      const result = talkToNpc(state, payload?.npcId, payload?.topicIndex);
      return result;
    }

    case 'meta_buy': {
      const result = buyUpgrade(state, payload);
      if (result.success) autoSave(state, 'meta_buy');
      return result;
    }

    case 'tutorial_advance':
      advanceTutorialStep(state);
      break;

    case 'return_camp': {
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
}
