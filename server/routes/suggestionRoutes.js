import { Router } from 'express';
import { authRequired } from '../middleware/auth.js';
import { createSuggestion, getUserSuggestions } from '../db/suggestionDb.js';

const router = Router();

// 提交意见
router.post('/suggestions', authRequired, async (req, res, next) => {
  try {
    const { content } = req.body;
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: '内容不能为空' });
    }
    await createSuggestion(req.user.id, content.trim());
    res.json({ success: true });
  } catch (err) { next(err); }
});

// 查看自己的意见
router.get('/suggestions/mine', authRequired, async (req, res, next) => {
  try {
    const suggestions = await getUserSuggestions(req.user.id);
    res.json(suggestions);
  } catch (err) { next(err); }
});

export default router;
