// 精灵生成器 v3：64×64 普通 / 96×96 Boss，四方向独立设计
// 逻辑网格 32×32（每单位 2px），角色占 75-85% 画布
// 每个身体部位 3-4 层颜色（轮廓→暗面→基色→高光）
import { ALL_DIRS } from './spriteDirections';

const SPRITE_SIZE = 64;
const BOSS_SPRITE_SIZE = 96;
const G = 2; // 逻辑像素缩放因子 (64/32 = 2)

function mkCanvas(w, h) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const ctx = c.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  return { c, ctx };
}

// 逻辑像素绘制工具
function Px(gx) { return Math.floor(gx * G); }

// 绘制一个带层次的矩形块
// layers: [阴影色, 基色, 高光色] 或 [基色]
function block(ctx, x, y, w, h, ...colors) {
  if (colors.length >= 2) {
    ctx.fillStyle = colors[0];
    ctx.fillRect(Px(x + w), Px(y), Px(1), Px(h)); // 右暗边
    ctx.fillRect(Px(x), Px(y + h - 1), Px(w), Px(1)); // 下暗边
  }
  ctx.fillStyle = colors.length >= 2 ? colors[1] : colors[0];
  ctx.fillRect(Px(x), Px(y), Px(w), Px(h));
  if (colors.length >= 3) {
    ctx.fillStyle = colors[2];
    ctx.fillRect(Px(x), Px(y), Px(w), Px(1)); // 顶高光
    ctx.fillRect(Px(x), Px(y), Px(1), Px(h)); // 左高光
  }
}

// ============================================================
//  玩家 — 暗钢骑士（带披风、剑、盾）
// ============================================================

function drawPlayerDown(ctx, frame) {
  const bob = frame % 2;
  // 披风（背后）
  block(ctx, 12, 8, 8, 14, '#1a1a30', '#222240', '#2a2a48');
  // 腿
  block(ctx, 12, 21 + bob, 3, 7, '#1a1a28', '#223355', '#2a3d60');
  block(ctx, 17, 21 + bob, 3, 7, '#1a1a28', '#223355', '#2a3d60');
  // 靴
  block(ctx, 11, 27, 5, 3, '#332211', '#443322', '#554433');
  block(ctx, 16, 27, 5, 3, '#332211', '#443322', '#554433');
  // 身体（胸甲）
  block(ctx, 11, 7 + bob, 10, 14, '#334455', '#445566', '#556678');
  // 胸甲中缝 + 装饰
  block(ctx, 15, 9 + bob, 2, 10, '#556678', '#667788', '#7788aa');
  // 腰带
  block(ctx, 11, 20 + bob, 10, 2, '#553311', '#775522', '#997744');
  // 肩甲
  block(ctx, 9, 6 + bob, 3, 4, '#334455', '#445566', '#556678');
  block(ctx, 20, 6 + bob, 3, 4, '#334455', '#445566', '#556678');
  // 头盔
  block(ctx, 12, 0 + bob, 8, 7, '#334455', '#445566', '#556678');
  block(ctx, 13, -1 + bob, 6, 2, '#556678');
  // 面罩
  block(ctx, 13, 4 + bob, 6, 3, '#223344', '#334455');
  // 眼洞（发光）
  ctx.fillStyle = '#44ddff';
  ctx.fillRect(Px(14), Px(5 + bob), Px(2), Px(1));
  ctx.fillRect(Px(17), Px(5 + bob), Px(2), Px(1));
  // 盾牌（左手）
  block(ctx, 7, 9 + bob, 4, 10, '#2a3a50', '#3a4a60', '#4a5a78');
  block(ctx, 8, 11 + bob, 2, 6, '#556678', '#8899aa');
  // 剑（右手）
  block(ctx, 21, 4 + bob, 1, 17, '#778899', '#aabbcc', '#ddeeff');
  block(ctx, 20, 3 + bob, 3, 2, '#997744', '#bb9955');
}

function drawPlayerUp(ctx, frame) {
  const bob = frame % 2;
  // 披风（背面主视觉）
  block(ctx, 10, 8, 12, 16, '#151528', '#1e1e38', '#262648');
  block(ctx, 11, 9, 10, 14, '#1e1e38', '#262648', '#2e2e50');
  // 剑在背上（斜跨）
  block(ctx, 20, 2 + bob, 2, 20, '#667788', '#8899aa', '#aabbcc');
  block(ctx, 19, 1 + bob, 4, 2, '#886633', '#aa8844');
  // 腿（只露下部）
  block(ctx, 12, 22 + bob, 3, 6, '#1a1a28', '#223355');
  block(ctx, 17, 22 + bob, 3, 6, '#1a1a28', '#223355');
  block(ctx, 11, 27, 5, 2, '#332211', '#443322');
  block(ctx, 16, 27, 5, 2, '#332211', '#443322');
  // 背甲
  block(ctx, 11, 7 + bob, 10, 14, '#2a3a50', '#3a4a60', '#445670');
  // 腰带（背面）
  block(ctx, 11, 20 + bob, 10, 2, '#553311', '#664422');
  // 肩甲（背面）
  block(ctx, 9, 6 + bob, 4, 4, '#2a3a50', '#3a4a60', '#445670');
  block(ctx, 19, 6 + bob, 4, 4, '#2a3a50', '#3a4a60', '#445670');
  // 头盔（背面：只有后脑勺）
  block(ctx, 12, 0 + bob, 8, 7, '#334455', '#3a4a60', '#445670');
}

function drawPlayerLeft(ctx, frame) {
  const bob = frame % 2;
  // 披风
  block(ctx, 12, 8, 10, 14, '#1a1a30', '#222240');
  // 后腿
  block(ctx, 16, 21 + bob, 3, 6, '#1a1a28', '#1e2e42');
  // 前腿
  block(ctx, 11, 21 + bob, 3, 7, '#1a1a28', '#223355', '#2a3d60');
  // 靴
  block(ctx, 10, 27, 5, 2, '#332211', '#443322');
  block(ctx, 15, 26, 5, 2, '#332211', '#3a2a1a');
  // 身体侧面
  block(ctx, 11, 7 + bob, 10, 14, '#334455', '#3d4e62', '#4a5c72');
  // 腰带
  block(ctx, 11, 20 + bob, 10, 2, '#553311', '#775522');
  // 肩甲
  block(ctx, 10, 6 + bob, 11, 3, '#2a3a50', '#3a4a60', '#4a5c72');
  // 头盔侧面
  block(ctx, 12, 0 + bob, 9, 7, '#334455', '#3d4e62', '#4a5c72');
  // 面罩侧面（一个眼洞）
  block(ctx, 12, 4 + bob, 7, 3, '#223344', '#2d3e50');
  ctx.fillStyle = '#44ddff';
  ctx.fillRect(Px(13), Px(5 + bob), Px(2), Px(1));
  // 剑（前侧，右手）
  block(ctx, 20, 5 + bob, 1, 16, '#778899', '#aabbcc', '#ddeeff');
  block(ctx, 19, 4 + bob, 3, 2, '#997744', '#bb9955');
  // 盾牌（后侧，左手）
  block(ctx, 7, 8 + bob, 3, 9, '#2a3a50', '#3a4a60');
}

function drawPlayerRight(ctx, frame) {
  const bob = frame % 2;
  // 披风
  block(ctx, 10, 8, 10, 14, '#1a1a30', '#222240');
  // 后腿
  block(ctx, 13, 21 + bob, 3, 6, '#1a1a28', '#1e2e42');
  // 前腿
  block(ctx, 18, 21 + bob, 3, 7, '#1a1a28', '#223355', '#2a3d60');
  // 靴
  block(ctx, 17, 27, 5, 2, '#332211', '#443322');
  block(ctx, 12, 26, 5, 2, '#332211', '#3a2a1a');
  // 身体侧面
  block(ctx, 11, 7 + bob, 10, 14, '#334455', '#3d4e62', '#4a5c72');
  // 腰带
  block(ctx, 11, 20 + bob, 10, 2, '#553311', '#775522');
  // 肩甲
  block(ctx, 11, 6 + bob, 11, 3, '#2a3a50', '#3a4a60', '#4a5c72');
  // 头盔侧面（右向）
  block(ctx, 11, 0 + bob, 9, 7, '#334455', '#3d4e62', '#4a5c72');
  // 面罩（一眼）
  block(ctx, 13, 4 + bob, 7, 3, '#223344', '#2d3e50');
  ctx.fillStyle = '#44ddff';
  ctx.fillRect(Px(17), Px(5 + bob), Px(2), Px(1));
  // 盾牌（前侧，左手）
  block(ctx, 8, 8 + bob, 4, 10, '#2a3a50', '#3a4a60', '#4a5a78');
  block(ctx, 9, 10 + bob, 2, 6, '#556678', '#8899aa');
  // 剑（背在右侧）
  block(ctx, 21, 5 + bob, 1, 14, '#667788', '#8899aa');
}

