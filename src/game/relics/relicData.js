// 遗物定义 — 远征内有效，死亡/回营地丢失
export const RELICS = {
  GLASS_CANNON: {
    id: 'GLASS_CANNON',
    name: '玻璃大炮',
    desc: '攻击力 +50%，最大 HP -30%',
    color: '#ff6644',
    apply(state) {
      state.player.attackMin = Math.floor(state.player.attackMin * 1.5);
      state.player.attackMax = Math.floor(state.player.attackMax * 1.5);
      state.player.maxHp = Math.floor(state.player.maxHp * 0.7);
      state.player.hp = Math.min(state.player.hp, state.player.maxHp);
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
    immuneTo: ['freeze'],
  },
  PLAGUE_SEED: {
    id: 'PLAGUE_SEED',
    name: '瘟疫之种',
    desc: '击杀怪物时，50% 概率对全场怪物施加中毒',
    color: '#88ff44',
    apply() {},
  },
  GOLDEN_SCARAB: {
    id: 'GOLDEN_SCARAB',
    name: '金甲虫',
    desc: '金币掉落翻倍',
    color: '#ffdd00',
    apply() {},
    goldMult: 2,
  },
  PHOENIX_FEATHER: {
    id: 'PHOENIX_FEATHER',
    name: '凤凰羽毛',
    desc: '死亡时复活一次（恢复 50% HP），然后消失',
    color: '#ff8800',
    revive: true,
    apply() {},
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
  },
  SHADOW_ESSENCE: {
    id: 'SHADOW_ESSENCE',
    name: '暗影精华',
    desc: '暴击率 +10%，首次攻击必定暴击',
    color: '#8844ff',
    apply(state) {
      state.player.critRateBonus = (state.player.critRateBonus || 0) + 0.10;
    },
  },
};
