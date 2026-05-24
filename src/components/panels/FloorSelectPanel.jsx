import { TOTAL_FLOORS, FLOORS } from '../../game/constants';

const MAX_ASCENSION = 5;

export default function FloorSelectPanel({ state, onCampAction, onBack }) {
  const { unlockedFloors, ascensionLevel = 0 } = state;
  const canAscend = unlockedFloors >= TOTAL_FLOORS && ascensionLevel < MAX_ASCENSION;

  function handleSelect(floor) {
    onCampAction('start_expedition', floor);
  }

  function handleAscend() {
    if (canAscend) {
      onCampAction('ascend');
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="text-red-400 font-bold">Choose Floor</div>
        <button onClick={onBack} className="text-gray-400 hover:text-white text-xs">← 返回</button>
      </div>

      {/* Ascension */}
      <div className="bg-purple-900/50 rounded p-2 border border-purple-700 text-center">
        <div className="text-purple-300 text-xs">
          Ascension Level: <span className="text-purple-200 font-bold">{ascensionLevel}</span>
        </div>
        <div className="text-gray-500 text-xs mt-0.5">
          {ascensionLevel > 0
            ? `怪物 +${ascensionLevel * 15}% HP, +${ascensionLevel * 10}% ATK, 掉率提升`
            : '基础难度'}
        </div>
        {canAscend && (
          <button
            onClick={handleAscend}
            className="mt-1 px-3 py-0.5 rounded text-xs font-bold text-white bg-purple-600 hover:bg-purple-500"
          >
            升阶至 Ascension {ascensionLevel + 1}
          </button>
        )}
        {ascensionLevel >= MAX_ASCENSION && (
          <div className="text-yellow-400 text-xs mt-0.5">已达最高难度</div>
        )}
      </div>

      {/* Floor list */}
      <div className="text-xs text-gray-500 mb-1">
        选择要远征的楼层（已解锁 F1 ~ F{unlockedFloors}）
      </div>

      <div className="space-y-1">
        {Array.from({ length: unlockedFloors }, (_, i) => i + 1).map(floor => {
          const config = FLOORS[floor];
          const isHighest = floor === unlockedFloors;
          const isBoss = config?.isBoss;

          return (
            <button
              key={floor}
              onClick={() => handleSelect(floor)}
              className={`w-full py-2 rounded font-bold text-sm transition-colors
                ${isBoss
                  ? 'bg-red-700 hover:bg-red-600 text-red-200 border border-red-500'
                  : 'bg-gray-700 hover:bg-gray-600 text-white border border-gray-600'}
                ${isHighest ? 'ring-1 ring-yellow-500' : ''}
              `}
            >
              [{floor}] {config?.name || `Floor ${floor}`}
              {isBoss && <span className="text-xs ml-1">[BOSS]</span>}
              {isHighest && <span className="text-yellow-400 text-xs ml-1">(最高层)</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