// ============================================================
//  哥布林 — 矮小绿皮，大耳朵，小匕首
// ============================================================

function drawGoblinDown(ctx, frame) {
  const bob = frame % 2;
  // 腿
  block(ctx, 12, 23 + bob, 3, 6, '#338833', '#44aa44');
  block(ctx, 17, 23 + bob, 3, 6, '#338833', '#44aa44');
  block(ctx, 11, 28, 5, 2, '#664422', '#775533');
  block(ctx, 16, 28, 5, 2, '#664422', '#775533');
  // 身体
  block(ctx, 11, 14 + bob, 10, 10, '#338833', '#44aa44', '#55bb55');
  // 破背心
  block(ctx, 12, 15 + bob, 8, 3, '#887755', '#998866');
  // 头
  block(ctx, 11, 3 + bob, 10, 10, '#44aa44', '#55bb55', '#66cc66');
  // 脸
  block(ctx, 14, 7 + bob, 4, 4, '#ccaa66', '#ddbb77');
  // 眼睛（大黄）
  ctx.fillStyle = '#ffdd00';
  ctx.fillRect(Px(14), Px(8 + bob), Px(2), Px(2));
  ctx.fillRect(Px(17), Px(8 + bob), Px(2), Px(2));
  ctx.fillStyle = '#111111';
  ctx.fillRect(Px(15), Px(9 + bob), Px(1), Px(1));
  ctx.fillRect(Px(18), Px(9 + bob), Px(1), Px(1));
  // 大耳朵
  block(ctx, 8, 3 + bob, 3, 6, '#339933', '#44aa44', '#66bb55');
  block(ctx, 21, 3 + bob, 3, 6, '#339933', '#44aa44', '#66bb55');
  // 匕首
  block(ctx, 21, 17 + bob, 1, 6, '#666666', '#999999', '#bbbbbb');
  block(ctx, 20, 16 + bob, 3, 1, '#888888', '#aaaaaa');
}

function drawGoblinUp(ctx, frame) {
  const bob = frame % 2;
  block(ctx, 12, 22 + bob, 3, 5, '#338833', '#3a9944');
  block(ctx, 17, 22 + bob, 3, 5, '#338833', '#3a9944');
  block(ctx, 11, 27, 5, 2, '#553311');
  block(ctx, 16, 27, 5, 2, '#553311');
  block(ctx, 11, 13 + bob, 10, 10, '#338833', '#3a9944');
  // 背后破背心
  block(ctx, 12, 15 + bob, 8, 3, '#776644');
  // 后脑勺
  block(ctx, 11, 2 + bob, 10, 10, '#339933', '#3a9944', '#44aa55');
  // 耳朵（背面可见）
  block(ctx, 7, 2 + bob, 4, 5, '#339933', '#3a9944');
  block(ctx, 21, 2 + bob, 4, 5, '#339933', '#3a9944');
}

function drawGoblinLeft(ctx, frame) {
  const bob = frame % 2;
  block(ctx, 15, 22 + bob, 3, 5, '#338833');
  block(ctx, 10, 22 + bob, 3, 7, '#338833', '#44aa44');
  block(ctx, 9, 28, 5, 2, '#553311');
  block(ctx, 15, 27, 5, 2, '#553311');
  block(ctx, 10, 13 + bob, 11, 10, '#338833', '#3a9944', '#44aa55');
  block(ctx, 11, 15 + bob, 8, 3, '#776644');
  // 头侧面
  block(ctx, 10, 2 + bob, 11, 10, '#3a9944', '#44aa55', '#55bb66');
  block(ctx, 10, 7 + bob, 5, 4, '#ccaa66');
  ctx.fillStyle = '#ffdd00'; ctx.fillRect(Px(11), Px(8 + bob), Px(2), Px(2));
  ctx.fillStyle = '#111111'; ctx.fillRect(Px(12), Px(9 + bob), Px(1), Px(1));
  block(ctx, 7, 2 + bob, 3, 6, '#339933', '#44aa44');
  block(ctx, 21, 2 + bob, 3, 6, '#339933', '#3a9944');
  // 匕首
  block(ctx, 21, 14 + bob, 1, 6, '#666666', '#999999', '#bbbbbb');
}

function drawGoblinRight(ctx, frame) {
  const bob = frame % 2;
  block(ctx, 14, 22 + bob, 3, 5, '#338833');
  block(ctx, 19, 22 + bob, 3, 7, '#338833', '#44aa44');
  block(ctx, 18, 28, 5, 2, '#553311');
  block(ctx, 12, 27, 5, 2, '#553311');
  block(ctx, 11, 13 + bob, 11, 10, '#338833', '#3a9944', '#44aa55');
  block(ctx, 12, 15 + bob, 8, 3, '#776644');
  block(ctx, 11, 2 + bob, 11, 10, '#3a9944', '#44aa55', '#55bb66');
  block(ctx, 17, 7 + bob, 5, 4, '#ccaa66');
  ctx.fillStyle = '#ffdd00'; ctx.fillRect(Px(19), Px(8 + bob), Px(2), Px(2));
  ctx.fillStyle = '#111111'; ctx.fillRect(Px(20), Px(9 + bob), Px(1), Px(1));
  block(ctx, 22, 2 + bob, 3, 6, '#339933', '#44aa44');
  block(ctx, 8, 2 + bob, 3, 6, '#339933', '#3a9944');
  block(ctx, 10, 14 + bob, 1, 6, '#666666', '#999999');
}

// ============================================================
//  骷髅兵 — 白骨，眼窝深邃
// ============================================================

function drawSkeletonDown(ctx, frame) {
  const bob = frame % 2;
  // 腿骨
  block(ctx, 14, 24 + bob, 2, 7, '#c8c0b0', '#d8d0c0', '#e8e0d0');
  block(ctx, 17, 24 + bob, 2, 7, '#c8c0b0', '#d8d0c0', '#e8e0d0');
  // 骨盆
  block(ctx, 12, 20 + bob, 9, 4, '#b8b0a0', '#c8c0b0', '#d8d0c0');
  // 肋骨笼
  block(ctx, 12, 9 + bob, 9, 11, '#b8b0a0', '#c8c0b0', '#d8d0c0');
  // 肋骨横纹
  for (let i = 0; i < 3; i++) {
    ctx.fillStyle = '#988880';
    ctx.fillRect(Px(13), Px(11 + i * 3 + bob), Px(7), Px(1));
  }
  // 肩胛
  block(ctx, 10, 8 + bob, 13, 2, '#c8c0b0', '#ddd8cc');
  // 头骨
  block(ctx, 12, 0 + bob, 9, 9, '#c8c0b0', '#d8d0c0', '#e8e0d0');
  // 眼窝
  ctx.fillStyle = '#111111';
  ctx.fillRect(Px(14), Px(3 + bob), Px(3), Px(3));
  ctx.fillRect(Px(17), Px(3 + bob), Px(3), Px(3));
  // 下颌
  block(ctx, 14, 9 + bob, 5, 3, '#b8b0a0', '#c8b8a8');
  // 臂骨
  block(ctx, 8, 10 + bob, 4, 2, '#c8c0b0', '#d8d0c0');
  block(ctx, 21, 10 + bob, 4, 2, '#c8c0b0', '#d8d0c0');
}

