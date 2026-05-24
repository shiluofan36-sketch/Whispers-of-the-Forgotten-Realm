import { getConfig, getGameInfo, getLore } from '../controllers/configController.js';
import { Router } from 'express';

const router = Router();
router.get('/config', getConfig);
router.get('/game-info', getGameInfo);
router.get('/lore/:category', getLore);
export default router;
