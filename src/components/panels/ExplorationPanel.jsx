import { TOTAL_FLOORS } from '../../game/constants';
import { getExpToNext } from '../../game/level';
import Divider from '../shared/Divider';
import HpBar from '../shared/HpBar';
import MpBar from '../shared/MpBar';
import InventoryDisplay from '../shared/InventoryDisplay';
import FloorClearedBanner from '../shared/FloorClearedBanner';

function logColor(msg) {
  if (msg.includes('CRIT')) return 'text-yellow-300 font-bold';
  if (msg.includes('闪避')) return 'text-green-300';
  if (msg.includes('恢复') || msg.includes('疗')) return 'text-green-400';
  if (msg.includes('获得') || msg.includes('掉落')) return 'text-yellow-400';
  if (msg.includes('随机事件') || msg.includes('[')) return 'text-purple-400';
  if (msg.includes('灼烧') || msg.includes('中毒') || msg.includes('冻结')) return 'text-orange-400';
  if (msg.includes('狂暴')) return 'text-red-400 font-bold';
  if (msg.includes('升级') || msg.includes('LV')) return 'text-yellow-300';
  if (msg.includes('成就')) return 'text-cyan-400';
  if (msg.includes('伤害') || msg.includes('造成')) return 'text-gray-400';
  return 'text-gray-500';
}

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

      {/* Phase 12: 遗物 */}
      {state.currentRelic && (
        <div className="bg-purple-900/50 rounded p-2 border border-purple-700 text-center">
          <div className="text-purple-300 text-xs">遗物</div>
          <div className="text-purple-200 font-bold text-xs">{state.currentRelic.name}</div>
          <div className="text-gray-500 text-xs">{state.currentRelic.desc}</div>
        </div>
      )}

      {/* Phase 11: 选择型事件提示 */}
      {state.pendingEvent && (
        <div className="bg-yellow-900 border-2 border-yellow-500 rounded p-3 space-y-2">
          <div className="text-yellow-400 font-bold text-sm">{state.pendingEvent.name}</div>
          <div className="text-gray-300 text-xs">{state.pendingEvent.description}</div>
          <div className="text-red-400 text-xs">风险：{state.pendingEvent.risk}</div>
          <div className="text-green-400 text-xs">奖励：{state.pendingEvent.reward}</div>
          <div className="flex gap-2">
            <button
              onClick={() => onCampAction('event_accept')}
              className="flex-1 py-1.5 bg-green-700 hover:bg-green-600 rounded text-xs font-bold"
            >
              接受
            </button>
            <button
              onClick={() => onCampAction('event_decline')}
              className="flex-1 py-1.5 bg-red-700 hover:bg-red-600 rounded text-xs font-bold"
            >
              拒绝
            </button>
          </div>
        </div>
      )}

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
          <div className="bg-gray-800 rounded p-2 text-xs border border-gray-700 space-y-0.5">
            {recentLogs.map((msg, i) => <div key={i} className={logColor(msg)}>{msg}</div>)}
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
