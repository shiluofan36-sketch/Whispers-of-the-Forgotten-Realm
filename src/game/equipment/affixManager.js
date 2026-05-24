import { PREFIXES, SUFFIXES } from './affixData';

function pickRandomKey(obj) {
  const keys = Object.keys(obj);
  return keys[Math.floor(Math.random() * keys.length)];
}

function pickDifferent(obj, excludeKey) {
  const keys = Object.keys(obj).filter(k => k !== excludeKey);
  if (keys.length === 0) return null;
  return keys[Math.floor(Math.random() * keys.length)];
}

export function generateAffixes(rarity) {
  const affixes = [];

  if (rarity === 'rare') {
    // 50% prefix, 50% suffix
    if (Math.random() < 0.5) {
      const key = pickRandomKey(PREFIXES);
      affixes.push({ type: 'prefix', key, ...PREFIXES[key] });
    } else {
      const key = pickRandomKey(SUFFIXES);
      affixes.push({ type: 'suffix', key, ...SUFFIXES[key] });
    }
  }

  if (rarity === 'epic') {
    // 1 prefix + 1 suffix (确保不同家族)
    const prefixKey = pickRandomKey(PREFIXES);
    affixes.push({ type: 'prefix', key: prefixKey, ...PREFIXES[prefixKey] });

    const suffixKey = pickDifferent(SUFFIXES, prefixKey);
    if (suffixKey) {
      affixes.push({ type: 'suffix', key: suffixKey, ...SUFFIXES[suffixKey] });
    } else {
      const fallback = pickRandomKey(SUFFIXES);
      affixes.push({ type: 'suffix', key: fallback, ...SUFFIXES[fallback] });
    }
  }

  return affixes;
}

export function getAffixBonusTotal(affixes) {
  const total = {};
  for (const affix of affixes) {
    for (const [stat, value] of Object.entries(affix.bonus)) {
      total[stat] = (total[stat] || 0) + value;
    }
  }
  return total;
}

export function buildAffixName(baseName, affixes) {
  const prefix = affixes.find(a => a.type === 'prefix');
  const suffix = affixes.find(a => a.type === 'suffix');

  let name = baseName;
  if (prefix) name = `${prefix.name}${name}`;
  if (suffix) name = `${name}(${suffix.name})`;
  return name;
}

export function collectBuildTags(affixes) {
  const tags = new Set();
  for (const affix of affixes) {
    if (affix.buildTags) {
      for (const tag of affix.buildTags) {
        tags.add(tag);
      }
    }
  }
  return [...tags];
}
