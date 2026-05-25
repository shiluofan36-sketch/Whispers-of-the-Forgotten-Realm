// 精灵生成器：使用 Canvas 2D 整数坐标绘制像素风精灵到离屏Canvas
// 所有精灵在目标分辨率下绘制（普通32x32，Boss 64x64）
// 整数坐标 + 无抗锯齿 = 纯正像素风

const SPRITE_SIZE = 32;
const BOSS_SPRITE_SIZE = 64;

// ============================================================
//  玩家精灵（暗色盔甲骑士）
// ============================================================
function drawPlayerIdle(ctx, size, frame) {
  const s = size; // shorthand
  const bob = frame % 2 === 0 ? 0 : 1; // 微小的呼吸动画
  const y = Math.floor(s * 0.15) + bob;

  // 身体（暗色盔甲）
  ctx.fillStyle = '#334466';
  ctx.fillRect(Math.floor(s * 0.25), y, Math.floor(s * 0.5), Math.floor(s * 0.45));

  // 肩甲
  ctx.fillStyle = '#445577';
  ctx.fillRect(Math.floor(s * 0.2), y + 1, Math.floor(s * 0.6), Math.floor(s * 0.12));

  // 头
  ctx.fillStyle = '#ddbb99';
  ctx.fillRect(Math.floor(s * 0.35), Math.floor(s * 0.02) + bob, Math.floor(s * 0.3), Math.floor(s * 0.18));

  // 头盔
  ctx.fillStyle = '#556688';
  ctx.fillRect(Math.floor(s * 0.33), Math.floor(s * 0.0) + bob, Math.floor(s * 0.34), Math.floor(s * 0.08));

  // 眼睛（发光）
  ctx.fillStyle = '#44ddff';
  ctx.fillRect(Math.floor(s * 0.43), Math.floor(s * 0.08) + bob, Math.floor(s * 0.06), 2);
  ctx.fillRect(Math.floor(s * 0.53), Math.floor(s * 0.08) + bob, Math.floor(s * 0.06), 2);

  // 腿
  ctx.fillStyle = '#2a3355';
  ctx.fillRect(Math.floor(s * 0.3), y + Math.floor(s * 0.44), Math.floor(s * 0.16), Math.floor(s * 0.28));
  ctx.fillRect(Math.floor(s * 0.54), y + Math.floor(s * 0.44), Math.floor(s * 0.16), Math.floor(s * 0.28));

  // 靴子
  ctx.fillStyle = '#443322';
  ctx.fillRect(Math.floor(s * 0.28), y + Math.floor(s * 0.68), Math.floor(s * 0.2), Math.floor(s * 0.08));
  ctx.fillRect(Math.floor(s * 0.52), y + Math.floor(s * 0.68), Math.floor(s * 0.2), Math.floor(s * 0.08));

  // 武器（剑，背在背上）
  ctx.fillStyle = '#aabbcc';
  ctx.fillRect(Math.floor(s * 0.72), Math.floor(s * 0.05) + bob, 3, Math.floor(s * 0.55));
  ctx.fillStyle = '#ddcc88';
  ctx.fillRect(Math.floor(s * 0.70), Math.floor(s * 0.03) + bob, 5, 4);

  // 小盾牌
  ctx.fillStyle = '#556688';
  ctx.fillRect(Math.floor(s * 0.05), y + Math.floor(s * 0.08), Math.floor(s * 0.12), Math.floor(s * 0.35));
  ctx.fillStyle = '#aabbcc';
  ctx.fillRect(Math.floor(s * 0.08), y + Math.floor(s * 0.12), Math.floor(s * 0.06), Math.floor(s * 0.08));
}

function drawPlayerAttack(ctx, size, frame) {
  const s = size;
  // frames 0-3: windup, swing, impact, recovery
  const progress = frame / 3;

  if (frame === 0) {
    // 蓄力：身体后倾
    drawPlayerIdle(ctx, size, 0);
    ctx.fillStyle = '#aabbcc';
    ctx.fillRect(Math.floor(s * 0.72), Math.floor(s * 0.55), 3, Math.floor(s * 0.2));
  } else if (frame === 1 || frame === 2) {
    // 挥砍：前倾 + 剑在前方
    drawPlayerIdle(ctx, size, 0);
    // 覆盖绘制前倾剑
    ctx.fillStyle = '#aabbcc';
    ctx.fillRect(Math.floor(s * 0.7), Math.floor(s * 0.05), 3, Math.floor(s * 0.35));
    ctx.fillRect(Math.floor(s * 0.55), Math.floor(s * 0.02), Math.floor(s * 0.2), 3);
    if (frame === 2) {
      // 命中闪光
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(Math.floor(s * 0.52), Math.floor(s * 0.0), 6, 5);
    }
  } else {
    // 恢复
    drawPlayerIdle(ctx, size, 0);
  }
}

function drawPlayerHurt(ctx, size, frame) {
  drawPlayerIdle(ctx, size, 0);
  if (frame === 0) {
    // 红色叠加 + 后仰
    ctx.fillStyle = 'rgba(255, 60, 60, 0.5)';
    ctx.fillRect(0, 0, size, size);
  }
}

function drawPlayerDeath(ctx, size, frame) {
  const s = size;
  const progress = frame / 3;
  const alpha = 1 - progress * 0.7;
  const yOff = Math.floor(progress * 8);

  ctx.globalAlpha = alpha;
  drawPlayerIdle(ctx, size, 0);
  // 倒地偏移
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.fillRect(0, Math.floor(s * 0.85), s, Math.floor(s * 0.15));
  ctx.globalAlpha = 1;
}

// ============================================================
//  怪物精灵
// ============================================================