function drawSkeletonUp(ctx, frame) {
  const bob = frame % 2;
  block(ctx, 14, 23 + bob, 2, 6, '#b8b0a0', '#c8c0b0');
  block(ctx, 17, 23 + bob, 2, 6, '#b8b0a0', '#c8c0b0');
  block(ctx, 12, 19 + bob, 9, 4, '#b8b0a0', '#c0b8a8');
  block(ctx, 12, 8 + bob, 9, 11, '#b8b0a0', '#c0b8a8', '#d0c8b8');
  // 脊椎（背面可见）
  for (let i = 0; i < 4; i++) {
    ctx.fillStyle = '#a89880';
    ctx.fillRect(Px(15), Px(10 + i * 3 + bob), Px(3), Px(1));
  }
  block(ctx, 10, 7 + bob, 13, 2, '#c0b8a8', '#d0c8b8');
  // 后脑勺
  block(ctx, 12, -1 + bob, 9, 9, '#b8b0a0', '#c8c0b0', '#d8d0c0');
  block(ctx, 8, 9 + bob, 4, 2, '#c0b8a8');
  block(ctx, 21, 9 + bob, 4, 2, '#c0b8a8');
}

function drawSkeletonLeft(ctx, frame) {
  const bob = frame % 2;
  block(ctx, 16, 23 + bob, 2, 6, '#b8b0a0');
  block(ctx, 13, 23 + bob, 2, 7, '#c0b8a8', '#d0c8b8');
  block(ctx, 10, 19 + bob, 10, 4, '#b8b0a8', '#c0b8a8');
  block(ctx, 10, 8 + bob, 10, 11, '#b8b0a8', '#c0b8a8', '#d0c8b8');
  for (let i = 0; i < 3; i++) {
    ctx.fillStyle = '#988880';
    ctx.fillRect(Px(12), Px(10 + i * 3 + bob), Px(7), Px(1));
  }
  block(ctx, 9, 7 + bob, 14, 2, '#c0b8a8', '#d0c8b8');
  // 头骨侧面
  block(ctx, 11, -1 + bob, 10, 9, '#c0b8a8', '#d0c8b8', '#e0d8c8');
  ctx.fillStyle = '#111111';
  ctx.fillRect(Px(12), Px(3 + bob), Px(2), Px(3));
  // 臂骨（前伸）
  block(ctx, 5, 9 + bob, 6, 2, '#c0b8a8', '#d0c8b8');
  block(ctx, 21, 9 + bob, 3, 2, '#b8b0a8');
}

function drawSkeletonRight(ctx, frame) {
  const bob = frame % 2;
  block(ctx, 14, 23 + bob, 2, 6, '#b8b0a0');
  block(ctx, 18, 23 + bob, 2, 7, '#c0b8a8', '#d0c8b8');
  block(ctx, 12, 19 + bob, 10, 4, '#b8b0a8', '#c0b8a8');
  block(ctx, 12, 8 + bob, 10, 11, '#b8b0a8', '#c0b8a8', '#d0c8b8');
  for (let i = 0; i < 3; i++) {
    ctx.fillStyle = '#988880';
    ctx.fillRect(Px(13), Px(10 + i * 3 + bob), Px(7), Px(1));
  }
  block(ctx, 9, 7 + bob, 14, 2, '#c0b8a8', '#d0c8b8');
  block(ctx, 11, -1 + bob, 10, 9, '#c0b8a8', '#d0c8b8', '#e0d8c8');
  ctx.fillStyle = '#111111';
  ctx.fillRect(Px(18), Px(3 + bob), Px(2), Px(3));
  block(ctx, 8, 9 + bob, 3, 2, '#b8b0a8');
  block(ctx, 22, 9 + bob, 5, 2, '#c0b8a8', '#d0c8b8');
}

// ============================================================
//  史莱姆 — 圆润 blob，方向差异小但仍有立体感
// ============================================================

function drawSlimeDown(ctx, frame) {
  const wb = Math.sin(frame * 1.5) * 1;
  // 底部宽
  block(ctx, 7, 26 + wb, 18, 5, '#339944', '#44aa55', '#55bb66');
  // 中部
  block(ctx, 8, 22 + wb, 16, 6, '#339944', '#44aa55', '#66cc77');
  // 上部
  block(ctx, 10, 18 + wb, 12, 6, '#339944', '#55bb66', '#77dd88');
  // 顶冠
  block(ctx, 13, 15 + wb, 6, 4, '#339944', '#66cc77', '#88ee99');
  // 高光斑
  block(ctx, 12, 17 + wb, 3, 2, '#aaeeaa', '#ccffcc');
  // 眼白
  block(ctx, 11, 19 + wb, 5, 4, '#ffffff');
  block(ctx, 17, 19 + wb, 5, 4, '#ffffff');
  // 瞳孔
  ctx.fillStyle = '#111111';
  ctx.fillRect(Px(13), Px(21 + wb), Px(2), Px(2));
  ctx.fillRect(Px(19), Px(21 + wb), Px(2), Px(2));
}

function drawSlimeUp(ctx, frame) {
  const wb = Math.sin(frame * 1.5) * 1;
  block(ctx, 7, 26 + wb, 18, 5, '#339944', '#44aa55');
  block(ctx, 8, 22 + wb, 16, 6, '#339944', '#44aa55');
  block(ctx, 10, 18 + wb, 12, 6, '#339944', '#55bb66');
  block(ctx, 13, 15 + wb, 6, 4, '#339944', '#55bb66');
  block(ctx, 12, 17 + wb, 3, 2, '#88dd88');
}

function drawSlimeLeft(ctx, frame) {
  const wb = Math.sin(frame * 1.5) * 1;
  block(ctx, 6, 26 + wb, 18, 5, '#339944', '#44aa55');
  block(ctx, 7, 22 + wb, 17, 6, '#339944', '#44aa55', '#55bb66');
  block(ctx, 9, 18 + wb, 14, 6, '#339944', '#55bb66', '#66cc77');
  block(ctx, 12, 15 + wb, 8, 4, '#339944', '#55bb66');
  block(ctx, 10, 17 + wb, 3, 2, '#aaeeaa');
  // 一只眼（侧面）
  block(ctx, 10, 19 + wb, 4, 3, '#ffffff');
  ctx.fillStyle = '#111111';
  ctx.fillRect(Px(12), Px(20 + wb), Px(2), Px(2));
}

function drawSlimeRight(ctx, frame) {
  const wb = Math.sin(frame * 1.5) * 1;
  block(ctx, 8, 26 + wb, 18, 5, '#339944', '#44aa55');
  block(ctx, 8, 22 + wb, 17, 6, '#339944', '#44aa55', '#55bb66');
  block(ctx, 9, 18 + wb, 14, 6, '#339944', '#55bb66', '#66cc77');
  block(ctx, 12, 15 + wb, 8, 4, '#339944', '#55bb66');
  block(ctx, 14, 17 + wb, 3, 2, '#aaeeaa');
  block(ctx, 18, 19 + wb, 4, 3, '#ffffff');
  ctx.fillStyle = '#111111';
  ctx.fillRect(Px(19), Px(20 + wb), Px(2), Px(2));
}

// ============================================================
//  暗影 — 飘忽的斗篷，无实体腿
// ============================================================

function drawShadowDown(ctx, frame) {
  const ph = Math.sin(frame * 1.5) * 1;
  // 底部飘忽
  block(ctx, 6 - ph, 28, 20 + ph * 2, 3, 'rgba(60,10,100,0.4)', 'rgba(80,20,140,0.6)');
  // 斗篷主体
  block(ctx, 7 - ph, 6, 18 + ph * 2, 22, 'rgba(60,10,100,0.6)', 'rgba(100,30,170,0.7)', 'rgba(130,50,200,0.8)');
  // 头部
  block(ctx, 11, 0, 10, 8, 'rgba(60,10,100,0.7)', 'rgba(140,60,210,0.7)');
  // 发光眼
  ctx.fillStyle = '#ff44ff';
  ctx.fillRect(Px(13), Px(3), Px(2), Px(2));
  ctx.fillRect(Px(17), Px(3), Px(2), Px(2));
}

