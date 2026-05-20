import { useState, useCallback } from 'react';
import { getItemInfo } from '../../game/items';

export default function InventoryDisplay({ inventory, onUseItem }) {
  const [clickedSlot, setClickedSlot] = useState(null);

  const handleClick = useCallback((i) => {
    if (!inventory[i]) return;
    setClickedSlot(i);
    setTimeout(() => setClickedSlot(null), 150);
    onUseItem(i);
  }, [inventory, onUseItem]);

  const itemCount = inventory.length;

  return (
    <div>
      <div className="text-gray-400 mb-1">背包 ({itemCount}种)</div>
      <div className="bg-gray-800 rounded border border-gray-700 overflow-hidden select-none max-h-40 overflow-y-auto">
        {inventory.length === 0 && (
          <div className="px-2 py-1.5 text-xs text-gray-600">(空)</div>
        )}
        {inventory.map((slot, i) => {
          const info = slot ? getItemInfo(slot.itemKey) : null;
          const isClicked = clickedSlot === i;

          return (
            <div
              key={i}
              onClick={() => handleClick(i)}
              className={`
                px-2 py-1.5 text-xs border-b border-gray-700 last:border-b-0
                flex justify-between items-center
                ${info
                  ? 'text-yellow-300 cursor-pointer hover:bg-gray-600 active:bg-gray-500 transition-colors'
                  : 'text-gray-600 cursor-default'}
                ${isClicked ? 'bg-yellow-800' : ''}
              `}
            >
              <span className="text-gray-500">[{i + 1}]</span>
              <span>{info ? info.name : '(空)'}</span>
              <span className="text-gray-500 text-xs">
                {slot.quantity > 1 ? `x${slot.quantity}` : ''}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