// 骷髅
function drawSkeletonIdle(ctx, size, frame) {
  const s = size;
  const bob = frame % 2;

  // 头骨
  ctx.fillStyle = '#dddccc';
  ctx.fillRect(Math.floor(s * 0.3), Math.floor(s * 0.05) + bob, Math.floor(s * 0.4), Math.floor(s * 0.22));
  // 眼窝
  ctx.fillStyle = '#111111';
  ctx.fillRect(Math.floor(s * 0.37), Math.floor(s * 0.1) + bob, Math.floor(s * 0.09), Math.floor(s * 0.08));
  ctx.fillRect(Math.floor(s * 0.53), Math.floor(s * 0.1) + bob, Math.floor(s * 0.09), Math.floor(s * 0.08));
  // 肋骨
  ctx.fillStyle = '#cccbbb';
  ctx.fillRect(Math.floor(s * 0.28), Math.floor(s * 0.28) + bob, Math.floor(s * 0.44), Math.floor(s * 0.28));
  ctx.fillStyle = '#111111';
  for (let i = 0; i < 3; i++) {
    ctx.fillRect(Math.floor(s * 0.32), Math.floor(s * 0.32 + i * s * 0.08) + bob, Math.floor(s * 0.36), 2);
  }
  // 骨盆
  ctx.fillStyle = '#dddccc';
  ctx.fillRect(Math.floor(s * 0.3), Math.floor(s * 0.56) + bob, Math.floor(s * 0.4), Math.floor(s * 0.1));
  // 腿骨
  ctx.fillStyle = '#dddccc';
  ctx.fillRect(Math.floor(s * 0.32), Math.floor(s * 0.64) + bob, 4, Math.floor(s * 0.3));
  ctx.fillRect(Math.floor(s * 0.55), Math.floor(s * 0.64) + bob, 4, Math.floor(s * 0.3));
  // 手臂
  ctx.fillStyle = '#dddccc';
  ctx.fillRect(Math.floor(s * 0.15), Math.floor(s * 0.3) + bob, Math.floor(s * 0.14), 4);
  ctx.fillRect(Math.floor(s * 0.7), Math.floor(s * 0.3) + bob, Math.floor(s * 0.14), 4);
}

function drawSkeletonAttack(ctx, size, frame) {
  drawSkeletonIdle(ctx, size, 0);
  const s = size;
  if (frame === 1 || frame === 2) {
    // 手臂前伸攻击
    ctx.fillStyle = '#dddccc';
    ctx.fillRect(Math.floor(s * 0.7), Math.floor(s * 0.3), Math.floor(s * 0.25), 4);
    // 骨爪
    ctx.fillRect(Math.floor(s * 0.88), Math.floor(s * 0.27), 3, 10);
  }
  if (frame === 2) {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(Math.floor(s * 0.88), Math.floor(s * 0.26), 5, 12);
  }
}

function drawSkeletonHurt(ctx, size, frame) {
  drawSkeletonIdle(ctx, size, 0);
  if (frame === 0) {
    ctx.fillStyle = 'rgba(255, 80, 80, 0.4)';
    ctx.fillRect(0, 0, size, size);
  }
}

function drawSkeletonDeath(ctx, size, frame) {
  const s = size;
  const progress = frame / 3;
  ctx.globalAlpha = 1 - progress * 0.7;
  drawSkeletonIdle(ctx, size, 0);
  // 散架效果
  if (progress > 0.3) {
    ctx.fillStyle = '#dddccc';
    ctx.fillRect(Math.floor(s * 0.3), Math.floor(s * 0.1 + progress * 20), Math.floor(s * 0.4), Math.floor(s * 0.22));
  }
  ctx.globalAlpha = 1;
}

// 史莱姆
function drawSlimeIdle(ctx, size, frame) {
  const s = size;
  const wobble = Math.sin(frame * Math.PI / 2) * 2;
  const y = Math.floor(s * 0.55);

  ctx.fillStyle = '#44cc44';
  // 身体（圆润 blob）
  ctx.fillRect(Math.floor(s * 0.15), y + wobble, Math.floor(s * 0.7), Math.floor(s * 0.35));
  ctx.fillRect(Math.floor(s * 0.2), y - 4 + wobble, Math.floor(s * 0.6), Math.floor(s * 0.4));
  ctx.fillRect(Math.floor(s * 0.25), y - 8 + wobble, Math.floor(s * 0.5), Math.floor(s * 0.4));
  // 高光
  ctx.fillStyle = '#88ee88';
  ctx.fillRect(Math.floor(s * 0.3), y - 4 + wobble, Math.floor(s * 0.12), Math.floor(s * 0.1));
  // 眼睛
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(Math.floor(s * 0.33), y - 2 + wobble, Math.floor(s * 0.1), Math.floor(s * 0.1));
  ctx.fillRect(Math.floor(s * 0.55), y - 2 + wobble, Math.floor(s * 0.1), Math.floor(s * 0.1));
  ctx.fillStyle = '#111111';
  ctx.fillRect(Math.floor(s * 0.38), y + 2 + wobble, 3, 3);
  ctx.fillRect(Math.floor(s * 0.58), y + 2 + wobble, 3, 3);
}

function drawSlimeAttack(ctx, size, frame) {
  drawSlimeIdle(ctx, size, 0);
  const s = size;
  if (frame === 1 || frame === 2) {
    // 弹跳冲击
    ctx.fillStyle = '#44cc44';
    ctx.fillRect(Math.floor(s * 0.7), Math.floor(s * 0.5), Math.floor(s * 0.2), Math.floor(s * 0.15));
  }
}

function drawSlimeHurt(ctx, size, frame) {
  const s = size;
  if (frame === 0) {
    // 压扁效果
    ctx.fillStyle = '#33aa33';
    ctx.fillRect(Math.floor(s * 0.1), Math.floor(s * 0.65), Math.floor(s * 0.8), Math.floor(s * 0.2));
    ctx.fillRect(Math.floor(s * 0.15), Math.floor(s * 0.6), Math.floor(s * 0.7), Math.floor(s * 0.25));
    ctx.fillStyle = 'rgba(255, 60, 60, 0.4)';
    ctx.fillRect(0, 0, size, size);
  } else {
    drawSlimeIdle(ctx, size, 0);
  }
}

