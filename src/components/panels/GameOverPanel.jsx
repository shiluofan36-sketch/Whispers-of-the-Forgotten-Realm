export default function GameOverPanel({ state, onCampAction }) {
  return (
    <div className="mt-4 p-4 rounded border-2 border-red-500 bg-red-900/50 text-center space-y-3">
      <div className="text-lg font-bold text-red-400">败北</div>
      <div className="text-xs text-gray-400 space-y-1">
        <div>等级：LV {state.player.level}</div>
        <div>总回合数：{state.turn}</div>
        <div>击败怪物：{state.monstersDefeated}</div>
      </div>
      <div className="text-xs text-red-400">
        本次远征金币和背包物品已丢失！
      </div>
      <div className="text-xs text-gray-400">
        等级、属性、技能、仓库内容永久保留
      </div>
      <button
        onClick={() => onCampAction('return_camp')}
        className="w-full py-2 rounded font-bold text-white bg-red-600 hover:bg-red-500 active:bg-red-700 transition-colors"
      >
        返回营地
      </button>
    </div>
  );
}
