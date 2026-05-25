// 粒子系统主模块：统一管理池 + 更新 + 渲染
import { createParticlePool } from './particlePool';
import { emitParticles, updateParticles } from './particleEmitter';
import { PARTICLE_TYPES } from './particleTypes';

/**
 * 创建粒子系统实例
 */
export function createParticleSystem(maxParticles = 200) {
  const pool = createParticlePool(maxParticles);

  return {
    pool,

    emit(type, x, y) {
      if (PARTICLE_TYPES[type]) {
        emitParticles(pool, type, x, y);
      }
    },

    update(dt) {
      updateParticles(pool, dt);
    },

    render(ctx) {
      for (let i = 0; i < pool.maxSize; i++) {
        const p = pool.particles[i];
        if (!p.active) continue;

        const alpha = Math.max(0, p.life / p.maxLife);
        ctx.globalAlpha = alpha;

        if (p.shape === 'circle') {
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(Math.floor(p.x), Math.floor(p.y), p.size, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // 像素方块（整数坐标）
          ctx.fillStyle = p.color;
          const half = Math.floor(p.size / 2);
          ctx.fillRect(Math.floor(p.x - half), Math.floor(p.y - half), p.size, p.size);
        }
      }
      ctx.globalAlpha = 1;
    },

    getActiveCount() {
      return pool.getActiveCount();
    },
  };
}

export { PARTICLE_TYPES };