function drawShadowUp(ctx, frame) {
  const ph = Math.sin(frame * 1.5) * 1;
  block(ctx, 6 - ph, 28, 20 + ph * 2, 3, 'rgba(40,5,70,0.4)', 'rgba(60,10,100,0.5)');
  block(ctx, 7 - ph, 6, 18 + ph * 2, 22, 'rgba(40,5,70,0.5)', 'rgba(70,15,120,0.6)');
  block(ctx, 11, 0, 10, 7, 'rgba(40,5,70,0.6)', 'rgba(80,20,130,0.6)');
}

function drawShadowLeft(ctx, frame) {
  const ph = Math.sin(frame * 1.5) * 1;
  block(ctx, 5 - ph, 28, 20 + ph * 2, 3, 'rgba(60,10,100,0.4)', 'rgba(80,20,140,0.5)');
  block(ctx, 6 - ph, 5, 19 + ph * 2, 23, 'rgba(60,10,100,0.5)', 'rgba(100,30,170,0.7)');
  block(ctx, 10, 0, 11, 8, 'rgba(60,10,100,0.7)', 'rgba(130,50,200,0.7)');
  ctx.fillStyle = '#ff44ff';
  ctx.fillRect(Px(11), Px(3), Px(2), Px(2));
}

function drawShadowRight(ctx, frame) {
  const ph = Math.sin(frame * 1.5) * 1;
  block(ctx, 6 - ph, 28, 20 + ph * 2, 3, 'rgba(60,10,100,0.4)', 'rgba(80,20,140,0.5)');
  block(ctx, 7 - ph, 5, 19 + ph * 2, 23, 'rgba(60,10,100,0.5)', 'rgba(100,30,170,0.7)');
  block(ctx, 11, 0, 11, 8, 'rgba(60,10,100,0.7)', 'rgba(130,50,200,0.7)');
  ctx.fillStyle = '#ff44ff';
  ctx.fillRect(Px(19), Px(3), Px(2), Px(2));
}

// ============================================================
//  巨鼠
// ============================================================

function drawRatDown(ctx, frame) {
  const bob = frame % 2;
  // 身体
  block(ctx, 9, 17 + bob, 14, 8, '#887744', '#997755', '#aa8866');
  // 头
  block(ctx, 4, 13 + bob, 9, 7, '#997755', '#aa8866', '#bb9977');
  // 耳朵
  block(ctx, 5, 9 + bob, 3, 4, '#997755', '#cc9966', '#ddaa77');
  block(ctx, 10, 9 + bob, 3, 4, '#997755', '#cc9966', '#ddaa77');
  // 眼睛（红色）
  ctx.fillStyle = '#ff0000';
  ctx.fillRect(Px(6), Px(15 + bob), Px(2), Px(2));
  ctx.fillRect(Px(9), Px(15 + bob), Px(2), Px(2));
  // 尾巴
  block(ctx, 23, 20 + bob, 6, 1, '#886633', '#997744');
  // 腿
  block(ctx, 12, 25 + bob, 3, 4, '#886633', '#997744');
  block(ctx, 19, 25 + bob, 3, 4, '#886633', '#997744');
  block(ctx, 11, 29, 4, 2, '#553311');
  block(ctx, 18, 29, 4, 2, '#553311');
}

function drawRatUp(ctx, frame) {
  const bob = frame % 2;
  block(ctx, 9, 17 + bob, 14, 8, '#776633', '#887744');
  block(ctx, 4, 13 + bob, 9, 7, '#776633', '#887744', '#997755');
  block(ctx, 5, 9 + bob, 3, 4, '#886633');
  block(ctx, 10, 9 + bob, 3, 4, '#886633');
  block(ctx, 23, 20 + bob, 6, 1, '#775522');
  block(ctx, 12, 25 + bob, 3, 4, '#776633', '#887744');
  block(ctx, 19, 25 + bob, 3, 4, '#776633', '#887744');
  block(ctx, 11, 29, 4, 2, '#443322');
  block(ctx, 18, 29, 4, 2, '#443322');
}

function drawRatLeft(ctx, frame) {
  const bob = frame % 2;
  block(ctx, 8, 17 + bob, 15, 8, '#887744', '#997755');
  block(ctx, 3, 13 + bob, 10, 7, '#997755', '#aa8866', '#bb9977');
  block(ctx, 4, 8 + bob, 3, 5, '#997755', '#cc9966');
  block(ctx, 10, 8 + bob, 3, 5, '#997755');
  ctx.fillStyle = '#ff0000'; ctx.fillRect(Px(5), Px(15 + bob), Px(2), Px(2));
  block(ctx, 24, 19 + bob, 5, 1, '#886633');
  block(ctx, 11, 25 + bob, 3, 4, '#886633', '#997744');
  block(ctx, 18, 25 + bob, 3, 4, '#886633');
  block(ctx, 11, 29, 4, 2, '#553311');
  block(ctx, 17, 29, 4, 2, '#443322');
}

function drawRatRight(ctx, frame) {
  const bob = frame % 2;
  block(ctx, 9, 17 + bob, 15, 8, '#887744', '#997755');
  block(ctx, 5, 13 + bob, 10, 7, '#997755', '#aa8866', '#bb9977');
  block(ctx, 12, 8 + bob, 3, 5, '#997755', '#cc9966');
  block(ctx, 7, 8 + bob, 3, 5, '#997755');
  ctx.fillStyle = '#ff0000'; ctx.fillRect(Px(9), Px(15 + bob), Px(2), Px(2));
  block(ctx, 3, 19 + bob, 5, 1, '#886633');
  block(ctx, 13, 25 + bob, 3, 4, '#886633');
  block(ctx, 20, 25 + bob, 3, 4, '#886633', '#997744');
  block(ctx, 12, 29, 4, 2, '#443322');
  block(ctx, 20, 29, 4, 2, '#553311');
}

// ============================================================
//  邪教徒
// ============================================================

function drawCultistDown(ctx, frame) {
  const bob = frame % 2;
  // 长袍
  block(ctx, 10, 11 + bob, 12, 20, '#331133', '#442244', '#553355');
  // 兜帽
  block(ctx, 10, 0 + bob, 12, 8, '#331133', '#442244', '#553355');
  // 兜帽尖
  block(ctx, 14, -2 + bob, 4, 3, '#331133', '#442244');
  // 脸（暗影中）
  block(ctx, 13, 5 + bob, 6, 3, '#221122', '#331133');
  // 红眼
  ctx.fillStyle = '#ff4444';
  ctx.fillRect(Px(14), Px(6 + bob), Px(2), Px(1));
  ctx.fillRect(Px(17), Px(6 + bob), Px(2), Px(1));
  // 法杖
  block(ctx, 24, 6 + bob, 1, 18, '#553311', '#664422');
  block(ctx, 22, 5 + bob, 5, 4, '#ff3355', '#ff4466', '#ff6688');
}

function drawCultistUp(ctx, frame) {
  const bob = frame % 2;
  block(ctx, 10, 11 + bob, 12, 20, '#331133', '#3a1a3a');
  block(ctx, 10, -1 + bob, 12, 8, '#331133', '#3a1a3a', '#442244');
  block(ctx, 14, -3 + bob, 4, 3, '#331133', '#3a1a3a');
  block(ctx, 24, 6 + bob, 1, 16, '#553311', '#664422');
  block(ctx, 22, 5 + bob, 5, 4, '#cc2244', '#dd3355');
}

function drawCultistLeft(ctx, frame) {
  const bob = frame % 2;
  block(ctx, 9, 11 + bob, 13, 20, '#331133', '#442244');
  block(ctx, 9, 0 + bob, 13, 8, '#331133', '#442244', '#553355');
  block(ctx, 13, -2 + bob, 4, 3, '#331133');
  block(ctx, 12, 5 + bob, 7, 3, '#221122', '#331133');
  ctx.fillStyle = '#ff4444'; ctx.fillRect(Px(13), Px(6 + bob), Px(2), Px(1));
  block(ctx, 24, 6 + bob, 1, 16, '#553311', '#664422');
  block(ctx, 22, 5 + bob, 5, 4, '#ff3355', '#ff4466');
}

