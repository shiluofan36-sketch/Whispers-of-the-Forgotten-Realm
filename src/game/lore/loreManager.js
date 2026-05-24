import { LORE_FRAGMENTS } from '../../../shared/config/index.js';

export function getRandomLore(category) {
  let pool;
  if (category === 'any') {
    pool = [];
    for (const fragments of Object.values(LORE_FRAGMENTS)) {
      pool.push(...fragments);
    }
  } else {
    pool = LORE_FRAGMENTS[category];
  }
  if (!pool || pool.length === 0) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}

export function getLoreById(id) {
  for (const fragments of Object.values(LORE_FRAGMENTS)) {
    const found = fragments.find(f => f.id === id);
    if (found) return found;
  }
  return null;
}

export function markLoreSeen(state, loreId) {
  if (!state.loreHistory) state.loreHistory = [];
  if (!state.loreHistory.includes(loreId)) {
    state.loreHistory.push(loreId);
  }
}

export function getUnseenLore(state, category) {
  const seen = state.loreHistory || [];
  let pool;
  if (category === 'any') {
    pool = [];
    for (const fragments of Object.values(LORE_FRAGMENTS)) {
      pool.push(...fragments);
    }
  } else {
    pool = LORE_FRAGMENTS[category] || [];
  }
  const unseen = pool.filter(f => !seen.includes(f.id));
  if (unseen.length === 0) return pool[Math.floor(Math.random() * pool.length)] || null;
  return unseen[Math.floor(Math.random() * unseen.length)];
}
