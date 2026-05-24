import { GAME_PHASE } from '../constants';
import { restAtCampfire } from '../camp/campManager';
import { buyItem } from '../camp/shopManager';
import { depositToStorage, withdrawFromStorage } from '../inventory/storageManager';
import { startExpedition, returnToCamp, handleDeath } from '../expedition/expeditionManager';
import { equipItem, unequipItem } from '../equipment/equipmentManager';
import { deleteSave, autoSave } from '../save/saveManager';
import { talkToNpc } from '../npc/npcManager';
import { buyUpgrade } from '../meta/metaManager';

export function handleCampAction(state, action, payload) {
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
