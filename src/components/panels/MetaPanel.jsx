import { getUpgradeInfo } from '../../game/meta/metaManager';

const upgradeNames = {
  storage: '仓库扩展',
  blacksmith: '铁匠铺',
  potionShop: '药剂店',
  adventurerHall: '冒险者大厅',
};

export default function MetaPanel({ state, onCampAction, onBack }) {
  const meta = state.metaProgress || {};

  function handleBuy(key) {
    const result = onCampAction('meta_buy', key);
    if (result && !result.success) {
      alert(result.message);
    }
  }

  return (
    <div className="space-y-3">
      <div className="text-center text-yellow-400 font-bold text-sm">营地升级</div>
      <div className="text-gray-500 text-xs text-center">
        升级永久保留，死亡不丢失
      </div>

      {Object.keys(upgradeNames).map(key => {
        const info = getUpgradeInfo(key);
        if (!info) return null;
        const currentLevel = meta[key] || 0;
        const isMaxed = currentLevel >= info.maxLevel;
        const nextLevel = isMaxed ? null : info.levels[currentLevel + 1];
        const currentEffect = info.levels[currentLevel].effect;

        return (
          <div key={key} className="bg-gray-800 rounded p-2 border border-gray-700">
            <div className="flex justify-between items-center">
              <span className="text-white text-xs font-bold">{info.name}</span>
              <span className="text-gray-400 text-xs">Lv {currentLevel}/{info.maxLevel}</span>
            </div>
            <div className="text-gray-500 text-xs mt-1">当前：{currentEffect}</div>
            {!isMaxed && (
              <>
                <div className="text-yellow-400 text-xs mt-1">下一级：{nextLevel.effect}</div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-yellow-400 text-xs font-bold">费用：{nextLevel.cost} Gold</span>
                  <button
                    onClick={() => handleBuy(key)}
                    disabled={state.player.gold < nextLevel.cost}
                    className={`px-3 py-1 rounded text-xs font-bold ${
                      state.player.gold >= nextLevel.cost
                        ? 'bg-yellow-700 hover:bg-yellow-600 text-white'
                        : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    升级
                  </button>
                </div>
              </>
            )}
            {isMaxed && (
              <div className="text-green-400 text-xs mt-1">已满级</div>
            )}
          </div>
        );
      })}

      <button
        onClick={onBack}
        className="w-full py-2 rounded font-bold text-white bg-gray-700 hover:bg-gray-600 text-xs"
      >
        返回营地
      </button>
    </div>
  );
}
