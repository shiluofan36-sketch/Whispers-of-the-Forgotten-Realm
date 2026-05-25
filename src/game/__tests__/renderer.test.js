import { describe, it, expect, beforeAll, vi } from 'vitest';

function createMockGradient() {
  return { addColorStop: () => {} };
}

// Mock canvas context: capture all method calls silently
function createMockCtx() {
  const props = {
    fillStyle: '',
    strokeStyle: '',
    globalAlpha: 1,
    lineWidth: 1,
    font: '',
    textAlign: '',
    textBaseline: '',
    shadowColor: '',
    shadowBlur: 0,
    imageSmoothingEnabled: true,
  };

  const methods = {
    createLinearGradient: () => createMockGradient(),
    createRadialGradient: () => createMockGradient(),
    measureText: () => ({ width: 40 }),
    getImageData: () => ({ data: new Uint8ClampedArray(4) }),
    drawImage: () => {},
  };

  const handler = {
    get(_, prop) {
      if (prop in methods) return methods[prop];
      if (prop in props) return props[prop];
      return () => {};
    },
    set(_, prop, value) {
      if (prop in props) props[prop] = value;
      return true;
    },
  };

  return new Proxy({}, handler);
}

function createMockCanvas() {
  return {
    width: 480,
    height: 480,
    getContext: () => createMockCtx(),
    toDataURL: () => 'data:image/png;base64,ok',
  };
}

// Install canvas mock before importing game modules
vi.stubGlobal('HTMLCanvasElement', class HTMLCanvasElement {
  constructor() {
    return createMockCanvas();
  }
});

// Also need to mock canvas created via document.createElement
const origCreateElement = document.createElement.bind(document);
vi.spyOn(document, 'createElement').mockImplementation((tag, ...args) => {
  if (tag.toLowerCase() === 'canvas') {
    const el = origCreateElement('canvas', ...args);
    Object.assign(el, createMockCanvas());
    return el;
  }
  return origCreateElement(tag, ...args);
});

describe('render smoke test', () => {
  let render, createInitialState;

  beforeAll(async () => {
    const renderer = await import('../renderer');
    render = renderer.render;
    const stateMod = await import('../state');
    createInitialState = stateMod.createInitialState;
  });

  it('should render EXPLORATION phase without crashing', () => {
    const state = createInitialState();
    state.gamePhase = 'exploration';
    state.obstacles = [{ x: 1, y: 1 }];
    state.monster = {
      x: 5, y: 5, hp: 30, maxHp: 30, mp: 0, maxMp: 10,
      attackMin: 8, attackMax: 12, defense: 2, exp: 20,
      name: '哥布林', color: '#88cc88', type: 'GOBLIN',
      isElite: false, statusEffects: [],
    };
    state.stairs = { x: 9, y: 9 };
    state.stairsLocked = true;
    state.floorCleared = false;
    state.particles = { list: [], render: () => {}, update: () => {}, emit: () => {} };

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    expect(() => render(ctx, state)).not.toThrow();
  });

  it('should render BATTLE phase without crashing', () => {
    const state = createInitialState();
    state.gamePhase = 'battle';
    state.obstacles = [{ x: 2, y: 3 }];
    state.monster = {
      x: 5, y: 5, hp: 50, maxHp: 50, mp: 15, maxMp: 15,
      attackMin: 15, attackMax: 20, defense: 5, exp: 50,
      name: '骷髅战士', color: '#dddddd', type: 'SKELETON',
      isElite: true, statusEffects: [{ type: 'burn', duration: 3 }],
    };
    state.battleLog = ['玩家攻击，造成 12 点伤害！', '骷髅战士攻击，造成 5 点伤害！'];
    state.particles = { list: [], render: () => {}, update: () => {}, emit: () => {} };

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    expect(() => render(ctx, state)).not.toThrow();
  });

  it('should render CAMP phase without crashing', () => {
    const state = createInitialState();
    state.gamePhase = 'camp';
    state.particles = { list: [], render: () => {}, update: () => {}, emit: () => {} };

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    expect(() => render(ctx, state)).not.toThrow();
  });
});
