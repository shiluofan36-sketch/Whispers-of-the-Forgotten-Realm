import { lazy, Suspense } from 'react';
import { GAME_PHASE } from '../game/constants';
import CampPanel from './panels/CampPanel';
import ExplorationPanel from './panels/ExplorationPanel';

// Phase 11: 懒加载非核心面板
const BattlePanel = lazy(() => import('./panels/BattlePanel'));
const GameOverPanel = lazy(() => import('./panels/GameOverPanel'));
const VictoryPanel = lazy(() => import('./panels/VictoryPanel'));

const LoadingFallback = () => (
  <div className="text-gray-500 text-xs p-4 text-center">Loading...</div>
);

export default function GameUI({ state, onBattleAction, onUseItem, onSkill, onCampAction }) {
  const { gamePhase } = state;

  return (
    <div className="w-80 ml-4 space-y-3 text-sm">
      <h1 className="text-lg font-bold text-green-400 border-b-2 border-gray-700 pb-2 font-pixel tracking-tight">
        WotFR
      </h1>

      {gamePhase === GAME_PHASE.CAMP && (
        <div className="animate-fade-in"><CampPanel state={state} onCampAction={onCampAction} /></div>
      )}
      {gamePhase === GAME_PHASE.EXPLORATION && (
        <div className="animate-slide-in"><ExplorationPanel state={state} onUseItem={onUseItem} onCampAction={onCampAction} /></div>
      )}
      {gamePhase === GAME_PHASE.BATTLE && (
        <Suspense fallback={<LoadingFallback />}>
          <div className="animate-fade-in"><BattlePanel state={state} onAction={onBattleAction} onUseItem={onUseItem} onSkill={onSkill} onCampAction={onCampAction} /></div>
        </Suspense>
      )}
      {gamePhase === GAME_PHASE.GAME_OVER && (
        <Suspense fallback={<LoadingFallback />}>
          <div className="animate-slide-in-up"><GameOverPanel state={state} onCampAction={onCampAction} /></div>
        </Suspense>
      )}
      {gamePhase === GAME_PHASE.VICTORY && (
        <Suspense fallback={<LoadingFallback />}>
          <div className="animate-slide-in-up"><VictoryPanel state={state} onCampAction={onCampAction} /></div>
        </Suspense>
      )}
    </div>
  );
}
