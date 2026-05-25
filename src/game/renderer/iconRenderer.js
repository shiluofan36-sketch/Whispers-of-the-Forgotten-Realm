// 装备图标渲染器：使用 Canvas 2D 整数坐标绘制像素风图标到离屏Canvas
// 缓存 + 稀有度着色变体
import { getRarityHex } from '../equipment/equipmentManager';

const ICON_SIZE = 16;
const iconCache = new Map();

// 稀有度发光色
const RARITY_GLOW = {
  common:    'rgba(156,163,175,0.2)',
  rare:      'rgba(59,130,246,0.3)',
  epic:      'rgba(168,85,247,0.4)',
  legendary: 'rgba(245,158,11,0.5)',
};

// ============================================================
//  图标绘制函数（16x16 整数坐标 = 纯正像素风）
// ============================================================

function drawSwordIcon(ctx, size) {
  const s = size;
  // 剑身
  ctx.fillStyle = '#aabbcc';
  ctx.fillRect(Math.floor(s * 0.44), Math.floor(s * 0.05), Math.floor(s * 0.12), Math.floor(s * 0.55));
  // 剑尖
  ctx.fillRect(Math.floor(s * 0.44), 0, Math.floor(s * 0.12), Math.floor(s * 0.1));
  // 护手
  ctx.fillStyle = '#ddcc88';
  ctx.fillRect(Math.floor(s * 0.25), Math.floor(s * 0.55), Math.floor(s * 0.5), Math.floor(s * 0.12));
  // 剑柄
  ctx.fillStyle = '#886644';
  ctx.fillRect(Math.floor(s * 0.44), Math.floor(s * 0.65), Math.floor(s * 0.12), Math.floor(s * 0.2));
  // 柄头
  ctx.fillStyle = '#ddcc88';
  ctx.fillRect(Math.floor(s * 0.38), Math.floor(s * 0.82), Math.floor(s * 0.25), Math.floor(s * 0.12));
  // 剑身中线高光
  ctx.fillStyle = '#ddeeff';
  ctx.fillRect(Math.floor(s * 0.5), Math.floor(s * 0.08), 1, Math.floor(s * 0.45));
}

function drawAxeIcon(ctx, size) {
  const s = size;
  // 斧刃（双刃）
  ctx.fillStyle = '#888888';
  ctx.fillRect(Math.floor(s * 0.2), Math.floor(s * 0.05), Math.floor(s * 0.6), Math.floor(s * 0.3));
  ctx.fillRect(Math.floor(s * 0.08), Math.floor(s * 0.12), Math.floor(s * 0.84), Math.floor(s * 0.15));
  // 斧柄
  ctx.fillStyle = '#664422';
  ctx.fillRect(Math.floor(s * 0.44), Math.floor(s * 0.3), Math.floor(s * 0.12), Math.floor(s * 0.55));
  // 柄尾
  ctx.fillStyle = '#886644';
  ctx.fillRect(Math.floor(s * 0.38), Math.floor(s * 0.8), Math.floor(s * 0.25), Math.floor(s * 0.12));
  // 斧刃高光
  ctx.fillStyle = '#aaaaaa';
  ctx.fillRect(Math.floor(s * 0.12), Math.floor(s * 0.15), Math.floor(s * 0.75), 1);
}

function drawShieldIcon(ctx, size) {
  const s = size;
  // 盾面
  ctx.fillStyle = '#556688';
  ctx.fillRect(Math.floor(s * 0.2), Math.floor(s * 0.05), Math.floor(s * 0.6), Math.floor(s * 0.7));
  // 盾顶部弧
  ctx.fillStyle = '#556688';
  ctx.fillRect(Math.floor(s * 0.25), 0, Math.floor(s * 0.5), Math.floor(s * 0.12));
  // 盾底部尖
  ctx.fillStyle = '#334466';
  ctx.fillRect(Math.floor(s * 0.38), Math.floor(s * 0.7), Math.floor(s * 0.25), Math.floor(s * 0.2));
  ctx.fillRect(Math.floor(s * 0.44), Math.floor(s * 0.82), Math.floor(s * 0.12), Math.floor(s * 0.15));
  // 十字纹章
  ctx.fillStyle = '#aabbcc';
  ctx.fillRect(Math.floor(s * 0.44), Math.floor(s * 0.1), Math.floor(s * 0.12), Math.floor(s * 0.5));
  ctx.fillRect(Math.floor(s * 0.3), Math.floor(s * 0.25), Math.floor(s * 0.4), Math.floor(s * 0.12));
  // 边框
  ctx.fillStyle = '#8899aa';
  ctx.fillRect(Math.floor(s * 0.2), Math.floor(s * 0.05), Math.floor(s * 0.6), 2);
  ctx.fillRect(Math.floor(s * 0.2), Math.floor(s * 0.05), 2, Math.floor(s * 0.7));
  ctx.fillRect(Math.floor(s * 0.75), Math.floor(s * 0.05), 2, Math.floor(s * 0.7));
}

