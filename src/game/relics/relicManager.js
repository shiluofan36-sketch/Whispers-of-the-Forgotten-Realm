import { RELICS } from './relicData';

export function pickRandomRelic() {
  const keys = Object.keys(RELICS);
  const key = keys[Math.floor(Math.random() * keys.length)];
  return RELICS[key];
}

export function applyRelic(state, relic) {
  if (!relic) return null;
  state.currentRelic = relic;
  if (relic.apply) relic.apply(state);
  state.battleLog.push(`[遗物] 获得了遗物：${relic.name} — ${relic.desc}`);
  return relic;
}

export function removeRelic(state) {
  const relic = state.currentRelic;
  if (!relic) return;
  // Relics effects are reverted by expedition end (stats reset by meta revert)
  state.currentRelic = null;
}

export function getRelicInfo(relicId) {
  return RELICS[relicId] || null;
}
