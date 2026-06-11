/**
 * 技能特效工厂 — 将技能 key 映射为特效配置
 *
 * 映射表数据驱动，新增技能只需在 SKILL_EFFECT_MAP 添加条目。
 * 与技能逻辑完全解耦：修改特效不影响伤害计算。
 */

import { addSkillEffect } from './skillEffectRenderer';
import { GAME_PHASE } from '../constants';

// 玩家技能 key 列表（用于战斗特效方向判断）
const PLAYER_SKILLS = new Set([
  'HEAVY_STRIKE', 'SHIELD', 'DRAIN', 'POISON_STRIKE', 'ICE_BARRIER',
]);

// 自施法技能：特效应留在施法者身上，不飞向目标
const SELF_TARGET_SKILLS = new Set(['SHIELD', 'ICE_BARRIER']);

/**
 * 技能 → 特效映射
 * 每个技能可配置多个特效（如伤害+治疗同时发生）
 */
const SKILL_EFFECT_MAP = {
  // 玩家技能
  HEAVY_STRIKE: [
    { type: 'slash', color: '#ffaa00' },
    { type: 'flash', color: '#ff8800', duration: 0.15 },
  ],
  SHIELD: [
    { type: 'pulse', color: '#4488ff' },
  ],
  DRAIN: [
    { type: 'projectile', color: '#ff4466' },
    { type: 'pulse', color: '#ff4466', duration: 0.2 },
  ],
  POISON_STRIKE: [
    { type: 'slash', color: '#44ff44' },
  ],
  ICE_BARRIER: [
    { type: 'flash', color: '#88ccff', duration: 0.25 },
    { type: 'pulse', color: '#aaddff' },
  ],

  // Boss 技能
  FIRE_BREATH: [
    { type: 'projectile', color: '#ff4400' },
    { type: 'flash', color: '#ff3300', duration: 0.2 },
  ],
  DARK_BOLT: [
    { type: 'projectile', color: '#cc44ff' },
    { type: 'pulse', color: '#9944cc', duration: 0.2 },
  ],
  SOUL_DRAIN: [
    { type: 'projectile', color: '#ff4466' },
    { type: 'flash', color: '#880022', duration: 0.15 },
  ],
  EARTHQUAKE: [
    { type: 'pulse', color: '#aa8844' },
    { type: 'flash', color: '#886633', duration: 0.2 },
  ],
  LIGHTNING: [
    { type: 'slash', color: '#ffff44' },
    { type: 'flash', color: '#ffffff', duration: 0.1 },
  ],
  NECROTIC_BLAST: [
    { type: 'projectile', color: '#66ff66' },
    { type: 'pulse', color: '#44aa44', duration: 0.2 },
  ],
  SUMMON: [
    { type: 'pulse', color: '#664488' },
    { type: 'flash', color: '#442266', duration: 0.15 },
  ],
};

/**
 * 根据技能 key 创建特效
 * @param {object} state - 游戏状态
 * @param {string} skillKey - 技能标识
 * @param {object} from - { x, y } 施法者 grid 坐标
 * @param {object} to - { x, y } 目标 grid 坐标
 */
export function createSkillEffect(state, skillKey, from, to) {
  const configs = SKILL_EFFECT_MAP[skillKey];
  if (!configs) return;

  // 战斗中实体同格 → 用屏幕固定位置替代
  // toPixel(g) = g * 72 + 36; x=2→180(玩家侧), x=7→540(怪物侧), y=4.5→360(屏幕垂直居中)
  let effFrom = { ...from };
  let effTo = { ...to };
  if (state.gamePhase === GAME_PHASE.BATTLE && from.x === to.x && from.y === to.y) {
    const isPlayerSkill = PLAYER_SKILLS.has(skillKey);
    const casterX = isPlayerSkill ? 2 : 7;
    const targetX = isPlayerSkill ? 7 : 2;
    const centerY = 4.5;
    if (SELF_TARGET_SKILLS.has(skillKey)) {
      effFrom = effTo = { x: casterX, y: centerY };
    } else {
      effFrom = { x: casterX, y: centerY };
      effTo   = { x: targetX, y: centerY };
    }
  }

  for (const config of configs) {
    addSkillEffect(state, {
      ...config,
      fromX: effFrom.x,
      fromY: effFrom.y,
      toX: effTo.x,
      toY: effTo.y,
    });
  }
}

/**
 * 为 Boss 技能创建特效（使用 Boss 技能 key）
 */
export function createBossSkillEffect(state, skillKey, from, to) {
  createSkillEffect(state, skillKey, from, to);
}