function drawArmorIcon(ctx, size) {
  const s = size;
  // 胸甲主体
  ctx.fillStyle = '#667788';
  ctx.fillRect(Math.floor(s * 0.2), Math.floor(s * 0.15), Math.floor(s * 0.6), Math.floor(s * 0.5));
  // 肩甲
  ctx.fillStyle = '#556677';
  ctx.fillRect(Math.floor(s * 0.1), Math.floor(s * 0.12), Math.floor(s * 0.2), Math.floor(s * 0.15));
  ctx.fillRect(Math.floor(s * 0.7), Math.floor(s * 0.12), Math.floor(s * 0.2), Math.floor(s * 0.15));
  // 胸甲中线
  ctx.fillStyle = '#8899aa';
  ctx.fillRect(Math.floor(s * 0.47), Math.floor(s * 0.2), Math.floor(s * 0.06), Math.floor(s * 0.4));
  // 腰带
  ctx.fillStyle = '#886644';
  ctx.fillRect(Math.floor(s * 0.2), Math.floor(s * 0.6), Math.floor(s * 0.6), Math.floor(s * 0.12));
  // 腰带扣
  ctx.fillStyle = '#ddcc88';
  ctx.fillRect(Math.floor(s * 0.44), Math.floor(s * 0.6), Math.floor(s * 0.12), Math.floor(s * 0.12));
  // 腿甲
  ctx.fillStyle = '#556677';
  ctx.fillRect(Math.floor(s * 0.25), Math.floor(s * 0.68), Math.floor(s * 0.2), Math.floor(s * 0.25));
  ctx.fillRect(Math.floor(s * 0.55), Math.floor(s * 0.68), Math.floor(s * 0.2), Math.floor(s * 0.25));
}

function drawRingIcon(ctx, size) {
  const s = size;
  // 指环
  ctx.fillStyle = '#ddcc88';
  ctx.fillRect(Math.floor(s * 0.25), Math.floor(s * 0.3), Math.floor(s * 0.5), Math.floor(s * 0.4));
  // 环孔
  ctx.fillStyle = '#000000';
  ctx.fillRect(Math.floor(s * 0.35), Math.floor(s * 0.38), Math.floor(s * 0.3), Math.floor(s * 0.25));
  // 宝石
  ctx.fillStyle = '#44aaff';
  ctx.fillRect(Math.floor(s * 0.38), Math.floor(s * 0.2), Math.floor(s * 0.25), Math.floor(s * 0.18));
  // 宝石高光
  ctx.fillStyle = '#88ccff';
  ctx.fillRect(Math.floor(s * 0.42), Math.floor(s * 0.22), Math.floor(s * 0.08), Math.floor(s * 0.06));
}

function drawPotionIcon(ctx, size) {
  const s = size;
  // 瓶身
  ctx.fillStyle = '#44aa66';
  ctx.fillRect(Math.floor(s * 0.3), Math.floor(s * 0.25), Math.floor(s * 0.4), Math.floor(s * 0.55));
  // 瓶颈
  ctx.fillStyle = '#338844';
  ctx.fillRect(Math.floor(s * 0.38), Math.floor(s * 0.12), Math.floor(s * 0.25), Math.floor(s * 0.18));
  // 瓶塞
  ctx.fillStyle = '#886644';
  ctx.fillRect(Math.floor(s * 0.35), Math.floor(s * 0.05), Math.floor(s * 0.3), Math.floor(s * 0.1));
  // 液体高光
  ctx.fillStyle = '#66cc88';
  ctx.fillRect(Math.floor(s * 0.35), Math.floor(s * 0.3), Math.floor(s * 0.1), Math.floor(s * 0.3));
  // 气泡
  ctx.fillStyle = '#88eeaa';
  ctx.fillRect(Math.floor(s * 0.5), Math.floor(s * 0.4), 2, 2);
}