function drawSlimeDeath(ctx, size, frame) {
  const s = size;
  const progress = frame / 3;
  ctx.globalAlpha = 1 - progress * 0.7;
  // 融化
  ctx.fillStyle = '#44cc44';
  ctx.fillRect(Math.floor(s * 0.05), Math.floor(s * 0.75), Math.floor(s * 0.9), Math.floor(s * 0.15));
  ctx.fillRect(Math.floor(s * 0.1), Math.floor(s * 0.7), Math.floor(s * 0.8), Math.floor(s * 0.2));
  ctx.globalAlpha = 1;
}

// 哥布林
function drawGoblinIdle(ctx, size, frame) {
  const s = size;
  const bob = frame % 2;
  // 身体（矮小绿色）
  ctx.fillStyle = '#55aa44';
  ctx.fillRect(Math.floor(s * 0.3), Math.floor(s * 0.3) + bob, Math.floor(s * 0.4), Math.floor(s * 0.35));
  // 头
  ctx.fillStyle = '#66bb55';
  ctx.fillRect(Math.floor(s * 0.3), Math.floor(s * 0.08) + bob, Math.floor(s * 0.4), Math.floor(s * 0.25));
  // 耳朵
  ctx.fillStyle = '#44aa33';
  ctx.fillRect(Math.floor(s * 0.2), Math.floor(s * 0.1) + bob, Math.floor(s * 0.12), Math.floor(s * 0.12));
  ctx.fillRect(Math.floor(s * 0.68), Math.floor(s * 0.1) + bob, Math.floor(s * 0.12), Math.floor(s * 0.12));
  // 眼睛
  ctx.fillStyle = '#ffdd00';
  ctx.fillRect(Math.floor(s * 0.37), Math.floor(s * 0.14) + bob, Math.floor(s * 0.1), Math.floor(s * 0.08));
  ctx.fillRect(Math.floor(s * 0.53), Math.floor(s * 0.14) + bob, Math.floor(s * 0.1), Math.floor(s * 0.08));
  // 腿
  ctx.fillStyle = '#449933';
  ctx.fillRect(Math.floor(s * 0.34), Math.floor(s * 0.64) + bob, Math.floor(s * 0.14), Math.floor(s * 0.2));
  ctx.fillRect(Math.floor(s * 0.52), Math.floor(s * 0.64) + bob, Math.floor(s * 0.14), Math.floor(s * 0.2));
  // 小匕首
  ctx.fillStyle = '#888888';
  ctx.fillRect(Math.floor(s * 0.72), Math.floor(s * 0.3) + bob, 2, Math.floor(s * 0.2));
}

function drawGoblinAttack(ctx, size, frame) {
  drawGoblinIdle(ctx, size, 0);
  const s = size;
  if (frame === 1 || frame === 2) {
    ctx.fillStyle = '#888888';
    ctx.fillRect(Math.floor(s * 0.7), Math.floor(s * 0.25), 3, Math.floor(s * 0.25));
  }
  if (frame === 2) {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(Math.floor(s * 0.82), Math.floor(s * 0.24), 5, 8);
  }
}

function drawGoblinHurt(ctx, size, frame) {
  drawGoblinIdle(ctx, size, 0);
  if (frame === 0) {
    ctx.fillStyle = 'rgba(255, 60, 60, 0.4)';
    ctx.fillRect(0, 0, size, size);
  }
}

function drawGoblinDeath(ctx, size, frame) {
  const progress = frame / 3;
  ctx.globalAlpha = 1 - progress * 0.7;
  drawGoblinIdle(ctx, size, 0);
  if (progress > 0.5) {
    // X眼
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(Math.floor(size * 0.37), Math.floor(size * 0.14), Math.floor(size * 0.17), 2);
    ctx.fillRect(Math.floor(size * 0.37), Math.floor(size * 0.14), 2, Math.floor(size * 0.08));
  }
  ctx.globalAlpha = 1;
}

// 暗影
function drawShadowIdle(ctx, size, frame) {
  const s = size;
  const phase = Math.sin(frame * Math.PI / 2) * 0.1;
  ctx.fillStyle = 'rgba(120, 40, 180, 0.7)';
  // 飘忽的斗篷形态
  ctx.fillRect(Math.floor(s * 0.2 - phase * 10), Math.floor(s * 0.05), Math.floor(s * 0.6 + phase * 20), Math.floor(s * 0.7));
  // 头部区域（略微亮）
  ctx.fillStyle = 'rgba(180, 80, 220, 0.6)';
  ctx.fillRect(Math.floor(s * 0.33), Math.floor(s * 0.0), Math.floor(s * 0.34), Math.floor(s * 0.2));
  // 发光眼睛
  ctx.fillStyle = '#ff44ff';
  ctx.fillRect(Math.floor(s * 0.38), Math.floor(s * 0.06), 4, 3);
  ctx.fillRect(Math.floor(s * 0.55), Math.floor(s * 0.06), 4, 3);
  // 飘忽的底部
  ctx.fillStyle = 'rgba(80, 20, 120, 0.5)';
  ctx.fillRect(Math.floor(s * 0.15 - phase * 5), Math.floor(s * 0.75), Math.floor(s * 0.7 + phase * 10), Math.floor(s * 0.1));
}

function drawShadowAttack(ctx, size, frame) {
  drawShadowIdle(ctx, size, 0);
  const s = size;
  if (frame === 1 || frame === 2) {
    ctx.fillStyle = 'rgba(180, 40, 220, 0.8)';
    ctx.fillRect(Math.floor(s * 0.7), Math.floor(s * 0.2), Math.floor(s * 0.25), Math.floor(s * 0.15));
  }
}

function drawShadowHurt(ctx, size, frame) {
  drawShadowIdle(ctx, size, 0);
  if (frame === 0) {
    ctx.fillStyle = 'rgba(255, 100, 255, 0.5)';
    ctx.fillRect(0, 0, size, size);
  }
}

