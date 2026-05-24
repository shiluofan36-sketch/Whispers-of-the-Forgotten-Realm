import { writeSave, readSave } from '../services/saveService.js';

export async function save(req, res, next) {
  try {
    const { saveId, gameState } = req.body;
    if (!saveId || !gameState) {
      return res.status(400).json({ error: 'Missing saveId or gameState' });
    }
    await writeSave(saveId, gameState);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

export async function load(req, res, next) {
  try {
    const { saveId } = req.params;
    if (!saveId) {
      return res.status(400).json({ error: 'Missing saveId' });
    }
    const data = await readSave(saveId);
    res.json(data);
  } catch (err) {
    next(err);
  }
}
