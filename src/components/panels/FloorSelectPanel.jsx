import { FLOORS } from '../../game/constants';

export default function FloorSelectPanel({ state, onCampAction, onBack }) {
  const { unlockedFloors } = state;

  function handleSelect(floor) {
    onCampAction('start_expedition', floor);
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="text-red-400 font-bold">Choose Floor</div>
        <button onClick={onBack} className="text-gray-400 hover:text-white text-xs">← 返回</button>
      </div>

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
