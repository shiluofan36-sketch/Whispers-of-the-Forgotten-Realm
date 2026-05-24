import { ROOM_TYPES } from './roomData.js';
import { getRandomLore, markLoreSeen } from '../lore/loreManager.js';
import { getRandomEquipment, getEquipmentInfo } from '../equipment/equipmentManager.js';
import { addItem } from '../inventory/inventoryManager.js';
import { playSfx } from '../audio/audioManager.js';
import { hasWorldFlag } from '../world/worldFlags.js';

export function generateRoomForFloor(state) {
  if (state.isBossFloor) return;

  const roll = Math.random();
  let cumulative = 0;
  let selected = null;

  for (const room of Object.values(ROOM_TYPES)) {
    cumulative += room.rarity;
    if (roll < cumulative) {
      selected = room;
      break;
    }
  }

  if (!selected) return;

  // Find empty cell that's not on player, stairs, or obstacles
  const occupied = new Set();
  occupied.add(`${state.player.x},${state.player.y}`);
  if (state.stairs) occupied.add(`${state.stairs.x},${state.stairs.y}`);
  for (const obs of state.obstacles) {
    occupied.add(`${obs.x},${obs.y}`);
  }
  // Reserve edges for room placement (prefer corners or edges)
  const candidates = [];
  for (let x = 0; x < 10; x++) {
    for (let y = 0; y < 10; y++) {
      if (!occupied.has(`${x},${y}`)) {
        candidates.push({ x, y });
      }
    }
  }

  if (candidates.length === 0) return;

  const pos = candidates[Math.floor(Math.random() * candidates.length)];
  state.room = { x: pos.x, y: pos.y, type: selected.type };
}

export function triggerRoom(state) {
  if (!state.room) return;
  const roomDef = Object.values(ROOM_TYPES).find(r => r.type === state.room.type);
  if (!roomDef) return;

  const eff = roomDef.effect;
  const room = state.room;

  switch (room.type) {
    case 'treasure': {
      const gold = Math.floor(Math.random() * (eff.gold.max - eff.gold.min + 1)) + eff.gold.min;
      state.expeditionGold += gold;
      state.battleLog.push(`[${roomDef.name}] 你发现了 ${gold} 金币！`);
      playSfx('loot');
      break;
    }
    case 'curse': {
      const cost = Math.floor(state.player.hp * eff.hpCost);
      state.player.hp = Math.max(1, state.player.hp - cost);
      state.expeditionGold += eff.rewardGold;
      state.battleLog.push(`[${roomDef.name}] 黑暗能量吸取了你 ${cost} 点生命...但你发现了 ${eff.rewardGold} 金币！`);
      break;
    }
    case 'shrine': {
      const atkBonus = eff.buff.attack * (hasWorldFlag(state, 'ancientGateOpened') ? 2 : 1);
      const defBonus = eff.buff.defense * (hasWorldFlag(state, 'ancientGateOpened') ? 2 : 1);
      state.player.attackBuff += atkBonus;
      state.player.defenseBuff += defBonus;
      const extra = hasWorldFlag(state, 'ancientGateOpened') ? '（远古之门强化！）' : '';
      state.battleLog.push(`[${roomDef.name}] 祭坛祝福了你！攻击+${atkBonus}，防御+${defBonus}${extra}`);
      playSfx('heal');
      break;
    }
    case 'merchant': {
      const eq = getRandomEquipment();
      if (eq) {
        addItem(state, eq, 1);
        const info = getEquipmentInfo(eq);
        state.battleLog.push(`[${roomDef.name}] 商人给了你一件装备：${info?.name || eq}`);
        playSfx('loot');
      } else {
        const gold = 100;
        state.expeditionGold += gold;
        state.battleLog.push(`[${roomDef.name}] 商人给了你 ${gold} 金币`);
        playSfx('loot');
      }
      break;
    }
    case 'healing': {
      const hpHeal = Math.floor(state.player.maxHp * eff.heal.hpPct);
      const mpHeal = Math.floor(state.player.maxMp * eff.heal.mpPct);
      state.player.hp = Math.min(state.player.maxHp, state.player.hp + hpHeal);
      state.player.mp = Math.min(state.player.maxMp, state.player.mp + mpHeal);
      state.battleLog.push(`[${roomDef.name}] 你恢复了 ${hpHeal} HP 和 ${mpHeal} MP`);
      playSfx('heal');
      break;
    }
  }

  // Display lore fragment
  const lore = getRandomLore(roomDef.loreCategory || 'any');
  if (lore) {
    state.battleLog.push(`"${lore.text}"`);
    markLoreSeen(state, lore.id);
  }

  state.room = null;
}
