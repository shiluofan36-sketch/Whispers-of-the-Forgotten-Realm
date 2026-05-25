import { useRef, useEffect } from 'react';
import { getIconForItem, getIconForSlot } from '../../game/renderer/iconRenderer';

/**
 * 在 React 中渲染像素装备图标（通过微型 Canvas）
 * @param {string} itemKey - 装备key（用于推断图标类型）
 * @param {string} slot - 装备槽位 weapon/armor/accessory
 * @param {string} rarity - 稀有度
 * @param {number} size - 显示尺寸（px）
 */
export default function EquipmentIcon({ itemKey, slot, rarity = 'common', size = 20 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, size, size);
    ctx.imageSmoothingEnabled = false;

    // 根据 slot 或 itemKey 确定图标类型
    const iconKey = itemKey
      ? getIconForItem(itemKey)
      : getIconForSlot(slot);

    // 简单绘制像素图标（用彩色方块模拟）
    drawPixelIcon(ctx, iconKey, rarity, size);
  }, [itemKey, slot, rarity, size]);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      className="inline-block align-middle"
      style={{ imageRendering: 'pixelated', width: size, height: size }}
    />
  );
}

// 内联绘制简化像素图标（React 组件内直接绘制，不依赖 iconRenderer 缓存）
const ICON_COLORS = {
  sword:  { primary: '#aabbcc', accent: '#ddcc88', size: 20 },
  axe:    { primary: '#888888', accent: '#aa8833', size: 20 },
  shield: { primary: '#556688', accent: '#aabbcc', size: 20 },
  armor:  { primary: '#667788', accent: '#8899aa', size: 20 },
  ring:   { primary: '#ddcc88', accent: '#44aaff', size: 20 },
  potion: { primary: '#44aa66', accent: '#66cc88', size: 20 },
};

const RARITY_BORDER = {
  common:    'rgba(156,163,175,0.4)',
  rare:      'rgba(59,130,246,0.6)',
  epic:      'rgba(168,85,247,0.6)',
  legendary: 'rgba(245,158,11,0.7)',
};

function drawPixelIcon(ctx, iconKey, rarity, size) {
  const colors = ICON_COLORS[iconKey] || ICON_COLORS.sword;
  const s = size;
  const pad = 2;

  // 稀有度边框
  const borderColor = RARITY_BORDER[rarity] || RARITY_BORDER.common;
  ctx.fillStyle = borderColor;
  ctx.fillRect(0, 0, s, s);

  // 背景
  ctx.fillStyle = '#1a1a2e';
  ctx.fillRect(1, 1, s - 2, s - 2);

  // 简化图标（根据类型画不同形状）
  ctx.fillStyle = colors.primary;
  const inner = s - pad * 2;
  const ox = pad, oy = pad;

  switch (iconKey) {
    case 'sword':
      ctx.fillRect(ox + inner * 0.44, oy, inner * 0.12, inner * 0.7);
      ctx.fillStyle = colors.accent;
      ctx.fillRect(ox + inner * 0.25, oy + inner * 0.5, inner * 0.5, inner * 0.15);
      break;
    case 'axe':
      ctx.fillRect(ox + inner * 0.2, oy + inner * 0.05, inner * 0.6, inner * 0.3);
      ctx.fillRect(ox + inner * 0.4, oy + inner * 0.3, inner * 0.2, inner * 0.55);
      break;
    case 'shield':
      ctx.fillRect(ox + inner * 0.25, oy, inner * 0.5, inner * 0.75);
      ctx.fillStyle = colors.accent;
      ctx.fillRect(ox + inner * 0.44, oy + inner * 0.1, inner * 0.12, inner * 0.5);
      break;
    case 'armor':
      ctx.fillRect(ox + inner * 0.25, oy + inner * 0.1, inner * 0.5, inner * 0.7);
      ctx.fillStyle = colors.accent;
      ctx.fillRect(ox + inner * 0.44, oy + inner * 0.15, inner * 0.12, inner * 0.5);
      break;
    case 'ring':
      ctx.fillRect(ox + inner * 0.25, oy + inner * 0.3, inner * 0.5, inner * 0.4);
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(ox + inner * 0.35, oy + inner * 0.38, inner * 0.3, inner * 0.25);
      ctx.fillStyle = colors.accent;
      ctx.fillRect(ox + inner * 0.35, oy + inner * 0.15, inner * 0.3, inner * 0.2);
      break;
    case 'potion':
      ctx.fillRect(ox + inner * 0.35, oy + inner * 0.25, inner * 0.3, inner * 0.65);
      ctx.fillStyle = '#664422';
      ctx.fillRect(ox + inner * 0.4, oy + inner * 0.05, inner * 0.2, inner * 0.2);
      break;
  }
}
