import { getRandomEquipment, getEquipmentInfo } from '../equipment/equipmentManager';
import { addItem } from '../inventory/inventoryManager';

const EVENTS = [
  {
    name: '宝箱',
    weight: 30,
    execute(state) {
      const gold = Math.floor(Math.random() * 101) + 50;
      state.expeditionGold += gold;
      state.battleLog.push(`[随机事件] 发现了宝箱！获得 ${gold} Gold！`);
    },
  },
  {
    name: '治疗之泉',
    weight: 25,
    execute(state) {
      const hpHeal = Math.floor(state.player.maxHp * 0.3);
      const mpHeal = Math.floor(state.player.maxMp * 0.2);
      const actualHp = Math.min(state.player.maxHp - state.player.hp, hpHeal);
      const actualMp = Math.min(state.player.maxMp - state.player.mp, mpHeal);
      state.player.hp += actualHp;
      state.player.mp += actualMp;
      state.battleLog.push(`[随机事件] 发现了治疗之泉！恢复 ${actualHp} HP / ${actualMp} MP`);
    },
  },
  {
    name: '陷阱',
    weight: 25,
    execute(state) {
      const dmg = Math.floor(state.player.maxHp * (0.1 + Math.random() * 0.1));
      state.player.hp = Math.max(1, state.player.hp - dmg);
      state.battleLog.push(`[随机事件] 踩中了陷阱！失去 ${dmg} HP`);
    },
  },
  {
    name: '装备箱',
    weight: 20,
    execute(state) {
      const eqKey = getRandomEquipment();
      if (eqKey) {
        const eqInfo = getEquipmentInfo(eqKey);
        const added = addItem(state, eqKey, 1);
        if (added && eqInfo) {
          state.battleLog.push(`[随机事件] 发现了装备箱！获得 ${eqInfo.name}！`);
        }
      }
    },
  },
];

function getRandomEvent() {
  const totalWeight = EVENTS.reduce((sum, e) => sum + e.weight, 0);
  let roll = Math.random() * totalWeight;
  for (const event of EVENTS) {
    roll -= event.weight;
    if (roll <= 0) return event;
  }
  return EVENTS[0];
}

/**
 * 尝试触发随机事件（10%基础概率）
 */
export function tryTriggerEvent(state) {
  if (Math.random() < 0.10) {
    const event = getRandomEvent();
    event.execute(state);
  }
}