function drawShadowDeath(ctx, size, frame) {
  const progress = frame / 3;
  ctx.globalAlpha = 1 - progress;
  drawShadowIdle(ctx, size, 0);
  // 消散粒子
  for (let i = 0; i < 5; i++) {
    const px = Math.floor(size * (0.2 + Math.random() * 0.6));
    const py = Math.floor(size * (0.3 + Math.random() * 0.4)) + Math.floor(progress * 15);
    ctx.fillStyle = 'rgba(180, 40, 220, 0.5)';
    ctx.fillRect(px, py, 3, 3);
  }
  ctx.globalAlpha = 1;
}

// 巨鼠
function drawRatIdle(ctx, size, frame) {
  const s = size;
  const bob = frame % 2;
  // 身体
  ctx.fillStyle = '#aa8844';
  ctx.fillRect(Math.floor(s * 0.2), Math.floor(s * 0.35) + bob, Math.floor(s * 0.6), Math.floor(s * 0.3));
  // 头
  ctx.fillStyle = '#bb9955';
  ctx.fillRect(Math.floor(s * 0.05), Math.floor(s * 0.25) + bob, Math.floor(s * 0.28), Math.floor(s * 0.25));
  // 耳朵
  ctx.fillStyle = '#cc9966';
  ctx.fillRect(Math.floor(s * 0.1), Math.floor(s * 0.15) + bob, Math.floor(s * 0.1), Math.floor(s * 0.12));
  ctx.fillRect(Math.floor(s * 0.2), Math.floor(s * 0.15) + bob, Math.floor(s * 0.1), Math.floor(s * 0.12));
  // 眼睛
  ctx.fillStyle = '#ff0000';
  ctx.fillRect(Math.floor(s * 0.1), Math.floor(s * 0.3) + bob, 4, 3);
  ctx.fillStyle = '#ff4444';
  ctx.fillRect(Math.floor(s * 0.15), Math.floor(s * 0.3) + bob, 4, 3);
  // 尾巴
  ctx.fillStyle = '#886633';
  ctx.fillRect(Math.floor(s * 0.8), Math.floor(s * 0.4) + bob, Math.floor(s * 0.18), 3);
  // 腿
  ctx.fillStyle = '#997744';
  ctx.fillRect(Math.floor(s * 0.28), Math.floor(s * 0.6) + bob, Math.floor(s * 0.12), Math.floor(s * 0.15));
  ctx.fillRect(Math.floor(s * 0.55), Math.floor(s * 0.6) + bob, Math.floor(s * 0.12), Math.floor(s * 0.15));
}

function drawRatAttack(ctx, size, frame) {
  drawRatIdle(ctx, size, 0);
  const s = size;
  if (frame === 1 || frame === 2) {
    // 撕咬前冲
    ctx.fillStyle = '#aa8844';
    ctx.fillRect(Math.floor(s * 0.8), Math.floor(s * 0.3), Math.floor(s * 0.18), Math.floor(s * 0.15));
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(Math.floor(s * 0.88), Math.floor(s * 0.33), 4, 4);
  }
}

function drawRatHurt(ctx, size, frame) {
  drawRatIdle(ctx, size, 0);
  if (frame === 0) {
    ctx.fillStyle = 'rgba(255, 60, 60, 0.4)';
    ctx.fillRect(0, 0, size, size);
  }
}

function drawRatDeath(ctx, size, frame) {
  const progress = frame / 3;
  ctx.globalAlpha = 1 - progress * 0.7;
  drawRatIdle(ctx, size, 0);
  // X眼
  if (progress > 0.5) {
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(Math.floor(size * 0.08), Math.floor(size * 0.3), Math.floor(size * 0.12), 2);
  }
  ctx.globalAlpha = 1;
}

// 邪教徒（cultist - 新增）
function drawCultistIdle(ctx, size, frame) {
  const s = size;
  const bob = frame % 2;
  // 长袍身体
  ctx.fillStyle = '#442244';
  ctx.fillRect(Math.floor(s * 0.25), Math.floor(s * 0.2) + bob, Math.floor(s * 0.5), Math.floor(s * 0.55));
  // 兜帽头
  ctx.fillStyle = '#331133';
  ctx.fillRect(Math.floor(s * 0.28), Math.floor(s * 0.02) + bob, Math.floor(s * 0.44), Math.floor(s * 0.22));
  // 兜帽三角尖
  ctx.fillStyle = '#331133';
  ctx.fillRect(Math.floor(s * 0.42), Math.floor(s * -0.02) + bob, Math.floor(s * 0.16), Math.floor(s * 0.08));
  // 发光眼睛
  ctx.fillStyle = '#ff4444';
  ctx.fillRect(Math.floor(s * 0.38), Math.floor(s * 0.1) + bob, 3, 3);
  ctx.fillRect(Math.floor(s * 0.55), Math.floor(s * 0.1) + bob, 3, 3);
  // 法杖
  ctx.fillStyle = '#664422';
  ctx.fillRect(Math.floor(s * 0.78), Math.floor(s * 0.25) + bob, 3, Math.floor(s * 0.45));
  ctx.fillStyle = '#ff4466';
  ctx.fillRect(Math.floor(s * 0.76), Math.floor(s * 0.22) + bob, 7, 6);
}

function drawCultistAttack(ctx, size, frame) {
  drawCultistIdle(ctx, size, 0);
  const s = size;
  if (frame === 1 || frame === 2) {
    // 法杖发光 + 投射物
    ctx.fillStyle = '#ff4466';
    ctx.fillRect(Math.floor(s * 0.73), Math.floor(s * 0.2), Math.floor(s * 0.12), Math.floor(s * 0.12));
  }
  if (frame === 2) {
    ctx.fillStyle = '#ff6688';
    ctx.fillRect(Math.floor(s * 0.85), Math.floor(s * 0.22), 8, 8);
  }
}

