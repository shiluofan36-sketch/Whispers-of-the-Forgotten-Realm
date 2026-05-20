import { TOTAL_FLOORS } from '../../game/constants';
import { getExpToNext } from '../../game/level';
import Divider from '../shared/Divider';
import HpBar from '../shared/HpBar';
import MpBar from '../shared/MpBar';
import InventoryDisplay from '../shared/InventoryDisplay';
import FloorClearedBanner from '../shared/FloorClearedBanner';

export default function ExplorationPanel({ state, onUseItem, onCampAction }) {
  const { player, monster, turn, monstersDefeated, inventory, battleLog,
          currentFloor, floorName, isBossFloor, enemiesRemaining, stairsLocked,
          expeditionGold } = state;
  const recentLogs = battleLog.slice(-3);

  return (
    <>
      {/* 楼层信息 */}
      <div className="bg-gray-800 rounded p-2 border border-yellow-700 text-center">
        <div className="text-yellow-400 font-bold text-sm">{floorName}</div>
        <div className="text-gray-500 text-xs">
          Floor {currentFloor} / {TOTAL_FLOORS}
        </div>
        {isBossFloor ? (
          <div className="text-red-400 text-xs mt-1 font-bold">BOSS</div>
        ) : (
          <>
            <div className="text-gray-400 text-xs mt-1">
              Enemies: <span className="text-yellow-400">{enemiesRemaining}</span>
            </div>
            <div className={`text-xs ${stairsLocked ? 'text-red-400' : 'text-green-400 font-bold'}`}>
              Stairs: {stairsLocked ? 'LOCKED' : 'UNLOCKED'}
            </div>
          </>
        )}
      </div>

      {/* 清层反馈 */}
      {state.floorCleared && <FloorClearedBanner floor={currentFloor} />}

      {/* 状态区 */}
      <div className="space-y-1">
        <div>
          <span className="text-gray-400">等级：</span>
          <span className="text-yellow-400 font-bold">LV {player.level}</span>
        </div>
        <div>
          <span className="text-gray-400">经验：</span>
          <span className="text-green-400 font-bold">{player.exp} / {getExpToNext(state)}</span>
        </div>
        <div>
          <span className="text-gray-400">回合：</span>
          <span className="text-yellow-400 font-bold">{turn}</span>
        </div>
        <div>
          <span className="text-gray-400">击败：</span>
          <span className="text-green-400 font-bold">{monstersDefeated}</span>
        </div>
      </div>

      <Divider />

      {/* HP / MP / Gold */}
      <div className="space-y-2">
        <HpBar label="HP" current={player.hp} max={player.maxHp} color="green" />
        <MpBar current={player.mp} max={player.maxMp} />
        <div className="flex justify-between text-xs">
          <span className="text-gray-400">Gold (远征)</span>
          <span className="text-yellow-400 font-bold">{expeditionGold}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-gray-400">Gold (永久)</span>
          <span className="text-yellow-400">{player.gold}</span>
        </div>
        {monster && (
          <HpBar label={`${monster.name} HP`} current={monster.hp} max={monster.maxHp} color="red" />
        )}
      </div>

      <Divider />

      {/* 属性 */}
      <div className="flex gap-3 text-xs text-gray-300">
        <span>STR: <span className="text-orange-400">{player.strength}</span></span>
        <span>DEF: <span className="text-blue-400">{player.defense}</span></span>
        <span>AGI: <span className="text-green-400">{player.agility}</span></span>
      </div>

      <Divider />

      {/* 背包 */}
      <InventoryDisplay inventory={inventory} onUseItem={onUseItem} />

      {/* 返回营地按钮 */}
      {state.enemiesRemaining <= 0 && !state.isBossFloor && (
        <button
          onClick={() => onCampAction('return_camp')}
          className="w-full py-2 rounded font-bold text-white bg-purple-700 hover:bg-purple-600 active:bg-purple-800 transition-colors text-xs"
        >
          返回营地
        </button>
      )}

      {/* 日志 */}
      {recentLogs.length > 0 && (
        <>
          <Divider />
          <div className="bg-gray-800 rounded p-2 text-xs text-gray-300 border border-gray-700 space-y-0.5">
            {recentLogs.map((msg, i) => <div key={i}>{msg}</div>)}
          </div>
        </>
      )}

      <Divider />

      {/* 操作提示 */}
      <div className="text-xs text-gray-500 leading-relaxed">
        <div>WASD / 方向键 移动</div>
        {isBossFloor ? (
          <div className="text-red-400">击败Boss！</div>
        ) : (
          <div>击杀所有怪物 → 楼梯解锁</div>
        )}
        <div>数字键 1/2/3 或点击背包使用道具</div>
        {state.enemiesRemaining <= 0 && !isBossFloor && (
          <div className="text-purple-400">楼层已清空，可返回营地</div>
        )}
      </div>
    </>
  );
}