function drawCultistRight(ctx, frame) {
  const bob = frame % 2;
  block(ctx, 10, 11 + bob, 13, 20, '#331133', '#442244');
  block(ctx, 10, 0 + bob, 13, 8, '#331133', '#442244', '#553355');
  block(ctx, 15, -2 + bob, 4, 3, '#331133');
  block(ctx, 13, 5 + bob, 7, 3, '#221122', '#331133');
  ctx.fillStyle = '#ff4444'; ctx.fillRect(Px(17), Px(6 + bob), Px(2), Px(1));
  block(ctx, 7, 6 + bob, 1, 16, '#553311', '#664422');
  block(ctx, 5, 5 + bob, 5, 4, '#ff3355', '#ff4466');
}

// ============================================================
//  狼
// ============================================================

function drawWolfDown(ctx, frame) {
  const bob = frame % 2;
  block(ctx, 9, 17 + bob, 14, 7, '#444455', '#555566', '#606070');
  block(ctx, 12, 15 + bob, 10, 3, '#333344', '#444455');
  block(ctx, 4, 12 + bob, 9, 7, '#505060', '#606070');
  block(ctx, 5, 8 + bob, 2, 4, '#444455');
  block(ctx, 9, 8 + bob, 2, 4, '#444455');
  ctx.fillStyle = '#ffcc00'; ctx.fillRect(Px(6), Px(14 + bob), Px(2), Px(2));
  ctx.fillStyle = '#ffcc00'; ctx.fillRect(Px(9), Px(14 + bob), Px(2), Px(2));
  block(ctx, 23, 14 + bob, 5, 2, '#444455', '#555566');
  block(ctx, 12, 24 + bob, 2, 5, '#3a3a4a', '#4a4a5a');
  block(ctx, 19, 24 + bob, 2, 5, '#3a3a4a', '#4a4a5a');
  block(ctx, 10, 29, 4, 2, '#222233');
  block(ctx, 18, 29, 4, 2, '#222233');
}

function drawWolfUp(ctx, frame) {
  const bob = frame % 2;
  block(ctx, 9, 17 + bob, 14, 7, '#3a3a4a', '#444455');
  block(ctx, 12, 15 + bob, 10, 3, '#2a2a3a', '#333344');
  block(ctx, 4, 12 + bob, 9, 7, '#3a3a4a', '#444455', '#505060');
  block(ctx, 5, 8 + bob, 2, 4, '#3a3a4a');
  block(ctx, 9, 8 + bob, 2, 4, '#3a3a4a');
  block(ctx, 23, 14 + bob, 5, 2, '#3a3a4a', '#444455');
  block(ctx, 12, 24 + bob, 2, 5, '#3a3a4a');
  block(ctx, 19, 24 + bob, 2, 5, '#3a3a4a');
  block(ctx, 10, 29, 4, 2, '#1a1a2a');
  block(ctx, 18, 29, 4, 2, '#1a1a2a');
}

function drawWolfLeft(ctx, frame) {
  const bob = frame % 2;
  block(ctx, 8, 17 + bob, 15, 7, '#444455', '#555566');
  block(ctx, 11, 15 + bob, 11, 3, '#333344', '#444455');
  block(ctx, 3, 12 + bob, 10, 7, '#505060', '#606070');
  block(ctx, 4, 7 + bob, 2, 5, '#444455');
  block(ctx, 9, 7 + bob, 2, 5, '#444455');
  ctx.fillStyle = '#ffcc00'; ctx.fillRect(Px(5), Px(14 + bob), Px(2), Px(2));
  block(ctx, 23, 14 + bob, 4, 2, '#444455');
  block(ctx, 11, 24 + bob, 2, 5, '#3a3a4a', '#4a4a5a');
  block(ctx, 19, 24 + bob, 2, 5, '#3a3a4a');
  block(ctx, 10, 29, 4, 2, '#222233');
  block(ctx, 18, 29, 4, 2, '#1a1a2a');
}

function drawWolfRight(ctx, frame) {
  const bob = frame % 2;
  block(ctx, 9, 17 + bob, 15, 7, '#444455', '#555566');
  block(ctx, 10, 15 + bob, 11, 3, '#333344', '#444455');
  block(ctx, 5, 12 + bob, 10, 7, '#505060', '#606070');
  block(ctx, 12, 7 + bob, 2, 5, '#444455');
  block(ctx, 7, 7 + bob, 2, 5, '#444455');
  ctx.fillStyle = '#ffcc00'; ctx.fillRect(Px(9), Px(14 + bob), Px(2), Px(2));
  block(ctx, 5, 14 + bob, 4, 2, '#444455');
  block(ctx, 13, 24 + bob, 2, 5, '#3a3a4a');
  block(ctx, 20, 24 + bob, 2, 5, '#3a3a4a', '#4a4a5a');
  block(ctx, 12, 29, 4, 2, '#1a1a2a');
  block(ctx, 20, 29, 4, 2, '#222233');
}

// ============================================================
//  远古巨龙 Boss（96×96，48 逻辑格）
// ============================================================

function drawDragonDown(ctx, frame) {
  const bob = frame % 2;
  // 身躯
  block(ctx, 6, 18 + bob, 36, 20, '#aa1100', '#cc2200', '#ee4422');
  // 鳞片高光
  block(ctx, 16, 20 + bob, 16, 6, '#cc2200', '#ee4422', '#ff6644');
  // 翅膀
  block(ctx, 2, 5 + bob, 12, 16, '#880000', '#aa1100', '#cc2200');
  block(ctx, 34, 5 + bob, 12, 16, '#880000', '#aa1100', '#cc2200');
  // 头
  block(ctx, 2, 13 + bob, 14, 11, '#aa1100', '#dd3300', '#ff4400');
  // 角
  block(ctx, 3, 5 + bob, 4, 9, '#663300', '#884400');
  block(ctx, 13, 5 + bob, 4, 9, '#663300', '#884400');
  // 眼
  block(ctx, 6, 15 + bob, 5, 3, '#ff4400', '#ff6600');
  // 腿
  block(ctx, 8, 36 + bob, 7, 10, '#881100', '#aa1800');
  block(ctx, 33, 36 + bob, 7, 10, '#881100', '#aa1800');
  // 尾
  block(ctx, 40, 20 + bob, 7, 5, '#aa1100', '#cc2200');
}

function drawDragonUp(ctx, frame) {
  const bob = frame % 2;
  block(ctx, 6, 18 + bob, 36, 20, '#880000', '#aa1100', '#bb2200');
  block(ctx, 16, 20 + bob, 16, 6, '#aa1100', '#cc2200');
  block(ctx, 2, 5 + bob, 12, 16, '#660000', '#880000');
  block(ctx, 34, 5 + bob, 12, 16, '#660000', '#880000');
  block(ctx, 2, 13 + bob, 14, 11, '#880000', '#aa1100', '#cc2200');
  block(ctx, 3, 5 + bob, 4, 9, '#552200');
  block(ctx, 13, 5 + bob, 4, 9, '#552200');
  block(ctx, 8, 36 + bob, 7, 10, '#661100', '#881100');
  block(ctx, 33, 36 + bob, 7, 10, '#661100', '#881100');
  block(ctx, 40, 20 + bob, 7, 5, '#880000', '#aa1100');
}

function drawDragonLeft(ctx, frame) {
  const bob = frame % 2;
  block(ctx, 5, 18 + bob, 37, 20, '#880000', '#aa1100', '#cc2200');
  block(ctx, 15, 20 + bob, 17, 6, '#aa1100', '#ee4422');
  block(ctx, 1, 5 + bob, 13, 16, '#660000', '#880000');
  block(ctx, 34, 5 + bob, 13, 16, '#660000', '#aa1100');
  block(ctx, 1, 12 + bob, 15, 11, '#880000', '#cc2200', '#ff4400');
  block(ctx, 2, 4 + bob, 4, 9, '#663300', '#884400');
  block(ctx, 12, 4 + bob, 4, 9, '#663300');
  block(ctx, 5, 15 + bob, 4, 3, '#ff4400');
  block(ctx, 7, 36 + bob, 7, 10, '#771000', '#991800');
  block(ctx, 34, 36 + bob, 7, 10, '#771000');
  block(ctx, 41, 19 + bob, 7, 5, '#880000', '#aa1100');
}

