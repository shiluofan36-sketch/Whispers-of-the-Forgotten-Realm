import Divider from '../shared/Divider';
import { getItemInfo } from '../../game/items';
import { getEquipmentInfo, getRarityColor } from '../../game/equipment/equipmentManager';

function getDisplayName(slot) {
  if (slot.generated) return slot.generated.name;
  const info = getItemInfo(slot.itemKey);
  if (info) return info.name;
  const eqInfo = getEquipmentInfo(slot.itemKey);
  if (eqInfo) return eqInfo.name;
  return '?';
}

function isEquipment(slot) {
  return !!getEquipmentInfo(slot.itemKey);
}

export default function StoragePanel({ state, onCampAction, onBack }) {
  const { inventory, storage } = state;

  function handleDeposit(slotIndex) {
    onCampAction('storage_deposit', slotIndex);
  }

  function handleWithdraw(storageIndex) {
    onCampAction('storage_withdraw', storageIndex);
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="text-blue-400 font-bold">STORAGE</div>
        <button onClick={onBack} className="text-gray-400 hover:text-white text-xs">← 返回</button>
      </div>

      {/* 背包（可存入） */}
      <div>
        <div className="text-gray-400 text-xs mb-1">
          背包 ({inventory.length}/{state.inventorySlots})
          <span className="text-gray-600 ml-1">— 点击存入</span>
        </div>
        <div className="bg-gray-800 rounded border border-gray-700 overflow-hidden max-h-32 overflow-y-auto">
          {inventory.length === 0 && (
            <div className="px-2 py-2 text-xs text-gray-600">(空)</div>
          )}
          {inventory.map((slot, i) => {
            const displayName = getDisplayName(slot);
            const eq = isEquipment(slot);
            const displayRarity = slot.generated?.rarity || getEquipmentInfo(slot.itemKey)?.rarity;
            return (
              <div
                key={i}
                onClick={() => handleDeposit(i)}
                className="px-2 py-1 text-xs border-b border-gray-700 last:border-b-0 flex justify-between items-center cursor-pointer hover:bg-gray-600"
              >
                <span className={eq ? getRarityColor(displayRarity) : 'text-yellow-300'}>
                  [{i + 1}] {displayName}
                </span>
                <span className="text-gray-400">x{slot.quantity}</span>
              </div>
            );
          })}
        </div>
      </div>

      <Divider />

      {/* 仓库（可取回） */}
      <div>
        <div className="text-gray-400 text-xs mb-1">
          仓库 ({storage.length} 种)
          <span className="text-gray-600 ml-1">— 点击取回</span>
        </div>
        <div className="bg-gray-800 rounded border border-gray-700 overflow-hidden max-h-40 overflow-y-auto">
          {storage.length === 0 && (
            <div className="px-2 py-2 text-xs text-gray-600">(空)</div>
          )}
          {storage.map((slot, i) => {
            const displayName = getDisplayName(slot);
            const eq = isEquipment(slot);
            const displayRarity = slot.generated?.rarity || getEquipmentInfo(slot.itemKey)?.rarity;
            return (
              <div
                key={i}
                onClick={() => handleWithdraw(i)}
                className="px-2 py-1 text-xs border-b border-gray-700 last:border-b-0 flex justify-between items-center cursor-pointer hover:bg-gray-600"
              >
                <span className={eq ? getRarityColor(displayRarity) : 'text-blue-300'}>
                  [{i + 1}] {displayName}
                </span>
                <span className="text-gray-400">x{slot.quantity}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