function drawCultistHurt(ctx, size, frame) {
  drawCultistIdle(ctx, size, 0);
  if (frame === 0) {
    ctx.fillStyle = 'rgba(255, 60, 60, 0.4)';
    ctx.fillRect(0, 0, size, size);
  }
}

function drawCultistDeath(ctx, size, frame) {
  const progress = frame / 3;
  ctx.globalAlpha = 1 - progress * 0.7;
  drawCultistIdle(ctx, size, 0);
  ctx.globalAlpha = 1;
}

// 狼（wolf - 新增）
function drawWolfIdle(ctx, size, frame) {
  const s = size;
  const bob = frame % 2;
  // 身体
  ctx.fillStyle = '#555566';
  ctx.fillRect(Math.floor(s * 0.2), Math.floor(s * 0.35) + bob, Math.floor(s * 0.6), Math.floor(s * 0.25));
  // 鬃毛
  ctx.fillStyle = '#444455';
  ctx.fillRect(Math.floor(s * 0.3), Math.floor(s * 0.28) + bob, Math.floor(s * 0.4), Math.floor(s * 0.1));
  // 头
  ctx.fillStyle = '#606070';
  ctx.fillRect(Math.floor(s * 0.08), Math.floor(s * 0.22) + bob, Math.floor(s * 0.25), Math.floor(s * 0.22));
  // 耳朵
  ctx.fillStyle = '#555566';
  ctx.fillRect(Math.floor(s * 0.1), Math.floor(s * 0.12) + bob, Math.floor(s * 0.08), Math.floor(s * 0.12));
  ctx.fillRect(Math.floor(s * 0.2), Math.floor(s * 0.12) + bob, Math.floor(s * 0.08), Math.floor(s * 0.12));
  // 眼睛
  ctx.fillStyle = '#ffcc00';
  ctx.fillRect(Math.floor(s * 0.12), Math.floor(s * 0.26) + bob, 3, 3);
  ctx.fillStyle = '#ffcc00';
  ctx.fillRect(Math.floor(s * 0.18), Math.floor(s * 0.26) + bob, 3, 3);
  // 尾巴
  ctx.fillStyle = '#555566';
  ctx.fillRect(Math.floor(s * 0.78), Math.floor(s * 0.28) + bob, Math.floor(s * 0.1), 8);
  // 腿
  ctx.fillStyle = '#4a4a5a';
  ctx.fillRect(Math.floor(s * 0.25), Math.floor(s * 0.58) + bob, Math.floor(s * 0.1), Math.floor(s * 0.2));
  ctx.fillRect(Math.floor(s * 0.55), Math.floor(s * 0.58) + bob, Math.floor(s * 0.1), Math.floor(s * 0.2));
  // 爪子
  ctx.fillStyle = '#333344';
  ctx.fillRect(Math.floor(s * 0.23), Math.floor(s * 0.74) + bob, Math.floor(s * 0.14), 4);
  ctx.fillRect(Math.floor(s * 0.53), Math.floor(s * 0.74) + bob, Math.floor(s * 0.14), 4);
}

function drawWolfAttack(ctx, size, frame) {
  drawWolfIdle(ctx, size, 0);
  const s = size;
  if (frame === 1 || frame === 2) {
    // 扑击
    ctx.fillStyle = '#606070';
    ctx.fillRect(Math.floor(s * 0.78), Math.floor(s * 0.25), Math.floor(s * 0.2), Math.floor(s * 0.15));
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(Math.floor(s * 0.85), Math.floor(s * 0.3), 5, 3);
  }
}

function drawWolfHurt(ctx, size, frame) {
  drawWolfIdle(ctx, size, 0);
  if (frame === 0) {
    ctx.fillStyle = 'rgba(255, 60, 60, 0.4)';
    ctx.fillRect(0, 0, size, size);
  }
}

function drawWolfDeath(ctx, size, frame) {
  const progress = frame / 3;
  ctx.globalAlpha = 1 - progress * 0.7;
  drawWolfIdle(ctx, size, 0);
  ctx.globalAlpha = 1;
}

// ============================================================
//  Boss 精灵（64x64）
// ============================================================

function drawDragonIdle(ctx, size, frame) {
  const s = size;
  const bob = frame % 2 ? 1 : 0;
  // 巨大身躯
  ctx.fillStyle = '#cc2200';
  ctx.fillRect(Math.floor(s * 0.1), Math.floor(s * 0.3) + bob, Math.floor(s * 0.8), Math.floor(s * 0.45));
  // 鳞片高光
  ctx.fillStyle = '#ee4422';
  ctx.fillRect(Math.floor(s * 0.3), Math.floor(s * 0.33) + bob, Math.floor(s * 0.4), Math.floor(s * 0.12));
  // 翅膀（展开）
  ctx.fillStyle = '#aa1100';
  ctx.fillRect(Math.floor(s * 0.05), Math.floor(s * 0.1) + bob, Math.floor(s * 0.2), Math.floor(s * 0.25));
  ctx.fillRect(Math.floor(s * 0.75), Math.floor(s * 0.1) + bob, Math.floor(s * 0.2), Math.floor(s * 0.25));
  // 头
  ctx.fillStyle = '#dd3300';
  ctx.fillRect(Math.floor(s * 0.05), Math.floor(s * 0.25) + bob, Math.floor(s * 0.25), Math.floor(s * 0.2));
  // 角
  ctx.fillStyle = '#884400';
  ctx.fillRect(Math.floor(s * 0.08), Math.floor(s * 0.12) + bob, Math.floor(s * 0.06), Math.floor(s * 0.15));
  ctx.fillRect(Math.floor(s * 0.2), Math.floor(s * 0.12) + bob, Math.floor(s * 0.06), Math.floor(s * 0.15));
  // 眼睛
  ctx.fillStyle = '#ff4400';
  ctx.fillRect(Math.floor(s * 0.12), Math.floor(s * 0.28) + bob, 6, 5);
  // 腿
  ctx.fillStyle = '#aa1800';
  ctx.fillRect(Math.floor(s * 0.15), Math.floor(s * 0.72) + bob, Math.floor(s * 0.12), Math.floor(s * 0.2));
  ctx.fillRect(Math.floor(s * 0.7), Math.floor(s * 0.72) + bob, Math.floor(s * 0.12), Math.floor(s * 0.2));
  // 尾巴
  ctx.fillStyle = '#cc2200';
  ctx.fillRect(Math.floor(s * 0.85), Math.floor(s * 0.4) + bob, Math.floor(s * 0.13), Math.floor(s * 0.08));
}

