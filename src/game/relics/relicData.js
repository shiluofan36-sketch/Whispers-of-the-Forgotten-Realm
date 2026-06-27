// 遗物定义 — 远征内有效，死亡/回营地丢失
import { applyStatusEffect } from '../statusEffects/statusManager';

export const RELICS = {
  GLASS_CANNON: {
    id: 'GLASS_CANNON',
    name: '玻璃大炮',
    desc: '攻击力 +50%，最大 HP -30%',
    color: '#ff6644',
    apply(state) {
      // Store original values for accurate revert
      state._relicBaseAttackMin = state.player.attackMin;
      state._relicBaseAttackMax = state.player.attackMax;
      state._relicBaseMaxHp = state.player.maxHp;
      state.player.attackMin = Math.floor(state.player.attackMin * 1.5);
      state.player.attackMax = Math.floor(state.player.attackMax * 1.5);
      state.player.maxHp = Math.floor(state.player.maxHp * 0.7);
      state.player.hp = Math.min(state.player.hp, state.player.maxHp);
    },
    remove(state) {
      const baseAtkMin = state._relicBaseAttackMin;
      const baseAtkMax = state._relicBaseAttackMax;
      const baseMaxHp = state._relicBaseMaxHp;
      if (baseAtkMin != null) { state.player.attackMin = baseAtkMin; }
      if (baseAtkMax != null) { state.player.attackMax = baseAtkMax; }
      if (baseMaxHp != null) { state.player.maxHp = baseMaxHp; state.player.hp = Math.min(state.player.hp, state.player.maxHp); }
      // Clean up stored bases
      delete state._relicBaseAttackMin;
      delete state._relicBaseAttackMax;
      delete state._relicBaseMaxHp;
    },
  },
  BLOOD_IDOL: {
    id: 'BLOOD_IDOL',
    name: '鲜血神像',
    desc: '吸血 +10%，每回合失去 3 HP',
    color: '#cc4444',
    apply(state) {
      state.player.lifesteal = (state.player.lifesteal || 0) + 0.10;
    },
    remove(state) {
      state.player.lifesteal = Math.max(0, (state.player.lifesteal || 0) - 0.10);
    },
    onTurn(state) {
      state.player.hp = Math.max(1, state.player.hp - 3);
    },
  },
  FROZEN_HEART: {
    id: 'FROZEN_HEART',
    name: '冰冻之心',
    desc: '冻结概率 +15%，免疫冻结',
    color: '#44ccff',
    apply(state) {
      state.player.freezeChance = (state.player.freezeChance || 0) + 0.15;
    },
    remove(state) {
      state.player.freezeChance = Math.max(0, (state.player.freezeChance || 0) - 0.15);
    },
    immuneTo: ['freeze'],
  },
  PLAGUE_SEED: {
    id: 'PLAGUE_SEED',
    name: '瘟疫之种',
    desc: '击杀怪物时，50% 概率对全场怪物施加中毒',
    color: '#88ff44',
    onKill(state) {
      if (Math.random() < 0.5) {
        const targets = [state.monster, ...(state.bossMinions || [])];
        for (const m of targets) {
          if (m && m.statusEffects) {
            applyStatusEffect(m.statusEffects, 'poison', 3);
          }
        }
        state.battleLog.push('[遗物] 瘟疫之种发作！全场怪物中毒！');
      }
    },
  },
  GOLDEN_SCARAB: {
    id: 'GOLDEN_SCARAB',
    name: '金甲虫',
    desc: '金币掉落翻倍',
    color: '#ffdd00',
    goldMult: 2,
  },
  PHOENIX_FEATHER: {
    id: 'PHOENIX_FEATHER',
    name: '凤凰羽毛',
    desc: '死亡时复活一次（恢复 50% HP），然后消失',
    color: '#ff8800',
    revive: true,
  },
  MERCURY_BOOTS: {
    id: 'MERCURY_BOOTS',
    name: '水银靴',
    desc: '闪避 +15%，敏捷 +5',
    color: '#aaaaff',
    apply(state) {
      state.player.dodgeRate = (state.player.dodgeRate || 0) + 0.15;
      state.player.agility += 5;
    },
    remove(state) {
      state.player.dodgeRate = Math.max(0, (state.player.dodgeRate || 0) - 0.15);
      state.player.agility = Math.max(0, (state.player.agility || 0) - 5);
    },
  },
  TITAN_BELT: {
    id: 'TITAN_BELT',
    name: '泰坦腰带',
    desc: '最大 HP +50，力量 +5',
    color: '#ffaa44',
    apply(state) {
      state.player.maxHp += 50;
      state.player.hp += 50;
      state.player.strength += 5;
    },
    remove(state) {
      state.player.maxHp = Math.max(0, state.player.maxHp - 50);
      state.player.hp = Math.min(state.player.hp, state.player.maxHp);
      state.player.strength = Math.max(0, (state.player.strength || 0) - 5);
    },
  },
  SAGE_ORB: {
    id: 'SAGE_ORB',
    name: '贤者宝珠',
    desc: '最大 MP +30，治疗 +20%，技能冷却 -1 回合',
    color: '#44aaff',
    apply(state) {
      state.player.maxMp += 30;
      state.player.mp += 30;
      state.player.healPower = (state.player.healPower || 0) + 0.20;
    },
    remove(state) {
      state.player.maxMp = Math.max(0, state.player.maxMp - 30);
      state.player.mp = Math.min(state.player.mp, state.player.maxMp);
      state.player.healPower = Math.max(0, (state.player.healPower || 0) - 0.20);
    },
  },
  SHADOW_ESSENCE: {
    id: 'SHADOW_ESSENCE',
    name: '暗影精华',
    desc: '暴击率 +10%，首次攻击必定暴击',
    color: '#8844ff',
    apply(state) {
      state.player.critRateBonus = (state.player.critRateBonus || 0) + 0.10;
    },
    remove(state) {
      state.player.critRateBonus = Math.max(0, (state.player.critRateBonus || 0) - 0.10);
    },
  },
};
