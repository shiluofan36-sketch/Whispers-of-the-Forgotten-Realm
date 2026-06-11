import { Router } from 'express';
import { authRequired, adminOnly } from '../middleware/auth.js';
import { getAllPlayers, getPlayerDetail, banUser, unbanUser, deleteUser } from '../db/userDb.js';
import { getAllSuggestions, deleteSuggestion } from '../db/suggestionDb.js';
import { getLogs } from '../db/logDb.js';
import { getPlayerInventory, setPlayerInventory, getPlayerStorage, setPlayerStorage, getPlayerEquipment, setPlayerEquipment } from '../db/saveDb.js';

const router = Router();

// 所有管理员路由都需要 JWT + 管理员角色
router.use(authRequired, adminOnly);

// 玩家列表
router.get('/admin/players', async (req, res, next) => {
  try {
    const players = await getAllPlayers();
    res.json(players);
  } catch (err) { next(err); }
});

// 玩家详情
router.get('/admin/players/:id', async (req, res, next) => {
  try {
    const detail = await getPlayerDetail(parseInt(req.params.id));
    if (!detail) return res.status(404).json({ error: '玩家不存在' });
    res.json(detail);
  } catch (err) { next(err); }
});

// 所有意见
router.get('/admin/suggestions', async (req, res, next) => {
  try {
    const suggestions = await getAllSuggestions();
    res.json(suggestions);
  } catch (err) { next(err); }
});

// 删除意见
router.delete('/admin/suggestions/:id', async (req, res, next) => {
  try {
    await deleteSuggestion(parseInt(req.params.id));
    res.json({ success: true });
  } catch (err) { next(err); }
});

// 封禁用户
router.put('/admin/players/:id/ban', async (req, res, next) => {
  try {
    const { reason } = req.body;
    if (!reason) return res.status(400).json({ error: '需要封禁原因' });
    await banUser(parseInt(req.params.id), reason);
    res.json({ success: true });
  } catch (err) { next(err); }
});

// 解封用户
router.put('/admin/players/:id/unban', async (req, res, next) => {
  try {
    await unbanUser(parseInt(req.params.id));
    res.json({ success: true });
  } catch (err) { next(err); }
});

// 获取玩家物品
router.get('/admin/players/:id/inventory', async (req, res, next) => {
  try {
    const inventory = await getPlayerInventory(parseInt(req.params.id));
    res.json(inventory);
  } catch (err) { next(err); }
});

// 修改玩家物品
router.put('/admin/players/:id/inventory', async (req, res, next) => {
  try {
    const { inventory } = req.body;
    if (!Array.isArray(inventory)) {
      return res.status(400).json({ error: 'inventory must be an array' });
    }
    await setPlayerInventory(parseInt(req.params.id), inventory);
    res.json({ success: true });
  } catch (err) { next(err); }
});

// 仓库
router.get('/admin/players/:id/storage', async (req, res, next) => {
  try {
    const storage = await getPlayerStorage(parseInt(req.params.id));
    res.json(storage);
  } catch (err) { next(err); }
});

router.put('/admin/players/:id/storage', async (req, res, next) => {
  try {
    const { storage } = req.body;
    if (!Array.isArray(storage)) {
      return res.status(400).json({ error: 'storage must be an array' });
    }
    await setPlayerStorage(parseInt(req.params.id), storage);
    res.json({ success: true });
  } catch (err) { next(err); }
});

// 装备
router.get('/admin/players/:id/equipment', async (req, res, next) => {
  try {
    const equipment = await getPlayerEquipment(parseInt(req.params.id));
    res.json(equipment);
  } catch (err) { next(err); }
});

router.put('/admin/players/:id/equipment', async (req, res, next) => {
  try {
    const { equipment } = req.body;
    if (!equipment || typeof equipment !== 'object') {
      return res.status(400).json({ error: 'equipment must be an object' });
    }
    await setPlayerEquipment(parseInt(req.params.id), equipment);
    res.json({ success: true });
  } catch (err) { next(err); }
});

// 删除用户
router.delete('/admin/players/:id', async (req, res, next) => {
  try {
    await deleteUser(parseInt(req.params.id));
    res.json({ success: true });
  } catch (err) { next(err); }
});

// 登录日志
router.get('/admin/logs', async (req, res, next) => {
  try {
    const logs = await getLogs(100);
    res.json(logs);
  } catch (err) { next(err); }
});

export default router;
