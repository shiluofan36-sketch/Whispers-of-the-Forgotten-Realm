/**
 * 音效管理器
 * 使用 Web Audio API 合成音效，无需外部文件
 */

let audioCtx = null;
let globalVolume = 0.5;

function getCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  // 恢复被浏览器自动播放策略挂起的上下文
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function gainNode(ctx, vol = 1) {
  const g = ctx.createGain();
  g.gain.value = vol * globalVolume;
  g.connect(ctx.destination);
  return g;
}

// ---- 合成器 ----

function synthNoise(ctx, duration, vol, highpass = false) {
  const bufferSize = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
  }
  const src = ctx.createBufferSource();
  src.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = highpass ? 'highpass' : 'bandpass';
  filter.frequency.value = highpass ? 800 : 400;
  filter.Q.value = 0.5;

  const g = gainNode(ctx, vol);
  src.connect(filter);
  filter.connect(g);
  src.start(ctx.currentTime);
  src.stop(ctx.currentTime + duration);
}

function synthTone(ctx, freq, duration, vol, type = 'square', glideTo = null) {
  const osc = ctx.createOscillator();
  osc.type = type;
  osc.frequency.value = freq;
  if (glideTo) {
    osc.frequency.linearRampToValueAtTime(glideTo, ctx.currentTime + duration);
  }
  const g = gainNode(ctx, vol);
  g.gain.setValueAtTime(vol * globalVolume, ctx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  osc.connect(g);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + duration);
}

function synthImpact(ctx, vol) {
  // 低频冲击 + 噪音
  const osc = ctx.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(150, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.15);
  const g = gainNode(ctx, vol);
  g.gain.setValueAtTime(vol * globalVolume, ctx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
  osc.connect(g);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.15);

  synthNoise(ctx, 0.08, vol * 0.5);
}

// ---- 公开 API（与旧接口一致）----

const SFX_MAP = {
  attack(ctx)       { synthNoise(ctx, 0.08, 0.4); synthImpact(ctx, 0.3); },
  crit(ctx)         { synthNoise(ctx, 0.12, 0.6, true); synthTone(ctx, 600, 0.1, 0.2, 'sawtooth', 1200); },
  block(ctx)        { synthImpact(ctx, 0.3); },
  death(ctx)        { synthTone(ctx, 400, 0.4, 0.3, 'sawtooth', 80); synthNoise(ctx, 0.3, 0.15); },
  click(ctx)        { synthTone(ctx, 800, 0.03, 0.15, 'sine', 600); },
  loot(ctx)         { synthTone(ctx, 523, 0.1, 0.2, 'sine'); setTimeout(() => synthTone(ctx, 659, 0.1, 0.2, 'sine'), 60); setTimeout(() => synthTone(ctx, 784, 0.15, 0.2, 'sine'), 120); },
  achievement(ctx)  {
    [523, 659, 784, 1047].forEach((f, i) => {
      setTimeout(() => synthTone(ctx, f, 0.2, 0.2, 'sine'), i * 100);
    });
  },
  boss_enrage(ctx)  { synthTone(ctx, 60, 0.5, 0.4, 'sawtooth', 30); synthNoise(ctx, 0.4, 0.25); },
  boss_skill(ctx)   { synthNoise(ctx, 0.3, 0.35, true); synthTone(ctx, 200, 0.25, 0.2, 'sawtooth', 60); },
  heal(ctx)         { synthTone(ctx, 440, 0.15, 0.2, 'sine', 880); },
};

export function preloadSfx() {
  // Web Audio API 合成，无需预加载
  // 仅初始化 AudioContext（需要用户交互后）
}

export function playSfx(name) {
  const fn = SFX_MAP[name];
  if (!fn) return;
  try {
    const ctx = getCtx();
    fn(ctx);
  } catch {
    // 静默
  }
}

export function setVolume(vol) {
  globalVolume = Math.max(0, Math.min(1, vol));
}