function drawDragonAttack(ctx, size, frame) {
  drawDragonIdle(ctx, size, 0);
  const s = size;
  if (frame === 1) {
    // 火焰吐息准备
    ctx.fillStyle = '#ff6600';
    ctx.fillRect(Math.floor(s * 0.28), Math.floor(s * 0.28), Math.floor(s * 0.15), Math.floor(s * 0.15));
  } else if (frame === 2) {
    // 火焰喷射
    ctx.fillStyle = '#ff4400';
    ctx.fillRect(Math.floor(s * 0.28), Math.floor(s * 0.2), Math.floor(s * 0.55), Math.floor(s * 0.2));
    ctx.fillStyle = '#ffaa00';
    ctx.fillRect(Math.floor(s * 0.4), Math.floor(s * 0.15), Math.floor(s * 0.4), Math.floor(s * 0.1));
    ctx.fillStyle = '#ffdd00';
    ctx.fillRect(Math.floor(s * 0.5), Math.floor(s * 0.12), Math.floor(s * 0.3), Math.floor(s * 0.08));
  }
}

function drawDragonHurt(ctx, size, frame) {
  drawDragonIdle(ctx, size, 0);
  if (frame === 0) {
    ctx.fillStyle = 'rgba(255, 80, 80, 0.4)';
    ctx.fillRect(0, 0, size, size);
  }
}

function drawDragonDeath(ctx, size, frame) {
  const progress = frame / 3;
  ctx.globalAlpha = 1 - progress * 0.7;
  drawDragonIdle(ctx, size, 0);
  if (progress > 0.5) {
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(Math.floor(size * 0.12), Math.floor(size * 0.28), Math.floor(size * 0.12), 6);
  }
  ctx.globalAlpha = 1;
}

// 恶魔领主
function drawDemonIdle(ctx, size, frame) {
  const s = size;
  const bob = frame % 2;
  // 巨大身躯
  ctx.fillStyle = '#661188';
  ctx.fillRect(Math.floor(s * 0.15), Math.floor(s * 0.25) + bob, Math.floor(s * 0.7), Math.floor(s * 0.5));
  // 角
  ctx.fillStyle = '#330044';
  ctx.fillRect(Math.floor(s * 0.2), Math.floor(s * 0.02) + bob, Math.floor(s * 0.08), Math.floor(s * 0.25));
  ctx.fillRect(Math.floor(s * 0.7), Math.floor(s * 0.02) + bob, Math.floor(s * 0.08), Math.floor(s * 0.25));
  // 翅膀
  ctx.fillStyle = '#440055';
  ctx.fillRect(Math.floor(s * 0.02), Math.floor(s * 0.15) + bob, Math.floor(s * 0.18), Math.floor(s * 0.35));
  ctx.fillRect(Math.floor(s * 0.8), Math.floor(s * 0.15) + bob, Math.floor(s * 0.18), Math.floor(s * 0.35));
  // 头
  ctx.fillStyle = '#772299';
  ctx.fillRect(Math.floor(s * 0.3), Math.floor(s * 0.05) + bob, Math.floor(s * 0.4), Math.floor(s * 0.25));
  // 眼睛
  ctx.fillStyle = '#ff0000';
  ctx.fillRect(Math.floor(s * 0.38), Math.floor(s * 0.12) + bob, 6, 5);
  ctx.fillRect(Math.floor(s * 0.55), Math.floor(s * 0.12) + bob, 6, 5);
  // 武器（巨剑）
  ctx.fillStyle = '#ff4466';
  ctx.fillRect(Math.floor(s * 0.82), Math.floor(s * 0.2) + bob, 5, Math.floor(s * 0.6));
  ctx.fillStyle = '#ffaa00';
  ctx.fillRect(Math.floor(s * 0.78), Math.floor(s * 0.16) + bob, Math.floor(s * 0.13), Math.floor(s * 0.1));
}

function drawDemonAttack(ctx, size, frame) {
  drawDemonIdle(ctx, size, 0);
  const s = size;
  if (frame === 1 || frame === 2) {
    ctx.fillStyle = '#ff4466';
    ctx.fillRect(Math.floor(s * 0.5), Math.floor(s * 0.1), 6, Math.floor(s * 0.5));
    if (frame === 2) {
      ctx.fillStyle = '#ff6688';
      ctx.fillRect(Math.floor(s * 0.45), Math.floor(s * 0.05), Math.floor(s * 0.15), Math.floor(s * 0.15));
    }
  }
}

function drawDemonHurt(ctx, size, frame) {
  drawDemonIdle(ctx, size, 0);
  if (frame === 0) {
    ctx.fillStyle = 'rgba(255, 80, 80, 0.4)';
    ctx.fillRect(0, 0, size, size);
  }
}

function drawDemonDeath(ctx, size, frame) {
  const progress = frame / 3;
  ctx.globalAlpha = 1 - progress * 0.7;
  drawDemonIdle(ctx, size, 0);
  ctx.globalAlpha = 1;
}

