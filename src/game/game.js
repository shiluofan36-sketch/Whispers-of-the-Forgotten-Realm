import { createInitialState } from './state';
import { render } from './renderer';
import { updateFloatingTexts } from './effects/floatingTextManager';
import { updateScreenShake } from './effects/screenShake';
import { updateEntityFlashTimers } from './effects/entityFlash';
import { updateAnimationState } from './animation/animationManager';
import { updateHitStop } from './animation/hitStopManager';
import { updateSkillEffects } from './animation/skillEffectRenderer';
import { updateLootCard } from './animation/lootAnimation';
import { preloadSfx } from './audio/audioManager';
import { handleInput } from './controllers/inputController';
import { handleBattleAction, handleSkill, handleUseItem } from './controllers/battleController';
import { handleCampAction } from './controllers/campController';

export function createGame() {
  const state = createInitialState();
  preloadSfx();

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
      // Hit stop: 停顿期间冻结效果更新（保持画面静止）
      if (updateHitStop(state, dt)) return;

      updateFloatingTexts(state, dt);
      updateScreenShake(state, dt);
      updateEntityFlashTimers(state, dt);
      updateAnimationState(state, dt);
      updateSkillEffects(state, dt);
      updateLootCard(state, dt);
    },
  };
}
