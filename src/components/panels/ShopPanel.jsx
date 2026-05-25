import { useState } from 'react';
import { getEffectivePrice } from '../../game/camp/shopManager';

const shopItems = [
  { key: 'SMALL_POTION',   name: 'HP Potion',       price: 20, desc: '恢复20HP' },
  { key: 'MP_POTION',      name: 'MP Potion',       price: 25, desc: '恢复15MP' },
  { key: 'ATTACK_SCROLL',  name: 'Attack Scroll',   price: 40, desc: '下次攻击+5伤害' },
  { key: 'DEFENSE_SCROLL', name: 'Defense Scroll',  price: 30, desc: '下次受伤减半' },
  { key: 'SMALL_BAG',      name: 'Small Bag (+5)',  price: 100, desc: '背包+5格' },
  { key: 'LARGE_BAG',      name: 'Large Bag (+10)', price: 200, desc: '背包+10格' },
];

export default function ShopPanel({ state, onCampAction, onBack }) {
  const [message, setMessage] = useState(null);

  function handleBuy(shopKey) {
    const result = onCampAction('shop_buy', shopKey);
    setMessage(result);
    setTimeout(() => setMessage(null), 2000);
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="text-yellow-400 font-bold font-pixel">SHOP</div>
        <button onClick={onBack} className="text-gray-400 hover:text-white text-xs">← 返回</button>
      </div>

      <div className="text-right text-xs text-yellow-400 font-bold">
        Gold: {state.player.gold}
      </div>

      {message && (
        <div className={`text-xs p-1 rounded text-center ${message.success ? 'text-green-400 bg-green-900/50' : 'text-red-400 bg-red-900/50'}`}>
          {message.message}
        </div>
      )}

      <div className="space-y-1">
        {shopItems.map(item => {
          const effectivePrice = getEffectivePrice(state, item.key);
          const discounted = effectivePrice < item.price;
          return (
            <div key={item.key} className="bg-gray-800 rounded p-2 border border-gray-700 flex justify-between items-center">
              <div>
                <div className="text-xs text-gray-200">{item.name}</div>
                <div className="text-xs text-gray-500">{item.desc}</div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs ${discounted ? 'text-green-400' : 'text-yellow-400'}`}>
                  {discounted && <span className="line-through text-gray-500 mr-1">{item.price}G</span>}
                  {effectivePrice}G
                </span>
                <button
                  onClick={() => handleBuy(item.key)}
                  className="px-2 py-0.5 rounded text-xs text-white bg-green-700 hover:bg-green-600 active:bg-green-800"
                >
                  购买
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
