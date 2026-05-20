import { GAME_PHASE } from '../game/constants';
import CampPanel from './panels/CampPanel';
import ExplorationPanel from './panels/ExplorationPanel';
import BattlePanel from './panels/BattlePanel';
import GameOverPanel from './panels/GameOverPanel';
import VictoryPanel from './panels/VictoryPanel';

/**
 * 游戏 HUD 面板路由
 * 根据 gamePhase 渲染对应面板，具体逻辑在各子面板文件中
 */
export default function GameUI({ state, onBattleAction, onUseItem, onSkill, onCampAction }) {
  const { gamePhase } = state;

  return (
    <div className="w-72 ml-6 space-y-4 text-sm">
      <h1 className="text-lg font-bold text-green-400 border-b border-gray-700 pb-2">
        极简RPG
      </h1>

      {gamePhase === GAME_PHASE.CAMP && (
        <CampPanel state={state} onCampAction={onCampAction} />
      )}
      {gamePhase === GAME_PHASE.EXPLORATION && (
        <ExplorationPanel state={state} onUseItem={onUseItem} onCampAction={onCampAction} />
      )}
      {gamePhase === GAME_PHASE.BATTLE && (
        <BattlePanel state={state} onAction={onBattleAction} onUseItem={onUseItem} onSkill={onSkill} />
      )}
      {gamePhase === GAME_PHASE.GAME_OVER && (
        <GameOverPanel state={state} onCampAction={onCampAction} />
      )}
      {gamePhase === GAME_PHASE.VICTORY && (
        <VictoryPanel state={state} onCampAction={onCampAction} />
      )}
    </div>
  );
}
