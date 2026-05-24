import { save, load } from '../controllers/saveController.js';
import { Router } from 'express';

const router = Router();
router.post('/save', save);
router.get('/save/:saveId', load);
export default router;
