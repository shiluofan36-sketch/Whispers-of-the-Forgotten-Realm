import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/index.js';
import {
  createUser,
  findUserByUsername,
  findUserById,
  verifyPassword,
  setNickname,
} from '../db/userDb.js';
import { writeLog } from '../db/logDb.js';
import { authRequired } from '../middleware/auth.js';

const router = Router();

// 注册
router.post('/auth/register', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: '用户名和密码不能为空' });
    }
    if (username.length < 2 || username.length > 20) {
      return res.status(400).json({ error: '用户名需 2-20 个字符' });
    }
    if (password.length < 4) {
      return res.status(400).json({ error: '密码至少 4 个字符' });
    }

    const existing = await findUserByUsername(username);
    if (existing) {
      return res.status(409).json({ error: '用户名已被注册' });
    }

    const user = await createUser(username, password);
    const token = jwt.sign({ id: user.id, username, role: 'player' }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    await writeLog(user.id, username, 'login');

    res.json({ token, role: 'player', nickname: null, username });
  } catch (err) { next(err); }
});

// 登录
router.post('/auth/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: '用户名和密码不能为空' });
    }

    const user = await findUserByUsername(username);
    if (!user) {
      return res.status(401).json({ error: '用户名或密码错误' });
    }

    const valid = await verifyPassword(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: '用户名或密码错误' });
    }

    if (user.banned) {
      return res.status(403).json({ error: `账号已被封禁。原因：${user.ban_reason || '违反社区规则'}` });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
    await writeLog(user.id, user.username, 'login');

    res.json({
      token,
      role: user.role,
      nickname: user.nickname,
      username: user.username,
    });
  } catch (err) { next(err); }
});

// 获取当前用户信息
router.get('/auth/me', authRequired, async (req, res, next) => {
  try {
    const user = await findUserById(req.user.id);
    if (!user) return res.status(404).json({ error: '用户不存在' });
    res.json(user);
  } catch (err) { next(err); }
});

// 设置昵称
router.put('/auth/nickname', authRequired, async (req, res, next) => {
  try {
    const { nickname } = req.body;
    if (!nickname || nickname.length < 1 || nickname.length > 12) {
      return res.status(400).json({ error: '昵称需 1-12 个字符' });
    }
    await setNickname(req.user.id, nickname);
    res.json({ nickname });
  } catch (err) { next(err); }
});

// 退出登录（记录日志）
router.post('/auth/logout', authRequired, async (req, res, next) => {
  try {
    await writeLog(req.user.id, req.user.username, 'logout');
    res.json({ success: true });
  } catch (err) { next(err); }
});

export default router;
