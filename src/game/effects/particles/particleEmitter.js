// 粒子发射器：从池中取粒子，设置初始属性
import { PARTICLE_TYPES } from './particleTypes';

/**
 * 发射一组粒子
 * @param {object} pool - 粒子池
 * @param {string} type - 粒子类型键（见 PARTICLE_TYPES）
 * @param {number} x - 发射源 X（像素坐标）
 * @param {number} y - 发射源 Y（像素坐标）
 */
export function emitParticles(pool, type, x, y) {
  const cfg = PARTICLE_TYPES[type];
  if (!cfg || !pool) return;

  for (let i = 0; i < cfg.count; i++) {
    const p = pool.acquire();
    if (!p) break;

    const angle = Math.random() * cfg.spread - cfg.spread / 2;
    const speed = cfg.speedMin + Math.random() * (cfg.speedMax - cfg.speedMin);

    p.x = x;
    p.y = y;
    p.vx = Math.cos(angle) * speed;
    p.vy = Math.sin(angle) * speed;
    p.life = cfg.lifetimeMin + Math.random() * (cfg.lifetimeMax - cfg.lifetimeMin);
    p.maxLife = p.life;
    p.color = cfg.colors[Math.floor(Math.random() * cfg.colors.length)];
    p.size = cfg.sizeMin + Math.random() * (cfg.sizeMax - cfg.sizeMin);
    p.shape = cfg.shape || 'square';
    p.active = true;
  }
}

/**
 * 更新所有活跃粒子的位置和生命期
 * @param {object} pool - 粒子池
 * @param {number} dt - 时间增量（秒）
 */
export function updateParticles(pool, dt) {
  if (!pool) return;

  for (let i = 0; i < pool.maxSize; i++) {
    const p = pool.particles[i];
    if (!p.active) continue;

    // 应用重力（从类型配置中获取）
    const cfg = PARTICLE_TYPES[findParticleType(p)];
    const gravity = cfg ? cfg.gravity : 20;

    p.vy += gravity * dt;
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.life -= dt;

    if (p.life <= 0) {
      pool.release(p);
    }
  }
}

function findParticleType(p) {
  for (const [key, cfg] of Object.entries(PARTICLE_TYPES)) {
    if (cfg.colors.includes(p.color)) return key;
  }
  return null;
}
