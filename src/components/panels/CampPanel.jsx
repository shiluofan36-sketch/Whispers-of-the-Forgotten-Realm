import { useState } from 'react';
import Divider from '../shared/Divider';
import ShopPanel from './ShopPanel';
import StoragePanel from './StoragePanel';
import FloorSelectPanel from './FloorSelectPanel';
import EquipmentPanel from './EquipmentPanel';
import AchievementPanel from './AchievementPanel';

export default function CampPanel({ state, onCampAction }) {
  const [view, setView] = useState('main');
  const { player, unlockedFloors, inventorySlots } = state;

  return (
    <div className="space-y-3">
      {/* 营地标题 */}
      <div className="bg-gray-800 rounded p-3 border border-yellow-700 text-center">
        <div className="text-yellow-400 font-bold text-lg">CAMP</div>
        <div className="text-gray-500 text-xs">安全区域 — 不会战斗、不会死亡</div>
      </div>

      {/* 玩家状态摘要 */}
      <div className="space-y-1 text-xs">
        <div className="flex justify-between">
          <span className="text-gray-400">等级</span>
          <span className="text-yellow-400">LV {player.level}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">HP</span>
          <span className="text-green-400">{player.hp} / {player.maxHp}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">MP</span>
          <span className="text-blue-400">{player.mp} / {player.maxMp}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Gold</span>
          <span className="text-yellow-400 font-bold">{player.gold}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">背包</span>
          <span className="text-gray-300">{state.inventory.length} / {inventorySlots}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">解锁楼层</span>
          <span className="text-purple-400">F1 ~ F{unlockedFloors}</span>
        </div>
      </div>

      <Divider />

      {/* 主菜单 */}
      {view === 'main' && (
        <div className="space-y-2">
          <button
            onClick={() => setView('shop')}
            className="w-full py-2 rounded font-bold text-white bg-yellow-700 hover:bg-yellow-600 active:bg-yellow-800 transition-colors"
          >
            [Shop] 商店
          </button>
          <button
            onClick={() => setView('storage')}
            className="w-full py-2 rounded font-bold text-white bg-blue-700 hover:bg-blue-600 active:bg-blue-800 transition-colors"
          >
            [Storage] 仓库
          </button>
          <button
            onClick={() => { onCampAction('campfire'); }}
            className="w-full py-2 rounded font-bold text-white bg-orange-700 hover:bg-orange-600 active:bg-orange-800 transition-colors"
          >
            [Campfire] 营火回复
          </button>
          <button
            onClick={() => setView('equipment')}
            className="w-full py-2 rounded font-bold text-white bg-purple-700 hover:bg-purple-600 active:bg-purple-800 transition-colors"
          >
            [Equipment] 装备
          </button>
          <button
            onClick={() => setView('floorSelect')}
            className="w-full py-2 rounded font-bold text-white bg-red-700 hover:bg-red-600 active:bg-red-800 transition-colors"
          >
            [Dungeon Gate] 进入地牢
          </button>
          <button
            onClick={() => setView('achievements')}
            className="w-full py-2 rounded font-bold text-white bg-green-700 hover:bg-green-600 active:bg-green-800 transition-colors"
          >
            [Achievements] 成就
          </button>
        </div>
      )}

      {/* 成就子面板 */}
      {view === 'achievements' && (
        <AchievementPanel state={state} onBack={() => setView('main')} />
      )}

      {/* 商店子面板 */}
      {view === 'shop' && (
        <ShopPanel state={state} onCampAction={onCampAction} onBack={() => setView('main')} />
      )}

      {/* 仓库子面板 */}
      {view === 'storage' && (
        <StoragePanel state={state} onCampAction={onCampAction} onBack={() => setView('main')} />
      )}

      {/* 装备子面板 */}
      {view === 'equipment' && (
        <EquipmentPanel state={state} onCampAction={onCampAction} onBack={() => setView('main')} />
      )}

      {/* 楼层选择子面板 */}
      {view === 'floorSelect' && (
        <FloorSelectPanel state={state} onCampAction={onCampAction} onBack={() => setView('main')} />
      )}
    </div>
  );
}
