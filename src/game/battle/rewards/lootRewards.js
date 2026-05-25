import { DROP_RATE, FLOORS, ELITE_DROP_BONUS } from '../../constants';
import { getRandomItem, getItemInfo } from '../../items';
import { addItem } from '../../inventory/inventoryManager';
import { getBossEquipment, getEquipmentInfo } from '../../equipment/equipmentManager';
import { generateRandomLoot, generateBossEquipment } from '../../equipment/lootGenerator';
import { playSfx } from '../../audio/audioManager';
import { triggerLootCard } from '../../animation/lootAnimation';

export function grantLootRewards(state, monster) {
  // 消耗品掉落
  const dropChance = DROP_RATE
    + (FLOORS[state.currentFloor]?.dropRateBonus || 0)
    + (monster.isElite ? ELITE_DROP_BONUS : 0);
  if (Math.random() < dropChance) {
    const itemKey = getRandomItem();
    const itemInfo = getItemInfo(itemKey);
    const added = addItem(state, itemKey, 1);
    if (added && itemInfo) {
      state.battleLog.push(`${monster.name}掉落了${itemInfo.name}！`);
      playSfx('loot');
    }
  }

  // Boss专属装备 (100%) — Phase 12: 带词缀
  if (monster.bossKey) {
    const generated = generateBossEquipment(monster.bossKey);
    if (generated) {
      const added = addItem(state, generated.itemKey, 1, generated);
      if (added) {
        state.battleLog.push(`${monster.name}掉落了${generated.name}！`);
        triggerLootCard(state, generated.name, generated.quality || 'rare', generated.itemKey, generated.slot);
        playSfx('loot');
      }
    }
    return;
  }

  // 普通怪 5% 随机装备 — Phase 12: 带词缀
  if (Math.random() < 0.05) {
    const generated = generateRandomLoot(state.currentFloor, state.ascensionLevel || 0);
    if (generated) {
      const added = addItem(state, generated.itemKey, 1, generated);
      if (added) {
        state.battleLog.push(`${monster.name}掉落了${generated.name}！`);
        triggerLootCard(state, generated.name, generated.quality || 'common', generated.itemKey, generated.slot);
      }
    }
  }
}
