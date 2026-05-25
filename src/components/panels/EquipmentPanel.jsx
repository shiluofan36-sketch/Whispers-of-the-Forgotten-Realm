import { useState } from 'react';
import { getEquipmentInfo, getRarityColor, getRarityLabel, getBonusText } from '../../game/equipment/equipmentManager';
import EquipmentIcon from '../shared/EquipmentIcon';

export default function EquipmentPanel({ state, onCampAction, onBack }) {
  const [message, setMessage] = useState(null);
  const { player, inventory } = state;
  const equipment = player.equipment;

  // 背包中可装备的物品
  const equippableItems = inventory.filter(slot => {
    const info = getEquipmentInfo(slot.itemKey);
    return info != null;
  });

  function handleEquip(slotIndex) {
    const result = onCampAction('equip', slotIndex);
    setMessage(result);
    setTimeout(() => setMessage(null), 2000);
  }

  function handleUnequip(slot) {
    const result = onCampAction('unequip', slot);
    setMessage(result);
    setTimeout(() => setMessage(null), 2000);
  }

  const slotNames = { weapon: '武器', armor: '防具', accessory: '饰品' };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="text-purple-400 font-bold font-pixel">EQUIPMENT</div>
        <button onClick={onBack} className="text-gray-400 hover:text-white text-xs">← 返回</button>
      </div>

      {message && (
        <div className={`text-xs p-1 rounded text-center ${message.success ? 'text-green-400 bg-green-900/50' : 'text-red-400 bg-red-900/50'}`}>
          {message.message}
        </div>
      )}

      {/* 已装备槽位 */}
      <div>
        <div className="text-gray-400 text-xs mb-1">已装备</div>
        <div className="space-y-1">
          {Object.entries(slotNames).map(([slot, label]) => {
            const eq = equipment[slot];
            const info = eq ? getEquipmentInfo(eq.itemKey) : null;
            const displayRarity = eq?.rarity || info?.rarity;
            const displayBonus = eq?.generated?.bonus || info?.bonus;
            return (
              <div key={slot} className="bg-gray-800 rounded p-2 border border-gray-700">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1">
                    <EquipmentIcon slot={slot} rarity={displayRarity || 'common'} size={18} />
                    <span className="text-gray-400 text-xs">[{label}]</span>
                    {eq ? (
                      <>
                        <span className={`ml-1 text-xs font-bold ${getRarityColor(displayRarity)}`}>
                          {eq.name}
                        </span>
                        <span className={`ml-1 text-xs ${getRarityColor(displayRarity)}`}>
                          [{getRarityLabel(displayRarity)}]
                        </span>
                      </>
                    ) : (
                      <span className="ml-2 text-xs text-gray-600">(空)</span>
                    )}
                  </div>
                  {eq && (
                    <button
                      onClick={() => handleUnequip(slot)}
                      className="px-2 py-0.5 rounded text-xs text-white bg-red-700 hover:bg-red-600"
                    >
                      卸下
                    </button>
                  )}
                </div>
                {eq && displayBonus && (
                  <div className="text-xs text-gray-500 mt-0.5 ml-7">
                    {getBonusText(displayBonus)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 背包中可装备的物品 */}
      <div>
        <div className="text-gray-400 text-xs mb-1 mt-2">可装备物品（背包中）</div>
        <div className="bg-gray-800 rounded border border-gray-700 overflow-hidden max-h-32 overflow-y-auto">
          {equippableItems.length === 0 && (
            <div className="px-2 py-2 text-xs text-gray-600">(无)</div>
          )}
          {equippableItems.map((slot, i) => {
            const info = getEquipmentInfo(slot.itemKey);
            const realIndex = inventory.indexOf(slot);
            const generated = slot.generated;
            const displayName = generated ? generated.name : info?.name;
            const displayBonus = generated ? generated.bonus : info?.bonus;
            const displayRarity = generated ? generated.rarity : info?.rarity;
            return (
              <div
                key={realIndex}
                className="px-2 py-1 text-xs border-b border-gray-700 last:border-b-0"
              >
                <div className="flex justify-between items-center">
                  <span className={`font-bold ${getRarityColor(displayRarity)}`}>
                    {displayName}
                    <span className="ml-1 opacity-70">[{getRarityLabel(displayRarity)}]</span>
                  </span>
                  <button
                    onClick={() => handleEquip(realIndex)}
                    className="px-2 py-0.5 rounded text-xs text-white bg-green-700 hover:bg-green-600"
                  >
                    装备
                  </button>
                </div>
                {displayBonus && (
                  <div className="text-xs text-gray-500 mt-0.5">
                    {getBonusText(displayBonus)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
