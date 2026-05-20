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

    // 渲染循环：使用 requestAnimationFrame 持续渲染
    let animId;
    function loop() {
      gameRef.current.renderFrame(ctx);
      animId = requestAnimationFrame(loop);
    }
    loop();

    // 键盘事件处理
    function onKeyDown(e) {
      // 防止方向键滚动页面
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
      }
      gameRef.current.handleInput(e);
    }
    window.addEventListener('keydown', onKeyDown);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  const size = GRID_SIZE * CELL_SIZE;

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      className="border-2 border-gray-600 rounded"
    />
  );
}