function drawDragonRight(ctx, frame) {
  const bob = frame % 2;
  block(ctx, 6, 18 + bob, 37, 20, '#880000', '#aa1100', '#cc2200');
  block(ctx, 16, 20 + bob, 17, 6, '#aa1100', '#ee4422');
  block(ctx, 34, 5 + bob, 13, 16, '#660000', '#aa1100');
  block(ctx, 1, 5 + bob, 13, 16, '#660000', '#880000');
  block(ctx, 32, 12 + bob, 15, 11, '#880000', '#cc2200', '#ff4400');
  block(ctx, 42, 4 + bob, 4, 9, '#663300', '#884400');
  block(ctx, 32, 4 + bob, 4, 9, '#663300');
  block(ctx, 39, 15 + bob, 4, 3, '#ff4400');
  block(ctx, 8, 36 + bob, 7, 10, '#771000');
  block(ctx, 33, 36 + bob, 7, 10, '#771000', '#991800');
  block(ctx, 0, 19 + bob, 7, 5, '#880000', '#aa1100');
}

// ============================================================
//  恶魔领主 Boss
// ============================================================

function drawDemonDown(ctx, frame) {
  const bob = frame % 2;
  // 身躯
  block(ctx, 8, 14 + bob, 32, 22, '#551177', '#661188', '#772299');
  // 角
  block(ctx, 10, 0 + bob, 4, 14, '#220033', '#330044', '#440055');
  block(ctx, 34, 0 + bob, 4, 14, '#220033', '#330044', '#440055');
  // 翅膀
  block(ctx, 2, 6 + bob, 9, 20, '#330044', '#440055', '#550066');
  block(ctx, 37, 6 + bob, 9, 20, '#330044', '#440055', '#550066');
  // 头
  block(ctx, 14, 3 + bob, 20, 12, '#551177', '#772299', '#8833aa');
  // 眼
  block(ctx, 18, 7 + bob, 4, 3, '#ff0000', '#ff2222');
  block(ctx, 26, 7 + bob, 4, 3, '#ff0000', '#ff2222');
  // 武器
  block(ctx, 40, 10 + bob, 3, 28, '#ff3355', '#ff4466', '#ff6688');
  block(ctx, 38, 8 + bob, 7, 4, '#ffaa00', '#ffbb33');
}

function drawDemonUp(ctx, frame) {
  const bob = frame % 2;
  block(ctx, 8, 14 + bob, 32, 22, '#440066', '#551177', '#661188');
  block(ctx, 10, 0 + bob, 4, 14, '#220033', '#330044');
  block(ctx, 34, 0 + bob, 4, 14, '#220033', '#330044');
  block(ctx, 2, 6 + bob, 9, 20, '#220033', '#330044');
  block(ctx, 37, 6 + bob, 9, 20, '#220033', '#330044');
  block(ctx, 14, 3 + bob, 20, 12, '#440066', '#551177', '#661188');
  block(ctx, 38, 10 + bob, 3, 28, '#dd2244', '#ee3355');
  block(ctx, 36, 8 + bob, 7, 4, '#ee8800', '#ffaa00');
}

function drawDemonLeft(ctx, frame) {
  const bob = frame % 2;
  block(ctx, 7, 14 + bob, 33, 22, '#551177', '#661188');
  block(ctx, 9, 0 + bob, 4, 14, '#330044', '#440055');
  block(ctx, 35, 0 + bob, 4, 14, '#330044');
  block(ctx, 1, 6 + bob, 10, 20, '#330044', '#440055');
  block(ctx, 38, 6 + bob, 9, 20, '#330044');
  block(ctx, 13, 3 + bob, 21, 12, '#551177', '#772299', '#8833aa');
  block(ctx, 17, 7 + bob, 3, 3, '#ff0000');
  block(ctx, 40, 8 + bob, 3, 28, '#ff3355', '#ff4466', '#ff6688');
  block(ctx, 38, 6 + bob, 7, 3, '#ffaa00');
}

function drawDemonRight(ctx, frame) {
  const bob = frame % 2;
  block(ctx, 8, 14 + bob, 33, 22, '#551177', '#661188');
  block(ctx, 35, 0 + bob, 4, 14, '#330044', '#440055');
  block(ctx, 9, 0 + bob, 4, 14, '#330044');
  block(ctx, 37, 6 + bob, 10, 20, '#330044', '#440055');
  block(ctx, 1, 6 + bob, 9, 20, '#330044');
  block(ctx, 14, 3 + bob, 21, 12, '#551177', '#772299', '#8833aa');
  block(ctx, 28, 7 + bob, 3, 3, '#ff0000');
  block(ctx, 5, 8 + bob, 3, 28, '#ff3355', '#ff4466');
  block(ctx, 3, 6 + bob, 7, 3, '#ffaa00');
}

// ============================================================
//  暗影领主 Boss
// ============================================================

function drawShadowLordDown(ctx, frame) {
  const ph = Math.sin(frame * 1.5) * 2;
  ctx.fillStyle = 'rgba(40,5,70,0.8)';
  ctx.fillRect(Px(3 - ph), Px(2), Px(42 + ph * 2), Px(36));
  ctx.fillStyle = 'rgba(80,10,140,0.7)';
  ctx.fillRect(Px(5 - ph), Px(4), Px(38 + ph * 2), Px(32));
  // 暗色皇冠
  block(ctx, 18, -1, 12, 5, '#8833cc', '#aa44ff');
  // 眼
  block(ctx, 16, 7, 6, 3, '#ff44ff', '#ff88ff');
  block(ctx, 26, 7, 6, 3, '#ff44ff', '#ff88ff');
}

function drawShadowLordUp(ctx, frame) {
  const ph = Math.sin(frame * 1.5) * 2;
  ctx.fillStyle = 'rgba(30,3,50,0.7)';
  ctx.fillRect(Px(3 - ph), Px(2), Px(42 + ph * 2), Px(36));
  ctx.fillStyle = 'rgba(50,7,100,0.6)';
  ctx.fillRect(Px(5 - ph), Px(4), Px(38 + ph * 2), Px(32));
  block(ctx, 18, -1, 12, 5, '#6622aa', '#8833cc');
}

function drawShadowLordLeft(ctx, frame) {
  const ph = Math.sin(frame * 1.5) * 2;
  ctx.fillStyle = 'rgba(40,5,70,0.7)';
  ctx.fillRect(Px(2 - ph), Px(2), Px(43 + ph * 2), Px(36));
  block(ctx, 17, -1, 12, 5, '#8833cc', '#aa44ff');
  block(ctx, 15, 7, 5, 3, '#ff44ff', '#ff88ff');
}

function drawShadowLordRight(ctx, frame) {
  const ph = Math.sin(frame * 1.5) * 2;
  ctx.fillStyle = 'rgba(40,5,70,0.7)';
  ctx.fillRect(Px(3 - ph), Px(2), Px(43 + ph * 2), Px(36));
  block(ctx, 19, -1, 12, 5, '#8833cc', '#aa44ff');
  block(ctx, 28, 7, 5, 3, '#ff44ff', '#ff88ff');
}

// ============================================================
//  火焰元素 Boss
// ============================================================

function drawFireElementalDown(ctx, frame) {
  const f = Math.sin(frame * 1.5) * 2;
  // 火焰身躯（从深到浅多层）
  block(ctx, 10, 12 + f, 28, 28, '#cc2200', '#ee3300', '#ff4400');
  block(ctx, 12, 10 + f, 24, 26, '#ee3300', '#ff5500', '#ff6600');
  block(ctx, 14, 8 + f, 20, 22, '#ff5500', '#ff7700', '#ff8800');
  // 火焰尖刺
  block(ctx, 17, 0 + f, 4, 10, '#ff6600', '#ff8800', '#ffaa00');
  block(ctx, 27, 2 + f, 4, 8, '#ff6600', '#ff8800', '#ffaa00');
  // 炽白眼
  block(ctx, 17, 14 + f, 5, 3, '#ffffff', '#ffffcc');
  block(ctx, 26, 14 + f, 5, 3, '#ffffff', '#ffffcc');
}