// 暗影领主
function drawShadowLordIdle(ctx, size, frame) {
  const s = size;
  const phase = Math.sin(frame * Math.PI / 2) * 0.08;
  ctx.fillStyle = 'rgba(60, 10, 100, 0.8)';
  ctx.fillRect(Math.floor(s * 0.1 - phase * 15), Math.floor(s * 0.05), Math.floor(s * 0.8 + phase * 30), Math.floor(s * 0.8));
  // 皇冠/角
  ctx.fillStyle = '#aa44ff';
  ctx.fillRect(Math.floor(s * 0.38), Math.floor(s * -0.02), Math.floor(s * 0.24), Math.floor(s * 0.1));
  // 眼睛
  ctx.fillStyle = '#ff44ff';
  ctx.fillRect(Math.floor(s * 0.33), Math.floor(s * 0.12), 8, 6);
  ctx.fillRect(Math.floor(s * 0.56), Math.floor(s * 0.12), 8, 6);
  // 飘忽底部
  ctx.fillStyle = 'rgba(30, 5, 60, 0.5)';
  ctx.fillRect(Math.floor(s * 0.05 - phase * 8), Math.floor(s * 0.8), Math.floor(s * 0.9 + phase * 16), Math.floor(s * 0.1));
}

function drawShadowLordAttack(ctx, size, frame) {
  drawShadowLordIdle(ctx, size, 0);
  const s = size;
  if (frame === 1 || frame === 2) {
    ctx.fillStyle = '#cc44ff';
    ctx.fillRect(Math.floor(s * 0.6), Math.floor(s * 0.25), Math.floor(s * 0.35), Math.floor(s * 0.2));
    if (frame === 2) {
      ctx.fillStyle = '#ff88ff';
      ctx.fillRect(Math.floor(s * 0.7), Math.floor(s * 0.2), Math.floor(s * 0.25), Math.floor(s * 0.25));
    }
  }
}

function drawShadowLordHurt(ctx, size, frame) {
  drawShadowLordIdle(ctx, size, 0);
  if (frame === 0) {
    ctx.fillStyle = 'rgba(255, 100, 255, 0.4)';
    ctx.fillRect(0, 0, size, size);
  }
}

function drawShadowLordDeath(ctx, size, frame) {
  const progress = frame / 3;
  ctx.globalAlpha = 1 - progress;
  drawShadowLordIdle(ctx, size, 0);
  ctx.globalAlpha = 1;
}

// 火焰元素
function drawFireElementalIdle(ctx, size, frame) {
  const s = size;
  const flicker = Math.sin(frame * Math.PI / 2) * 3;
  // 火焰身体
  ctx.fillStyle = '#ff4400';
  ctx.fillRect(Math.floor(s * 0.2), Math.floor(s * 0.1) + flicker, Math.floor(s * 0.6), Math.floor(s * 0.7));
  ctx.fillStyle = '#ff6600';
  ctx.fillRect(Math.floor(s * 0.25), Math.floor(s * 0.15) + flicker, Math.floor(s * 0.5), Math.floor(s * 0.6));
  ctx.fillStyle = '#ff8800';
  ctx.fillRect(Math.floor(s * 0.3), Math.floor(s * 0.2) + flicker, Math.floor(s * 0.4), Math.floor(s * 0.5));
  // 火焰顶部尖刺
  ctx.fillStyle = '#ffaa00';
  ctx.fillRect(Math.floor(s * 0.35), Math.floor(s * 0.02) + flicker, Math.floor(s * 0.08), Math.floor(s * 0.15));
  ctx.fillRect(Math.floor(s * 0.55), Math.floor(s * 0.04) + flicker, Math.floor(s * 0.08), Math.floor(s * 0.12));
  // 眼睛
  ctx.fillStyle = '#ffdd00';
  ctx.fillRect(Math.floor(s * 0.35), Math.floor(s * 0.2) + flicker, 8, 6);
  ctx.fillRect(Math.floor(s * 0.55), Math.floor(s * 0.2) + flicker, 8, 6);
}

function drawFireElementalAttack(ctx, size, frame) {
  drawFireElementalIdle(ctx, size, 0);
  const s = size;
  if (frame === 1 || frame === 2) {
    ctx.fillStyle = '#ff4400';
    ctx.fillRect(Math.floor(s * 0.6), Math.floor(s * 0.1), Math.floor(s * 0.35), Math.floor(s * 0.3));
    ctx.fillStyle = '#ffaa00';
    ctx.fillRect(Math.floor(s * 0.7), Math.floor(s * 0.05), Math.floor(s * 0.25), Math.floor(s * 0.2));
  }
}

function drawFireElementalHurt(ctx, size, frame) {
  drawFireElementalIdle(ctx, size, 0);
  if (frame === 0) {
    ctx.fillStyle = 'rgba(100, 100, 255, 0.3)';
    ctx.fillRect(0, 0, size, size);
  }
}

function drawFireElementalDeath(ctx, size, frame) {
  const progress = frame / 3;
  ctx.globalAlpha = 1 - progress * 0.7;
  // 火焰变小
  ctx.fillStyle = '#ff4400';
  ctx.fillRect(Math.floor(size * 0.25 - progress * 5), Math.floor(size * 0.2 + progress * 20), Math.floor(size * 0.5 - progress * 10), Math.floor(size * 0.5 - progress * 20));
  ctx.globalAlpha = 1;
}

// 亡灵法师
function drawNecromancerIdle(ctx, size, frame) {
  const s = size;
  const bob = frame % 2;
  // 长袍
  ctx.fillStyle = '#224422';
  ctx.fillRect(Math.floor(s * 0.2), Math.floor(s * 0.2) + bob, Math.floor(s * 0.6), Math.floor(s * 0.6));
  // 骷髅头
  ctx.fillStyle = '#ccbb99';
  ctx.fillRect(Math.floor(s * 0.32), Math.floor(s * 0.02) + bob, Math.floor(s * 0.36), Math.floor(s * 0.22));
  // 眼窝（绿光）
  ctx.fillStyle = '#44ff44';
  ctx.fillRect(Math.floor(s * 0.37), Math.floor(s * 0.08) + bob, 6, 5);
  ctx.fillRect(Math.floor(s * 0.55), Math.floor(s * 0.08) + bob, 6, 5);
  // 法杖
  ctx.fillStyle = '#444433';
  ctx.fillRect(Math.floor(s * 0.82), Math.floor(s * 0.2) + bob, 4, Math.floor(s * 0.55));
  // 法杖宝石
  ctx.fillStyle = '#44ff44';
  ctx.fillRect(Math.floor(s * 0.78), Math.floor(s * 0.16) + bob, Math.floor(s * 0.12), Math.floor(s * 0.1));
  // 光环
  ctx.fillStyle = 'rgba(40, 255, 40, 0.15)';
  ctx.fillRect(Math.floor(s * 0.1), Math.floor(s * 0.5) + bob, Math.floor(s * 0.8), Math.floor(s * 0.2));
}

