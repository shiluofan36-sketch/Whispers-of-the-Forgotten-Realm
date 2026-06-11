import { useState, useRef, useEffect } from 'react';
import { createGame } from './game/game';
import GameCanvas from './components/GameCanvas';
import GameUI from './components/GameUI';
import LoginPanel from './components/LoginPanel';
import NicknameModal from './components/NicknameModal';
import UserBadge from './components/UserBadge';
import SuggestionModal from './components/SuggestionModal';
import AdminPanel from './components/AdminPanel';
import StartScreen from './components/StartScreen';
import { getStoredUser, login, register, fetchMe, setNickname, logout, submitSuggestion } from './services/authService';

export default function App() {
  const [user, setUser] = useState(() => getStoredUser());
  const [authChecked, setAuthChecked] = useState(false);
  const [inGame, setInGame] = useState(false);
  const [showNickname, setShowNickname] = useState(false);
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [uiState, setUiState] = useState(null);

  const gameRef = useRef(null);

  useEffect(() => {
    const stored = getStoredUser();
    if (stored && stored.role) {
      fetchMe()
        .then(u => { setUser(u); if (u.role === 'player' && !u.nickname) setShowNickname(true); })
        .catch(() => { logout(); setUser(null); })
        .finally(() => setAuthChecked(true));
    } else {
      setAuthChecked(true);
    }
  }, []);

  function initGame() {
    if (!gameRef.current) {
      gameRef.current = createGame();
      gameRef.current.setOnUpdate(() => {
        setUiState({ ...gameRef.current.getState() });
      });
    }
  }

  function handleStartGame() {
    initGame();
    setInGame(true);
  }

  async function handleLogin(mode, username, password) {
    const fn = mode === 'login' ? login : register;
    const u = await fn(username, password);
    setUser(u);
    if (!u.nickname) setShowNickname(true);
  }

  async function handleNicknameSubmit(nickname) {
    await setNickname(nickname);
    setUser(prev => ({ ...prev, nickname }));
    setShowNickname(false);
  }

  function handleLogout() {
    logout();
    setUser(null);
    setUiState(null);
    setInGame(false);
    gameRef.current = null;
  }

  function handleBattleAction(action) { gameRef.current?.handleBattleAction(action); }
  function handleSkill(skillKey) { gameRef.current?.handleSkill(skillKey); }
  function handleUseItem(slot) { gameRef.current?.handleUseItem(slot); }
  function handleCampAction(action, payload) { return gameRef.current?.handleCampAction(action, payload); }

  if (!authChecked) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-950">
        <p className="text-gray-500 text-sm">加载中...</p>
      </div>
    );
  }

  if (!user) return <LoginPanel onLogin={handleLogin} />;

  if (user.role === 'admin') return <AdminPanel onLogout={handleLogout} />;

  // 开始游戏界面
  if (!inGame) {
    return (
      <>
        <StartScreen nickname={user.nickname || user.username} onStart={handleStartGame} />
        {showNickname && <NicknameModal onSubmit={handleNicknameSubmit} />}
      </>
    );
  }

  // 游戏中
  return (
    <div className="h-screen flex items-center justify-center gap-6 p-6 bg-gray-950 relative">
      <div className="flex-1 flex items-center justify-center min-w-0 relative">
        {user.nickname && <UserBadge nickname={user.nickname} onLogout={handleLogout} onSuggestion={() => setShowSuggestion(true)} />}
        {gameRef.current && <GameCanvas game={gameRef.current} />}
      </div>
      {uiState && (
        <GameUI
          state={uiState}
          onBattleAction={handleBattleAction}
          onUseItem={handleUseItem}
          onSkill={handleSkill}
          onCampAction={handleCampAction}
        />
      )}
      {showSuggestion && (
        <SuggestionModal
          onClose={() => setShowSuggestion(false)}
          onSubmit={async (content) => { await submitSuggestion(content); }}
        />
      )}
    </div>
  );
}
