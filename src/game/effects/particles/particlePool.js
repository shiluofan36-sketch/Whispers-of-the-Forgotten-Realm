// 粒子对象池：预分配粒子数组，避免 GC 压力
// 粒子结构：{ x, y, vx, vy, life, maxLife, color, size, shape, active }

export function createParticlePool(maxSize = 200) {
  const particles = new Array(maxSize);
  for (let i = 0; i < maxSize; i++) {
    particles[i] = {
      x: 0, y: 0, vx: 0, vy: 0,
      life: 0, maxLife: 1,
      color: '#ffffff', size: 3,
      shape: 'square', active: false,
    };
  }

  return {
    particles,
    maxSize,

    /** 获取一个闲置粒子，池满则返回最早活跃的（FIFO 复用） */
    acquire() {
      for (let i = 0; i < this.maxSize; i++) {
        if (!this.particles[i].active) {
          this.particles[i].active = true;
          return this.particles[i];
        }
      }
      // 池满 — 复用最早活跃的粒子
      for (let i = 0; i < this.maxSize; i++) {
        if (this.particles[i].active) {
          return this.particles[i];
        }
      }
      return null;
    },

    /** 释放粒子 */
    release(p) {
      p.active = false;
    },

    /** 活跃粒子数 */
    getActiveCount() {
      let count = 0;
      for (let i = 0; i < this.maxSize; i++) {
        if (this.particles[i].active) count++;
      }
      return count;
    },
  };
}