const ICON_DRAWERS = {
  sword: drawSwordIcon,
  axe: drawAxeIcon,
  shield: drawShieldIcon,
  armor: drawArmorIcon,
  ring: drawRingIcon,
  potion: drawPotionIcon,
};

// 装备槽到图标的映射
const SLOT_ICONS = {
  weapon: 'sword',
  armor: 'armor',
  accessory: 'ring',
};

/**
 * 生成所有图标及其稀有度变体的离屏Canvas缓存
 */
export function initIconCache() {
  if (iconCache.size > 0) return;

  for (const [iconKey, drawFn] of Object.entries(ICON_DRAWERS)) {
    // 基础图标
    const baseCanvas = document.createElement('canvas');
    baseCanvas.width = ICON_SIZE;
    baseCanvas.height = ICON_SIZE;
    const baseCtx = baseCanvas.getContext('2d');
    baseCtx.imageSmoothingEnabled = false;
    drawFn(baseCtx, ICON_SIZE);
    iconCache.set(iconKey, baseCanvas);

    // 稀有度变体（带发光边框）
    for (const rarity of ['common', 'rare', 'epic', 'legendary']) {
      const canvas = document.createElement('canvas');
      canvas.width = ICON_SIZE + 4;
      canvas.height = ICON_SIZE + 4;
      const ctx = canvas.getContext('2d');
      ctx.imageSmoothingEnabled = false;

      // 发光背景
      const glow = RARITY_GLOW[rarity];
      if (glow && rarity !== 'common') {
        ctx.fillStyle = glow;
        ctx.fillRect(1, 1, ICON_SIZE + 2, ICON_SIZE + 2);
      }

      // 稀有度边框
      if (rarity !== 'common') {
        const hex = getRarityHex(rarity);
        ctx.strokeStyle = hex;
        ctx.lineWidth = 1;
        ctx.strokeRect(0.5, 0.5, ICON_SIZE + 3, ICON_SIZE + 3);
      }

      // 绘制图标
      ctx.drawImage(baseCanvas, 2, 2);

      iconCache.set(`${iconKey}:${rarity}`, canvas);
    }
  }
}

/**
 * 获取图标Canvas
 */
export function getIcon(iconKey, rarity = 'common') {
  const key = rarity && rarity !== 'common' ? `${iconKey}:${rarity}` : iconKey;
  return iconCache.get(key) || iconCache.get(iconKey);
}

/**
 * 绘制图标
 */
export function drawIcon(ctx, iconKey, rarity, x, y, displaySize) {
  const canvas = getIcon(iconKey, rarity);
  if (canvas) {
    ctx.drawImage(canvas, x - displaySize / 2, y - displaySize / 2, displaySize, displaySize);
  }
}

/**
 * 根据装备槽获取图标key
 */
export function getIconForSlot(slot) {
  return SLOT_ICONS[slot] || 'sword';
}

/**
 * 根据装备itemKey推断图标
 * 优先关键词匹配，无法匹配时返回 sword 默认
 */
export function getIconForItem(itemKey) {
  if (!itemKey) return 'sword';
  const key = itemKey.toLowerCase();
  // 武器类
  if (key.includes('sword') || key.includes('blade') || key.includes('bringer') || key.includes('drinker')) return 'sword';
  if (key.includes('axe') || key.includes('cleaver')) return 'axe';
  if (key.includes('staff') || key.includes('wand')) return 'sword'; // 法杖暂用剑图标
  // 防具类
  if (key.includes('shield') || key.includes('barrier')) return 'shield';
  if (key.includes('armor') || key.includes('plate') || key.includes('robe') || key.includes('vest')) return 'armor';
  if (key.includes('cloak') || key.includes('mantle') || key.includes('scale') || key.includes('hide')) return 'armor';
  // 饰品类
  if (key.includes('ring') || key.includes('pendant') || key.includes('charm') || key.includes('talisman')) return 'ring';
  if (key.includes('amulet') || key.includes('crown') || key.includes('horn') || key.includes('stone')) return 'ring';
  if (key.includes('boots') || key.includes('greaves')) return 'ring';
  // 消耗品
  if (key.includes('potion') || key.includes('vial') || key.includes('scroll')) return 'potion';
  return 'sword';
}
