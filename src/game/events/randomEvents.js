import { getRandomEquipment, getEquipmentInfo } from '../equipment/equipmentManager';
import { addItem } from '../inventory/inventoryManager';
import { addExp } from '../level';
import { setWorldFlag } from '../world/worldFlags';

// 自动结算事件（Phase 9 保留）
const AUTO_EVENTS = [
  {
    name: '宝箱', weight: 30,
    execute(state) {
      const gold = Math.floor(Math.random() * 101) + 50;
      state.expeditionGold += gold;
      state.battleLog.push(`[随机事件] 发现了宝箱！获得 ${gold} Gold！`);
    },
  },
  {
    name: '治疗之泉', weight: 25,
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
    name: '陷阱', weight: 25,
    execute(state) {
      const dmg = Math.floor(state.player.maxHp * (0.1 + Math.random() * 0.1));
      state.player.hp = Math.max(1, state.player.hp - dmg);
      state.battleLog.push(`[随机事件] 踩中了陷阱！失去 ${dmg} HP`);
    },
  },
  {
    name: '装备箱', weight: 20,
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

// Phase 11: 选择型事件
const CHOICE_EVENTS = [
  {
    name: '神秘祭坛',
    description: '你发现了一座发光的神秘祭坛。一个声音低语道："献上你的鲜血，换取力量..."',
    risk: '失去 30% 当前 HP',
    reward: '永久获得 +2 力量',
    onAccept(state) {
      const cost = Math.floor(state.player.hp * 0.3);
      state.player.hp = Math.max(1, state.player.hp - cost);
      state.player.strength += 2;
      setWorldFlag(state, 'shrineDestroyed');
      state.battleLog.push(`[神秘祭坛] 你献祭了 ${cost} HP，获得了 +2 力量！`);
    },
    onDecline(state) {
      state.battleLog.push('[神秘祭坛] 你选择离开祭坛。');
    },
  },
  {
    name: '上锁的门',
    description: '一扇沉重的铁门挡住了去路，门缝中透出金光。',
    risk: '失去 50-100 金币',
    reward: '获得一件稀有装备',
    onAccept(state) {
      const cost = Math.min(state.expeditionGold, Math.floor(Math.random() * 51) + 50);
      state.expeditionGold -= cost;
      const eqKey = getRandomEquipment();
      if (eqKey) {
        addItem(state, eqKey, 1);
        state.battleLog.push(`[上锁的门] 你花费 ${cost} 金币打开了门，获得了装备！`);
      }
    },
    onDecline(state) {
      state.battleLog.push('[上锁的门] 你选择不冒险。');
    },
  },
  {
    name: '诅咒宝箱',
    description: '一个散发着紫色光芒的宝箱。打开它的代价是什么？',
    risk: '受到 15-25 点伤害',
    reward: '获得 100-300 金币',
    onAccept(state) {
      const dmg = Math.floor(Math.random() * 11) + 15;
      state.player.hp = Math.max(1, state.player.hp - dmg);
      const gold = Math.floor(Math.random() * 201) + 100;
      state.expeditionGold += gold;
      state.battleLog.push(`[诅咒宝箱] 你受到 ${dmg} 伤害，但获得了 ${gold} 金币！`);
    },
    onDecline(state) {
      state.battleLog.push('[诅咒宝箱] 你谨慎地绕开了宝箱。');
    },
  },
  {
    name: '奇怪雕像',
    description: '一尊奇怪的雕像立在走廊中央。触碰它似乎能恢复体力，但也有风险...',
    risk: '无（安全）',
    reward: '完全恢复 HP 和 MP',
    onAccept(state) {
      state.player.hp = state.player.maxHp;
      state.player.mp = state.player.maxMp;
      setWorldFlag(state, 'ancientGateOpened');
      state.battleLog.push('[奇怪雕像] 雕像散发出温暖的光芒，你完全恢复了！');
    },
    onDecline(state) {
      state.battleLog.push('[奇怪雕像] 你决定不触碰未知的雕像。');
    },
  },
  {
    name: '流浪商人',
    description: '一个背着大包的流浪商人向你挥手。',
    risk: '花费 80 金币',
    reward: '获得 2 个随机药水',
    onAccept(state) {
      if (state.expeditionGold >= 80) {
        state.expeditionGold -= 80;
        addItem(state, 'SMALL_POTION', 2);
        state.battleLog.push('[流浪商人] 你用 80 金币买了 2 瓶药水。');
      } else {
        state.battleLog.push('[流浪商人] 金币不够，商人失望地离开了。');
      }
    },
    onDecline(state) {
      state.battleLog.push('[流浪商人] 商人耸耸肩继续前行。');
    },
  },
  {
    name: '远古遗迹',
    description: '你发现了远古文明留下的遗迹。研究它可能揭开地牢的秘密。',
    risk: '触发一次额外战斗（当前楼层怪物）',
    reward: '获得大量经验（当前楼层×30 EXP）',
    onAccept(state) {
      state.battleLog.push('[远古遗迹] 遗迹中涌出黑暗能量...准备战斗！');
      // 触发额外战斗：获得经验
      addExp(state, state.currentFloor * 30);
    },
    onDecline(state) {
      state.battleLog.push('[远古遗迹] 你决定不打扰古老的守卫。');
    },
  },
];

function getRandomFromPool(pool) {
  const totalWeight = pool.reduce((sum, e) => sum + e.weight, 0);
  let roll = Math.random() * totalWeight;
  for (const event of pool) {
    roll -= event.weight;
    if (roll <= 0) return event;
  }
  return pool[0];
}

export function tryTriggerEvent(state) {
  if (Math.random() >= 0.10) return;

  // 50% auto-resolve, 50% choice-based
  if (Math.random() < 0.5) {
    const event = getRandomFromPool(AUTO_EVENTS);
    event.execute(state);
  } else {
    const event = getRandomFromPool(CHOICE_EVENTS);
    state.pendingEvent = {
      name: event.name,
      description: event.description,
      risk: event.risk,
      reward: event.reward,
      onAccept: event.onAccept,
      onDecline: event.onDecline,
    };
  }
}
