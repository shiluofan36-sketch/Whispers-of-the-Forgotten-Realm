import { useState, useRef, useEffect } from 'react';
import { createGame } from './game/game';
import GameCanvas from './components/GameCanvas';
import GameUI from './components/GameUI';

export default function App() {
  const gameRef = useRef(null);
  if (!gameRef.current) {
    gameRef.current = createGame();
  }

  const [uiState, setUiState] = useState(() => gameRef.current.getState());

  useEffect(() => {
    gameRef.current.setOnUpdate(() => {
      setUiState({ ...gameRef.current.getState() });
    });
  }, []);

  // 战斗行动
  function handleBattleAction(action) {
    gameRef.current.handleBattleAction(action);
  }

  // 技能
  function handleSkill(skillKey) {
    gameRef.current.handleSkill(skillKey);
  }

  // 使用背包道具
  function handleUseItem(slot) {
    gameRef.current.handleUseItem(slot);
  }

  // Phase 7: 营地回调（返回结果给 UI，如购买成功/失败）
  function handleCampAction(action, payload) {
    return gameRef.current.handleCampAction(action, payload);
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <GameCanvas game={gameRef.current} />
      <GameUI
        state={uiState}
        onBattleAction={handleBattleAction}
        onUseItem={handleUseItem}
        onSkill={handleSkill}
        onCampAction={handleCampAction}
      />
    </div>
  );
}
