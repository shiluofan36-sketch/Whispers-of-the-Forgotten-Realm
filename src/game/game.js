import { createInitialState } from './state';
import { render } from './renderer';
import { updateFloatingTexts } from './effects/floatingTextManager';
import { updateScreenShake } from './effects/screenShake';
import { updateEntityFlashTimers } from './effects/entityFlash';
import { updateAnimationState } from './animation/animationManager';
import { updateHitStop } from './animation/hitStopManager';
import { updateSkillEffects } from './animation/skillEffectRenderer';
import { updateLootCard, dismissLootCard } from './animation/lootAnimation';
import { moveMonster } from './monsters';
import { GAME_PHASE } from './constants';
import { startBattle } from './battle/battleEngine';
import { isSameCell } from './map';
import { preloadSfx } from './audio/audioManager';
import { initTileCache } from './renderer/tileRenderer';
import { initSpriteCache } from './renderer/spriteManager';
import { initIconCache } from './renderer/iconRenderer';
import { handleInput } from './controllers/inputController';
import { handleBattleAction, handleSkill, handleUseItem } from './controllers/battleController';
import { handleCampAction } from './controllers/campController';
import { updateFloorTransition } from './animation/floorTransition';

export function createGame() {
  const state = createInitialState();
  preloadSfx();
  initTileCache();
  initSpriteCache();
  initIconCache();

  let onUpdate = null;

  function notify() {
    if (onUpdate) onUpdate();
  }

  return {
    getState() {
      return state;
    },

    setOnUpdate(callback) {
      onUpdate = callback;
    },

    handleInput(event) {
      // 有掉落卡片时，任何按键都触发淡出
      dismissLootCard(state);
      handleInput(state, event, {
        onUseItem: (slot) => {
          if (handleUseItem(state, slot)) notify();
        },
        onSkill: (skillKey) => {
          if (handleSkill(state, skillKey)) notify();
        },
      });
      notify();
    },

    dismissLootCard() {
      dismissLootCard(state);
      notify();
    },

    handleCampAction(action, payload) {
      const result = handleCampAction(state, action, payload);
      notify();
      return result;
    },

    handleBattleAction(action) {
      handleBattleAction(state, action);
      notify();
    },

    handleSkill(skillKey) {
      if (handleSkill(state, skillKey)) notify();
    },

    handleUseItem(slot) {
      if (handleUseItem(state, slot)) notify();
    },

    renderFrame(ctx) {
      render(ctx, state);
    },

    updateEffects(dt) {
      // 楼层过渡：独立于 hit stop，过渡期间持续更新
      if (updateFloorTransition(state, dt)) return;

      // Hit stop: 停顿期间冻结效果更新（保持画面静止）
      if (updateHitStop(state, dt)) return;

      // 怪物自主移动（探索模式，有怪物且不在过渡中）
      if (state.gamePhase === GAME_PHASE.EXPLORATION && state.monster) {
        const anim = state.animation;
        anim.monsterMoveTimer += dt;
        if (anim.monsterMoveTimer >= anim.monsterMoveInterval) {
          anim.monsterMoveTimer = 0;
          // 随机间隔 1.2~2.8 秒，让移动节奏不机械
          anim.monsterMoveInterval = 1.2 + Math.random() * 1.6;
          moveMonster(state);
          // 怪物走到玩家脸上 → 触发战斗
          if (isSameCell(state.player, state.monster)) {
            startBattle(state);
          }
        }
      }

      updateFloatingTexts(state, dt);
      updateScreenShake(state, dt);
      updateEntityFlashTimers(state, dt);
      updateAnimationState(state, dt);
      updateSkillEffects(state, dt);
      updateLootCard(state, dt);

      // Phase 14: 粒子系统更新
      if (state.particles) state.particles.update(dt);
    },
  };
}
