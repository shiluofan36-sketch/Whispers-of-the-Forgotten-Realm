export default function VictoryPanel({ state, onCampAction }) {
  const isBossVictory = state.bossDefeated;

  return (
    <div className={`mt-4 p-4 rounded border-2 text-center space-y-3 ${isBossVictory ? 'border-red-500 bg-red-900/50' : 'border-yellow-500 bg-yellow-900/50'}`}>
      <div className={`text-lg font-bold ${isBossVictory ? 'text-red-400' : 'text-yellow-400'}`}>
        {isBossVictory ? 'YOU WIN!' : '胜利！'}
      </div>
      <div className="text-xs text-gray-400 space-y-1">
        <div>等级：LV {state.player.level}</div>
        <div>总回合数：{state.turn}</div>
        <div>击败怪物：{state.monstersDefeated}</div>
      </div>
      <div className="text-xs text-green-400">
        {isBossVictory ? `${state.floorName} 的 Boss 被击败！` : '远征完成！'}
      </div>
      <button
        onClick={() => onCampAction('return_camp')}
        className="w-full py-2 rounded font-bold text-white bg-green-600 hover:bg-green-500 active:bg-green-700 transition-colors"
      >
        返回营地（结算奖励）
      </button>
    </div>
  );
}