function drawFireElementalUp(ctx, frame) {
  const f = Math.sin(frame * 1.5) * 2;
  block(ctx, 10, 12 + f, 28, 28, '#bb1100', '#dd2200', '#ee3300');
  block(ctx, 12, 10 + f, 24, 26, '#dd2200', '#ee4400', '#ff5500');
  block(ctx, 14, 8 + f, 20, 22, '#ee4400', '#ff6600');
  block(ctx, 17, 0 + f, 4, 10, '#ee4400', '#ff6600');
  block(ctx, 27, 2 + f, 4, 8, '#ee4400', '#ff6600');
}

function drawFireElementalLeft(ctx, frame) {
  const f = Math.sin(frame * 1.5) * 2;
  block(ctx, 9, 12 + f, 29, 28, '#cc2200', '#ee3300');
  block(ctx, 11, 10 + f, 25, 26, '#ee3300', '#ff5500', '#ff6600');
  block(ctx, 13, 8 + f, 21, 22, '#ff5500', '#ff7700');
  block(ctx, 16, 0 + f, 4, 10, '#ff6600', '#ff8800');
  block(ctx, 26, 2 + f, 4, 8, '#ff6600', '#ff8800');
  block(ctx, 16, 14 + f, 4, 3, '#ffffff', '#ffffcc');
}

function drawFireElementalRight(ctx, frame) {
  const f = Math.sin(frame * 1.5) * 2;
  block(ctx, 10, 12 + f, 29, 28, '#cc2200', '#ee3300');
  block(ctx, 12, 10 + f, 25, 26, '#ee3300', '#ff5500', '#ff6600');
  block(ctx, 14, 8 + f, 21, 22, '#ff5500', '#ff7700');
  block(ctx, 18, 0 + f, 4, 10, '#ff6600', '#ff8800');
  block(ctx, 8, 2 + f, 4, 8, '#ff6600', '#ff8800');
  block(ctx, 28, 14 + f, 4, 3, '#ffffff', '#ffffcc');
}

// ============================================================
//  亡灵法师 Boss
// ============================================================

function drawNecromancerDown(ctx, frame) {
  const bob = frame % 2;
  block(ctx, 8, 13 + bob, 32, 28, '#1a3311', '#224422', '#2a5522');
  // 骷髅头
  block(ctx, 15, 1 + bob, 18, 10, '#c0b0a0', '#d0c0b0', '#e0d0c0');
  // 绿光眼
  block(ctx, 18, 5 + bob, 4, 3, '#44ff44', '#88ff88');
  block(ctx, 26, 5 + bob, 4, 3, '#44ff44', '#88ff88');
  // 法杖
  block(ctx, 40, 8 + bob, 2, 28, '#333322', '#444433');
  block(ctx, 38, 6 + bob, 6, 5, '#44ff44', '#66ff66', '#88ff88');
  // 光环
  ctx.fillStyle = 'rgba(40,255,40,0.1)';
  ctx.fillRect(Px(4), Px(26 + bob), Px(40), Px(8));
}

function drawNecromancerUp(ctx, frame) {
  const bob = frame % 2;
  block(ctx, 8, 13 + bob, 32, 28, '#1a3311', '#1e3a1e');
  block(ctx, 15, 1 + bob, 18, 10, '#b0a090', '#c0b0a0', '#d0c0b0');
  block(ctx, 40, 8 + bob, 2, 26, '#333322', '#444433');
  block(ctx, 38, 6 + bob, 6, 5, '#33dd33', '#44ff44');
}

function drawNecromancerLeft(ctx, frame) {
  const bob = frame % 2;
  block(ctx, 7, 13 + bob, 33, 28, '#1a3311', '#224422');
  block(ctx, 14, 1 + bob, 19, 10, '#c0b0a0', '#d0c0b0', '#e0d0c0');
  block(ctx, 17, 5 + bob, 3, 3, '#44ff44', '#88ff88');
  block(ctx, 40, 8 + bob, 2, 26, '#333322', '#444433');
  block(ctx, 38, 6 + bob, 6, 5, '#44ff44', '#66ff66');
  ctx.fillStyle = 'rgba(40,255,40,0.08)';
  ctx.fillRect(Px(3), Px(26 + bob), Px(40), Px(8));
}

function drawNecromancerRight(ctx, frame) {
  const bob = frame % 2;
  block(ctx, 8, 13 + bob, 33, 28, '#1a3311', '#224422');
  block(ctx, 15, 1 + bob, 19, 10, '#c0b0a0', '#d0c0b0', '#e0d0c0');
  block(ctx, 28, 5 + bob, 3, 3, '#44ff44', '#88ff88');
  block(ctx, 6, 8 + bob, 2, 26, '#333322', '#444433');
  block(ctx, 4, 6 + bob, 6, 5, '#44ff44', '#66ff66');
  ctx.fillStyle = 'rgba(40,255,40,0.08)';
  ctx.fillRect(Px(5), Px(26 + bob), Px(40), Px(8));
}

// ============================================================
//  动画：idle 复用 body，attack/hurt/death 在 body 上加特效
// ============================================================

function idle(fn) { return fn; }

function attack(base, fn) {
  return function(ctx, size, dir, frame) {
    base(ctx, size, dir, 0);
    fn(ctx, size, dir, frame);
  };
}

function hurt(base) {
  return function(ctx, size, dir, frame) {
    base(ctx, size, dir, 0);
    if (frame === 0) {
      ctx.fillStyle = 'rgba(255,60,60,0.45)';
      ctx.fillRect(0, 0, size, size);
    }
  };
}

function deathAnim(base) {
  return function(ctx, size, dir, frame) {
    const p = frame / 3;
    ctx.globalAlpha = 1 - p * 0.7;
    base(ctx, size, dir, Math.floor(p * 3));
    ctx.globalAlpha = 1;
  };
}

// 方向→函数 映射
const PD = { down: drawPlayerDown, up: drawPlayerUp, left: drawPlayerLeft, right: drawPlayerRight };
const GD = { down: drawGoblinDown, up: drawGoblinUp, left: drawGoblinLeft, right: drawGoblinRight };
const KD = { down: drawSkeletonDown, up: drawSkeletonUp, left: drawSkeletonLeft, right: drawSkeletonRight };
const SD = { down: drawSlimeDown, up: drawSlimeUp, left: drawSlimeLeft, right: drawSlimeRight };
const HD = { down: drawShadowDown, up: drawShadowUp, left: drawShadowLeft, right: drawShadowRight };
const RD = { down: drawRatDown, up: drawRatUp, left: drawRatLeft, right: drawRatRight };
const CD = { down: drawCultistDown, up: drawCultistUp, left: drawCultistLeft, right: drawCultistRight };
const WD = { down: drawWolfDown, up: drawWolfUp, left: drawWolfLeft, right: drawWolfRight };
const DrD = { down: drawDragonDown, up: drawDragonUp, left: drawDragonLeft, right: drawDragonRight };
const DmD = { down: drawDemonDown, up: drawDemonUp, left: drawDemonLeft, right: drawDemonRight };
const SlD = { down: drawShadowLordDown, up: drawShadowLordUp, left: drawShadowLordLeft, right: drawShadowLordRight };
const FeD = { down: drawFireElementalDown, up: drawFireElementalUp, left: drawFireElementalLeft, right: drawFireElementalRight };
const NeD = { down: drawNecromancerDown, up: drawNecromancerUp, left: drawNecromancerLeft, right: drawNecromancerRight };

function makeSpriteSet(baseFn) {
  return {
    idle: (ctx, size, dir, frame) => baseFn[dir](ctx, frame),
    attack: (ctx, size, dir, frame) => baseFn[dir](ctx, frame), // attack 叠加在 base 上
    hurt: (ctx, size, dir, frame) => { baseFn[dir](ctx, 0); if (frame === 0) { ctx.fillStyle = 'rgba(255,60,60,0.45)'; ctx.fillRect(0, 0, size, size); } },
    death: (ctx, size, dir, frame) => { const p = frame / 3; ctx.globalAlpha = 1 - p * 0.7; baseFn[dir](ctx, Math.floor(p * 3)); ctx.globalAlpha = 1; },
  };
}

