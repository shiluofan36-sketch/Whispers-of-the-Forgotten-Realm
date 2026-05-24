import { EQUIPMENT_TYPES } from '../constants';
import { PREFIXES, SUFFIXES } from './affixData';
import { generateAffixes, buildAffixName, collectBuildTags, getAffixBonusTotal } from './affixManager';

export function generateEquipment(floor, rarity, forceType) {
  // 选择基础装备
  let pool;
  if (forceType) {
    pool = Object.entries(EQUIPMENT_TYPES).filter(
      ([, eq]) => eq.rarity === rarity && !eq.bossDrop && eq.slot === forceType
    );
  } else {
    pool = Object.entries(EQUIPMENT_TYPES).filter(
      ([, eq]) => eq.rarity === rarity && !eq.bossDrop
    );
  }

  if (pool.length === 0) return null;

  const [baseKey, baseDef] = pool[Math.floor(Math.random() * pool.length)];

  // 生成词缀
  const affixes = generateAffixes(rarity);
  const displayName = affixes.length > 0
    ? buildAffixName(baseDef.name, affixes)
    : baseDef.name;

  // 合并 bonus
  const affixBonus = getAffixBonusTotal(affixes);
  const totalBonuses = { ...baseDef.bonus };
  for (const [stat, value] of Object.entries(affixBonus)) {
    totalBonuses[stat] = (totalBonuses[stat] || 0) + value;
  }

  const buildTags = collectBuildTags(affixes);

  return {
    itemKey: baseKey,
    baseKey,
    name: displayName,
    slot: baseDef.slot,
    rarity,
    bonus: totalBonuses,
    affixes,
    buildTags,
    price: Math.floor(baseDef.price * (1 + affixes.length * 0.5)),
  };
}

export function generateBossEquipment(bossKey) {
  const baseKey = Object.keys(EQUIPMENT_TYPES).find(
    k => EQUIPMENT_TYPES[k].bossDrop === bossKey
  );
  if (!baseKey) return null;

  const baseDef = EQUIPMENT_TYPES[baseKey];

  // Boss装备固定2词缀（1 prefix + 1 suffix）
  const affixes = generateAffixes('epic');
  const displayName = buildAffixName(baseDef.name, affixes);

  const affixBonus = getAffixBonusTotal(affixes);
  const totalBonuses = { ...baseDef.bonus };
  for (const [stat, value] of Object.entries(affixBonus)) {
    totalBonuses[stat] = (totalBonuses[stat] || 0) + value;
  }

  return {
    itemKey: baseKey,
    baseKey,
    name: displayName,
    slot: baseDef.slot,
    rarity: 'epic',
    bonus: totalBonuses,
    affixes,
    buildTags: collectBuildTags(affixes),
    price: 0,
    bossDrop: bossKey,
  };
}

export function generateRandomLoot(floor, ascensionLevel = 0) {
  const ascBonus = Math.min(ascensionLevel * 0.02, 0.20);
  const roll = Math.random();
  let rarity;
  if (roll < 0.55 - ascBonus * 0.3) rarity = 'common';
  else if (roll < 0.85 + ascBonus * 0.5) rarity = 'rare';
  else if (roll < 0.97 + ascBonus * 0.3) rarity = 'epic';
  else rarity = 'legendary';
  return generateEquipment(floor, rarity);
}
