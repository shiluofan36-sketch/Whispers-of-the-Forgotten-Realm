import Divider from '../shared/Divider';
import { getItemInfo } from '../../game/items';

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
            const info = getItemInfo(slot.itemKey);
            return (
              <div
                key={i}
                onClick={() => handleDeposit(i)}
                className="px-2 py-1 text-xs border-b border-gray-700 last:border-b-0 flex justify-between items-center cursor-pointer hover:bg-gray-600 text-yellow-300"
              >
                <span>[{i + 1}] {info ? info.name : '?'}</span>
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
            const info = getItemInfo(slot.itemKey);
            return (
              <div
                key={i}
                onClick={() => handleWithdraw(i)}
                className="px-2 py-1 text-xs border-b border-gray-700 last:border-b-0 flex justify-between items-center cursor-pointer hover:bg-gray-600 text-blue-300"
              >
                <span>[{i + 1}] {info ? info.name : '?'}</span>
                <span className="text-gray-400">x{slot.quantity}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