function makeSpriteSetWithAttack(baseFn, atkFn) {
  const set = makeSpriteSet(baseFn);
  set.attack = (ctx, size, dir, frame) => {
    baseFn[dir](ctx, 0);
    atkFn(ctx, size, dir, frame);
  };
  return set;
}

// 玩家和哥布林有独立的 attack 特效
function playerAttackFx(ctx, size, dir, frame) {
  if (frame === 0) { block(ctx, 22, 3, 1, 16, '#8899aa', '#bbccee'); }
  else if (frame === 1 || frame === 2) {
    block(ctx, 23, 1, 1, 14, '#ddeeff'); block(ctx, 21, 0, 5, 1, '#ddeeff');
    if (frame === 2) block(ctx, 24, -1, 4, 3, '#ffffff');
  }
}
function goblinAttackFx(ctx, size, dir, frame) {
  if (frame === 1 || frame === 2) { block(ctx, 23, 12, 1, 8, '#aaaaaa'); }
  if (frame === 2) block(ctx, 24, 12, 4, 6, '#ffffff');
}
function skeletonAttackFx(ctx, size, dir, frame) {
  if (frame === 1 || frame === 2) { block(ctx, 23, 12, 4, 1, '#d0c8b8'); block(ctx, 25, 10, 1, 6, '#d0c8b8'); }
  if (frame === 2) block(ctx, 25, 10, 3, 6, '#ffffff');
}
function slimeAttackFx(ctx, size, dir, frame) {
  if (frame === 1 || frame === 2) { block(ctx, 25, 21, 5, 4, '#44aa55'); }
}
function shadowAttackFx(ctx, size, dir, frame) {
  if (frame === 1 || frame === 2) { ctx.fillStyle = 'rgba(180,40,220,0.7)'; ctx.fillRect(Px(25), Px(4), Px(5), Px(5)); }
}
function ratAttackFx(ctx, size, dir, frame) {
  if (frame === 1 || frame === 2) { block(ctx, 27, 14, 4, 3, '#aa8844'); block(ctx, 29, 15, 1, 1, '#ffffff'); }
}
function cultistAttackFx(ctx, size, dir, frame) {
  if (frame === 1 || frame === 2) { block(ctx, 22, 5, 5, 5, '#ff4466'); }
  if (frame === 2) block(ctx, 27, 6, 4, 3, '#ff6688');
}
function wolfAttackFx(ctx, size, dir, frame) {
  if (frame === 1 || frame === 2) { block(ctx, 26, 13, 4, 2, '#606070'); block(ctx, 28, 14, 1, 1, '#ffffff'); }
}

// Boss attack effects
function dragonAttackFx(ctx, size, dir, frame) {
  if (frame === 1) { block(ctx, 16, 16, 8, 6, '#ff6600'); }
  else if (frame === 2) {
    block(ctx, 16, 12, 24, 8, '#ff4400'); block(ctx, 20, 8, 16, 6, '#ffaa00'); block(ctx, 26, 6, 10, 4, '#ffdd00');
  }
}
function demonAttackFx(ctx, size, dir, frame) {
  if (frame === 1 || frame === 2) { block(ctx, 24, 6, 3, 24, '#ff4466'); if (frame === 2) block(ctx, 22, 2, 7, 7, '#ff6688'); }
}
function shadowLordAttackFx(ctx, size, dir, frame) {
  if (frame === 1 || frame === 2) { ctx.fillStyle = '#cc44ff'; ctx.fillRect(Px(30), Px(12), Px(14), Px(10)); if (frame === 2) ctx.fillRect(Px(34), Px(8), Px(10), Px(12), '#ff88ff'); }
}
function fireElementalAttackFx(ctx, size, dir, frame) {
  if (frame === 1 || frame === 2) { block(ctx, 30, 6, 14, 12, '#ff4400'); block(ctx, 34, 4, 8, 8, '#ffaa00'); }
}
function necromancerAttackFx(ctx, size, dir, frame) {
  if (frame === 1 || frame === 2) { block(ctx, 32, 10, 9, 9, '#44ff44'); if (frame === 2) block(ctx, 35, 7, 11, 12, '#88ff88'); }
}

// 组装调度表
function dirSetFor(idleSet) {
  const result = {};
  for (const dir of ALL_DIRS) {
    result[dir] = (ctx, size, frame) => idleSet[dir](ctx, frame);
  }
  return result;
}

function makeDrawers(baseFns, atkFns) {
  const b = {};
  for (const dir of ALL_DIRS) b[dir] = baseFns[dir];
  const drawers = { idle: (ctx, size, dir, frame) => b[dir](ctx, frame) };
  if (atkFns) {
    drawers.attack = (ctx, size, dir, frame) => { b[dir](ctx, 0); atkFns(ctx, size, dir, frame); };
  } else {
    drawers.attack = (ctx, size, dir, frame) => { b[dir](ctx, frame); };
  }
  drawers.hurt = (ctx, size, dir, frame) => { b[dir](ctx, 0); if (frame === 0) { ctx.fillStyle = 'rgba(255,60,60,0.45)'; ctx.fillRect(0, 0, size, size); } };
  drawers.death = (ctx, size, dir, frame) => { const p = frame / 3; ctx.globalAlpha = 1 - p * 0.7; b[dir](ctx, Math.floor(p * 3)); ctx.globalAlpha = 1; };
  return drawers;
}

const NORMAL_DRAWERS = {
  player:    makeDrawers(PD, playerAttackFx),
  GOBLIN:    makeDrawers(GD, goblinAttackFx),
  SKELETON:  makeDrawers(KD, skeletonAttackFx),
  SLIME:     makeDrawers(SD, slimeAttackFx),
  SHADOW:    makeDrawers(HD, shadowAttackFx),
  GIANT_RAT: makeDrawers(RD, ratAttackFx),
  cultist:   makeDrawers(CD, cultistAttackFx),
  wolf:      makeDrawers(WD, wolfAttackFx),
};

const BOSS_DRAWERS = {
  ANCIENT_DRAGON:  { ...makeDrawers(DrD, dragonAttackFx), enrage: makeDrawers(DrD).idle },
  DEMON_LORD:      { ...makeDrawers(DmD, demonAttackFx), enrage: makeDrawers(DmD).idle },
  SHADOW_LORD:     { ...makeDrawers(SlD, shadowLordAttackFx), enrage: makeDrawers(SlD).idle },
  FIRE_ELEMENTAL:  { ...makeDrawers(FeD, fireElementalAttackFx), enrage: makeDrawers(FeD).idle },
  NECROMANCER:     { ...makeDrawers(NeD, necromancerAttackFx), enrage: makeDrawers(NeD).idle },
};

const FRAME_COUNTS = { idle: 4, attack: 4, hurt: 2, death: 4, enrage: 4 };

export function generateAllSprites() {
  const cache = new Map();

  for (const [entityType, drawers] of Object.entries(NORMAL_DRAWERS)) {
    for (const [animType, drawFn] of Object.entries(drawers)) {
      for (const dir of ALL_DIRS) {
        const frameCount = FRAME_COUNTS[animType] || 4;
        const frames = [];
        for (let i = 0; i < frameCount; i++) {
          const { c, ctx } = mkCanvas(SPRITE_SIZE, SPRITE_SIZE);
          drawFn(ctx, SPRITE_SIZE, dir, i);
          frames.push(c);
        }
        cache.set(`${entityType}:${animType}:${dir}`, frames);
      }
    }
  }

  for (const [bossKey, drawers] of Object.entries(BOSS_DRAWERS)) {
    for (const [animType, drawFn] of Object.entries(drawers)) {
      for (const dir of ALL_DIRS) {
        const frameCount = FRAME_COUNTS[animType] || 4;
        const frames = [];
        for (let i = 0; i < frameCount; i++) {
          const { c, ctx } = mkCanvas(BOSS_SPRITE_SIZE, BOSS_SPRITE_SIZE);
          drawFn(ctx, BOSS_SPRITE_SIZE, dir, i);
          frames.push(c);
        }
        cache.set(`boss:${bossKey}:${animType}:${dir}`, frames);
      }
    }
  }

  return cache;
}

export { SPRITE_SIZE, BOSS_SPRITE_SIZE, FRAME_COUNTS, NORMAL_DRAWERS, BOSS_DRAWERS };
