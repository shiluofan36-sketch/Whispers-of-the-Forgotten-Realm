import { BUILD_TYPES, BUILD_SYNERGIES } from './buildData';

function collectEquippedBuildTags(state) {
  const tags = new Map();
  const { equipment } = state.player;
  for (const slot of Object.values(equipment)) {
    if (!slot || !slot.buildTags) continue;
    for (const tag of slot.buildTags) {
      tags.set(tag, (tags.get(tag) || 0) + 1);
    }
  }
  return tags;
}

export function analyzePlayerBuild(state) {
  const tagCounts = collectEquippedBuildTags(state);
  if (tagCounts.size === 0) return { dominantBuild: null, buildScore: {}, synergies: [] };

  // 计算每个build的得分
  const scores = {};
  for (const [tag, count] of tagCounts) {
    const def = BUILD_TYPES[tag];
    if (!def) continue;
    scores[tag] = count;
  }

  // 找主导build
  let dominantBuild = null;
  let maxScore = 0;
  for (const [tag, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      dominantBuild = tag;
    }
  }

  // 检测协同
  const synergies = [];
  const tags = Object.keys(scores);
  for (let i = 0; i < tags.length; i++) {
    for (let j = i + 1; j < tags.length; j++) {
      const key = `${tags[i]}+${tags[j]}`;
      const reverse = `${tags[j]}+${tags[i]}`;
      const synergy = BUILD_SYNERGIES[key] || BUILD_SYNERGIES[reverse];
      if (synergy) synergies.push(synergy);
    }
  }

  return { dominantBuild, buildScore: scores, synergies };
}

export function getBuildInfo(buildKey) {
  return BUILD_TYPES[buildKey] || null;
}

export function getBuildList() {
  return Object.values(BUILD_TYPES);
}

export function applySynergyBonuses(state) {
  const { synergies } = analyzePlayerBuild(state);
  const player = state.player;
  for (const synergy of synergies) {
    for (const [stat, value] of Object.entries(synergy.bonus)) {
      player[stat] = (player[stat] || 0) + value;
    }
  }
  return synergies;
}