function drawNecromancerAttack(ctx, size, frame) {
  drawNecromancerIdle(ctx, size, 0);
  const s = size;
  if (frame === 1 || frame === 2) {
    ctx.fillStyle = '#44ff44';
    ctx.fillRect(Math.floor(s * 0.65), Math.floor(s * 0.2), Math.floor(s * 0.2), Math.floor(s * 0.2));
    if (frame === 2) {
      ctx.fillStyle = '#88ff88';
      ctx.fillRect(Math.floor(s * 0.7), Math.floor(s * 0.15), Math.floor(s * 0.25), Math.floor(s * 0.25));
    }
  }
}

function drawNecromancerHurt(ctx, size, frame) {
  drawNecromancerIdle(ctx, size, 0);
  if (frame === 0) {
    ctx.fillStyle = 'rgba(255, 60, 60, 0.4)';
    ctx.fillRect(0, 0, size, size);
  }
}

function drawNecromancerDeath(ctx, size, frame) {
  const progress = frame / 3;
  ctx.globalAlpha = 1 - progress * 0.7;
  drawNecromancerIdle(ctx, size, 0);
  ctx.globalAlpha = 1;
}

// ============================================================
//  精灵绘制调度表
// ============================================================

const NORMAL_DRAWERS = {
  player:  { idle: drawPlayerIdle, attack: drawPlayerAttack, hurt: drawPlayerHurt, death: drawPlayerDeath },
  GOBLIN:  { idle: drawGoblinIdle, attack: drawGoblinAttack, hurt: drawGoblinHurt, death: drawGoblinDeath },
  SKELETON:{ idle: drawSkeletonIdle, attack: drawSkeletonAttack, hurt: drawSkeletonHurt, death: drawSkeletonDeath },
  SLIME:   { idle: drawSlimeIdle, attack: drawSlimeAttack, hurt: drawSlimeHurt, death: drawSlimeDeath },
  SHADOW:  { idle: drawShadowIdle, attack: drawShadowAttack, hurt: drawShadowHurt, death: drawShadowDeath },
  GIANT_RAT:{ idle: drawRatIdle, attack: drawRatAttack, hurt: drawRatHurt, death: drawRatDeath },
  cultist: { idle: drawCultistIdle, attack: drawCultistAttack, hurt: drawCultistHurt, death: drawCultistDeath },
  wolf:    { idle: drawWolfIdle, attack: drawWolfAttack, hurt: drawWolfHurt, death: drawWolfDeath },
};

const BOSS_DRAWERS = {
  ANCIENT_DRAGON:  { idle: drawDragonIdle, attack: drawDragonAttack, hurt: drawDragonHurt, death: drawDragonDeath, enrage: drawDragonIdle },
  DEMON_LORD:      { idle: drawDemonIdle, attack: drawDemonAttack, hurt: drawDemonHurt, death: drawDemonDeath, enrage: drawDemonIdle },
  SHADOW_LORD:     { idle: drawShadowLordIdle, attack: drawShadowLordAttack, hurt: drawShadowLordHurt, death: drawShadowLordDeath, enrage: drawShadowLordIdle },
  FIRE_ELEMENTAL:  { idle: drawFireElementalIdle, attack: drawFireElementalAttack, hurt: drawFireElementalHurt, death: drawFireElementalDeath, enrage: drawFireElementalIdle },
  NECROMANCER:     { idle: drawNecromancerIdle, attack: drawNecromancerAttack, hurt: drawNecromancerHurt, death: drawNecromancerDeath, enrage: drawNecromancerIdle },
};

const FRAME_COUNTS = {
  idle: 4, attack: 4, hurt: 2, death: 4, enrage: 4,
};

/**
 * 为一个实体类型的所有动画帧生成离屏Canvas
 * @returns Map<string, CanvasImageSource[]> key: "entityType:animType" → frames[]
 */
export function generateAllSprites() {
  const cache = new Map();

  // 普通精灵 (32x32)
  for (const [entityType, drawers] of Object.entries(NORMAL_DRAWERS)) {
    for (const [animType, drawFn] of Object.entries(drawers)) {
      const frameCount = FRAME_COUNTS[animType] || 4;
      const frames = [];
      for (let i = 0; i < frameCount; i++) {
        const canvas = document.createElement('canvas');
        canvas.width = SPRITE_SIZE;
        canvas.height = SPRITE_SIZE;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;
        drawFn(ctx, SPRITE_SIZE, i);
        frames.push(canvas);
      }
      cache.set(`${entityType}:${animType}`, frames);
    }
  }

  // Boss 精灵 (64x64)
  for (const [bossKey, drawers] of Object.entries(BOSS_DRAWERS)) {
    for (const [animType, drawFn] of Object.entries(drawers)) {
      const frameCount = FRAME_COUNTS[animType] || 4;
      const frames = [];
      for (let i = 0; i < frameCount; i++) {
        const canvas = document.createElement('canvas');
        canvas.width = BOSS_SPRITE_SIZE;
        canvas.height = BOSS_SPRITE_SIZE;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;
        drawFn(ctx, BOSS_SPRITE_SIZE, i);
        frames.push(canvas);
      }
      cache.set(`boss:${bossKey}:${animType}`, frames);
    }
  }

  return cache;
}

export { SPRITE_SIZE, BOSS_SPRITE_SIZE, FRAME_COUNTS, NORMAL_DRAWERS, BOSS_DRAWERS };
