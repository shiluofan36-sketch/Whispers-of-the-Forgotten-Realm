/**
 * 键盘方向键映射
 * W/↑ = 上, A/← = 左, S/↓ = 下, D/→ = 右
 */
const KEY_MAP = {
  w:          'up',
  W:          'up',
  ArrowUp:    'up',
  s:          'down',
  S:          'down',
  ArrowDown:  'down',
  a:          'left',
  A:          'left',
  ArrowLeft:  'left',
  d:          'right',
  D:          'right',
  ArrowRight: 'right',
};

/**
 * 将键盘事件转换为方向字符串
 * @param {KeyboardEvent} event
 * @returns {string | null} - 方向字符串，无效按键返回 null
 */
export function keyToDirection(event) {
  return KEY_MAP[event.key] || null;
}
