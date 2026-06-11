import { Router } from 'express';
import { authRequired } from '../middleware/auth.js';
import { writeSave, readSave } from '../db/saveDb.js';

const router = Router();

router.post('/save', authRequired, async (req, res, next) => {
  try {
    const { gameState } = req.body;
    if (!gameState) {
      return res.status(400).json({ error: 'Missing gameState' });
    }
    await writeSave(req.user.id, gameState);
    res.json({ success: true });
  } catch (err) { next(err); }
});

router.get('/save', authRequired, async (req, res, next) => {
  try {
    const data = await readSave(req.user.id);
    res.json(data);
  } catch (err) { next(err); }
});

export default router;
