import { useRef, useEffect } from 'react';
import { GRID_SIZE, CELL_SIZE } from '../game/constants';

/**
 * Canvas 组件
 * 负责：创建 Canvas、启动渲染循环、监听键盘输入
 */
export default function GameCanvas({ game }) {
  const canvasRef = useRef(null);
  const gameRef = useRef(game);

  // 保持 game 引用最新
  useEffect(() => {
    gameRef.current = game;
  }, [game]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    // 渲染循环：使用 requestAnimationFrame 持续渲染
    let animId;
    let lastTime = performance.now();
    function loop(now) {
      const dt = (now - lastTime) / 1000;
      lastTime = now;
      gameRef.current.updateEffects(Math.min(dt, 0.1));
      gameRef.current.renderFrame(ctx);
      animId = requestAnimationFrame(loop);
    }
    loop(performance.now());

    // 键盘事件处理
    function onKeyDown(e) {
      // 防止方向键滚动页面
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
      }
      gameRef.current.handleInput(e);
    }
    window.addEventListener('keydown', onKeyDown);

    // 点击 canvas 时关闭掉落卡片
    function onClick() {
      gameRef.current.dismissLootCard();
    }
    canvas.addEventListener('click', onClick);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('keydown', onKeyDown);
      canvas.removeEventListener('click', onClick);
    };
  }, []);

  const size = GRID_SIZE * CELL_SIZE;

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      className="pixel-canvas max-h-[95vh] max-w-[calc(100vw-380px)]"
    />
  );
}
