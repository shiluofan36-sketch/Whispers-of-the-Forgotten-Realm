import { getFullConfig, getLoreByCategory } from '../services/configService.js';

export function getConfig(req, res) {
  res.json(getFullConfig());
}

export function getGameInfo(req, res) {
  res.json({
    version: '1.1.0',
    date: '2026-05-24',
    phase: 11,
    systems: [
      'battle', 'equipment', 'achievements', 'camp', 'expedition',
      'random-events', 'combat-feedback', 'audio', 'boss-ai',
      'status-effects', 'elite-monsters', 'build-archetypes',
      'special-rooms', 'npcs', 'meta-progression', 'lore',
    ],
  });
}

export function getLore(req, res) {
  const { category } = req.params;
  const lore = getLoreByCategory(category);
  if (!lore) {
    return res.status(404).json({ error: `Unknown lore category: ${category}` });
  }
  res.json(lore);
}
