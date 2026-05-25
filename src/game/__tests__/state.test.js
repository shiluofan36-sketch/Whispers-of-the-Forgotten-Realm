import { describe, it, expect } from 'vitest';
import { createInitialState } from '../state';

describe('createInitialState', () => {
  it('should return a state object with all required top-level keys', () => {
    const state = createInitialState();

    expect(state).toBeDefined();
    expect(state).toHaveProperty('player');
    expect(state).toHaveProperty('monster');
    expect(state).toHaveProperty('turn');
    expect(state).toHaveProperty('battleLog');
    expect(state).toHaveProperty('gamePhase');
    expect(state).toHaveProperty('inventory');
    expect(state).toHaveProperty('currentFloor');
    expect(state).toHaveProperty('floorName');
    expect(state).toHaveProperty('obstacles');
    expect(state).toHaveProperty('stairs');
    expect(state).toHaveProperty('monstersDefeated');
    expect(state).toHaveProperty('particles');
  });

  it('should initialize player with valid stats', () => {
    const state = createInitialState();
    const p = state.player;

    expect(p.hp).toBeGreaterThan(0);
    expect(p.maxHp).toBeGreaterThan(0);
    expect(p.hp).toBe(p.maxHp);
    expect(p.level).toBe(1);
    expect(p.exp).toBe(0);
    expect(p.mp).toBeGreaterThanOrEqual(0);
    expect(p.gold).toBe(0);
    expect(p.equipment).toEqual({ weapon: null, armor: null, accessory: null });
    expect(state.inventory).toEqual([]);
  });

  it('should start in CAMP phase', () => {
    const state = createInitialState();
    expect(state.gamePhase).toBe('camp');
  });

  it('should create unique state objects on each call', () => {
    const a = createInitialState();
    const b = createInitialState();
    expect(a).not.toBe(b);
    expect(a.player).not.toBe(b.player);
  });
});
