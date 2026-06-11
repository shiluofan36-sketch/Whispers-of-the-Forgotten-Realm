import { useState, useEffect } from 'react';
import {
  getAdminPlayers, getPlayerDetail, getAdminSuggestions,
  deleteSuggestion, getAdminLogs, banPlayer, unbanPlayer, deletePlayer,
  getPlayerInventoryAPI, updatePlayerInventory, getPlayerStorageAPI, updatePlayerStorage,
  getPlayerEquipmentAPI, updatePlayerEquipment
} from '../services/authService';
import { ITEM_TYPES, EQUIPMENT_TYPES } from '../../shared/config/equipment.js';

const ALL_ITEM_KEYS = Object.keys(ITEM_TYPES);
const ALL_EQUIP_KEYS = Object.keys(EQUIPMENT_TYPES);

const RARITY_COLORS = { common: '#9CA3AF', rare: '#3B82F6', epic: '#A855F7', legendary: '#F59E0B' };
const SLOT_LABELS = { weapon: '武器', armor: '防具', accessory: '饰品' };
const BONUS_FIELDS = ['attackMin','attackMax','defense','maxHp','maxMp','strength','agility',
  'critRateBonus','critDamageBonus','lifesteal','poisonChance','burnChance','freezeChance','dodgeRate','thorns','healPower'];

const BAN_REASONS = [
  '使用外挂或作弊程序',
  '言语辱骂、人身攻击',
  '恶意骚扰其他玩家',
  '发布广告或垃圾信息',
  '利用游戏漏洞牟利',
  '冒充管理员或官方人员',
  '发布违法或违规内容',
  '其他违反社区规则的行为',
];

function formatTime(ts) {
  const d = new Date(ts);
  return d.toLocaleString('zh-CN', { hour12: false });
}

export default function AdminPanel({ onLogout }) {
  const [tab, setTab] = useState('players');
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [playerDetail, setPlayerDetail] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [logs, setLogs] = useState([]);
  const [banTarget, setBanTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [storage, setStorage] = useState([]);
  const [equipment, setEquipment] = useState({ weapon: null, armor: null, accessory: null });
  const [equipTarget, setEquipTarget] = useState(null);
  const [equipBonus, setEquipBonus] = useState({});
  const [equipDest, setEquipDest] = useState('storage');

  useEffect(() => { loadPlayers(); }, []);

  async function loadPlayers() {
    try { setPlayers(await getAdminPlayers()); } catch {}
  }

  async function handleSelectPlayer(p) {
    setSelectedPlayer(p);
    try { setPlayerDetail(await getPlayerDetail(p.id)); } catch {}
    try { setInventory(await getPlayerInventoryAPI(p.id)); } catch { setInventory([]); }
    try { setStorage(await getPlayerStorageAPI(p.id)); } catch { setStorage([]); }
    try { setEquipment(await getPlayerEquipmentAPI(p.id)); } catch { setEquipment({ weapon: null, armor: null, accessory: null }); }
  }

  async function handleTab(t) {
    setTab(t);
    if (t === 'suggestions') {
      try { setSuggestions(await getAdminSuggestions()); } catch {}
    } else if (t === 'logs') {
      try { setLogs(await getAdminLogs()); } catch {}
    } else if (t === 'players') {
      loadPlayers();
      setSelectedPlayer(null);
      setPlayerDetail(null);
    }
  }

  async function handleBan(playerId, reason) {
    try {
      await banPlayer(playerId, reason);
      setBanTarget(null);
      if (playerDetail && playerDetail.user.id === playerId) {
        setPlayerDetail(await getPlayerDetail(playerId));
      }
      loadPlayers();
    } catch {}
  }

  async function handleUnban(playerId) {
    try {
      await unbanPlayer(playerId);
      if (playerDetail && playerDetail.user.id === playerId) {
        setPlayerDetail(await getPlayerDetail(playerId));
      }
      loadPlayers();
    } catch {}
  }

  async function handleDelete(playerId) {
    try {
      await deletePlayer(playerId);
      setDeleteTarget(null);
      setSelectedPlayer(null);
      setPlayerDetail(null);
      loadPlayers();
    } catch {}
  }

  // ====== 统一物品管理 ======

  // 汇总三处物品：仓库 + 背包 + 装备槽
  function mergedItems() {
    const map = {};

    for (const slot of storage) {
      const entry = ensureEntry(map, slot.itemKey);
      entry.storageQty += slot.quantity || 1;
    }
    for (const slot of inventory) {
      const entry = ensureEntry(map, slot.itemKey);
      entry.inventoryQty += slot.quantity || 1;
    }
    for (const [slotName, item] of Object.entries(equipment)) {
      if (!item) continue;
      const entry = ensureEntry(map, item.itemKey);
      entry.equipped = slotName;
    }

    return Object.values(map).sort((a, b) => {
      // 消耗品在前，装备在后
      if (a.isEquipment !== b.isEquipment) return a.isEquipment ? 1 : -1;
      return a.key.localeCompare(b.key);
    });
  }

  function ensureEntry(map, itemKey) {
    if (!map[itemKey]) {
      const isEquip = ALL_EQUIP_KEYS.includes(itemKey);
      map[itemKey] = {
        key: itemKey,
        name: (isEquip ? EQUIPMENT_TYPES : ITEM_TYPES)[itemKey]?.name || itemKey,
        storageQty: 0,
        inventoryQty: 0,
        equipped: null,
        isEquipment: isEquip,
      };
    }
    return map[itemKey];
  }

  // 从数组中减少一个物品（优先非 generated，数量>1则减1，否则删槽）
  function tryDeduct(arr, itemKey) {
    // 优先找非 generated 且数量>1的
    const stackIdx = arr.findIndex(s => s.itemKey === itemKey && !s.generatedData && (s.quantity || 1) > 1);
    if (stackIdx !== -1) { arr[stackIdx].quantity -= 1; return true; }
    // 找任何匹配的（generated 或 quantity==1）
    const idx = arr.findIndex(s => s.itemKey === itemKey);
    if (idx !== -1) { arr.splice(idx, 1); return true; }
    return false;
  }

  // "+" 按钮：一律加仓库
  async function handlePlus(itemKey) {
    const current = [...storage];
    const isEquip = ALL_EQUIP_KEYS.includes(itemKey);
    if (isEquip) {
      const def = EQUIPMENT_TYPES[itemKey];
      current.push({ itemKey, quantity: 1, generatedData: { bonus: { ...def.bonus } } });
    } else {
      const idx = current.findIndex(s => s.itemKey === itemKey && !s.generatedData);
      if (idx >= 0) {
        current[idx] = { ...current[idx], quantity: (current[idx].quantity || 0) + 1 };
      } else {
        current.push({ itemKey, quantity: 1 });
      }
    }
    setStorage(current);
    updatePlayerStorage(selectedPlayer.id, current).catch(() => {});
  }

  // "−" 按钮：仓库 → 背包 → 装备 依次扣
  async function handleMinus(itemKey) {
    // 1) 仓库
    const newStorage = [...storage];
    if (tryDeduct(newStorage, itemKey)) {
      setStorage(newStorage);
      updatePlayerStorage(selectedPlayer.id, newStorage).catch(() => {});
      return;
    }
    // 2) 背包
    const newInv = [...inventory];
    if (tryDeduct(newInv, itemKey)) {
      setInventory(newInv);
      updatePlayerInventory(selectedPlayer.id, newInv).catch(() => {});
      return;
    }
    // 3) 装备槽
    for (const [slot, item] of Object.entries(equipment)) {
      if (item && item.itemKey === itemKey) {
        const newEquip = { ...equipment, [slot]: null };
        setEquipment(newEquip);
        updatePlayerEquipment(selectedPlayer.id, newEquip).catch(() => {});
        return;
      }
    }
  }

  // 装备添加弹窗
  function openEquipModal(itemKey) {
    const def = EQUIPMENT_TYPES[itemKey];
    setEquipTarget(itemKey);
    setEquipDest('storage');
    const defaults = {};
    BONUS_FIELDS.forEach(f => defaults[f] = def.bonus?.[f] ?? 0);
    setEquipBonus(defaults);
  }

  async function handleAddEquip() {
    const current = [...storage];
    current.push({ itemKey: equipTarget, quantity: 1, generatedData: { bonus: { ...equipBonus } } });
    setStorage(current);
    setEquipTarget(null);
    updatePlayerStorage(selectedPlayer.id, current).catch(() => {});
  }

  // 删除仓库中指定的装备（含 generated）
  async function handleRemoveStorageEquip(index) {
    const current = [...storage];
    current.splice(index, 1);
    setStorage(current);
    updatePlayerStorage(selectedPlayer.id, current).catch(() => {});
  }

  function storageEquipments() {
    return storage
      .map((s, i) => ({ ...s, _idx: i }))
      .filter(s => ALL_EQUIP_KEYS.includes(s.itemKey));
  }

  async function handleDeleteSuggestion(id) {
    try {
      await deleteSuggestion(id);
      setSuggestions(s => s.filter(x => x.id !== id));
    } catch {}
  }

  const tabs = [
    { key: 'players', label: '玩家管理' },
    { key: 'suggestions', label: '意见箱' },
    { key: 'logs', label: '登录日志' },
  ];

  return (
    <div className="h-screen flex flex-col bg-gray-950 text-gray-200">
      <div className="flex items-center justify-between px-6 py-3 bg-gray-900 border-b border-gray-700">
        <h1 className="text-amber-400" style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '12px' }}>
          管理员后台
        </h1>
        <button onClick={onLogout} className="px-3 py-1 bg-red-700 hover:bg-red-600 text-white text-sm rounded transition cursor-pointer">退出管理</button>
      </div>

      <div className="flex border-b border-gray-700 bg-gray-900">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => handleTab(t.key)}
            className={`px-5 py-2 text-sm transition cursor-pointer ${tab === t.key ? 'text-amber-400 border-b-2 border-amber-400' : 'text-gray-500 hover:text-gray-300'}`}
          >{t.label}</button>
        ))}
      </div>

      <div className="flex-1 flex overflow-hidden">
        {tab === 'players' && (
          <>
            <div className="w-64 border-r border-gray-700 overflow-y-auto bg-gray-900/50">
              <div className="p-3 text-xs text-gray-500 border-b border-gray-700">
                共 {players.length} 位玩家
              </div>
              {players.map(p => (
                <button
                  key={p.id}
                  onClick={() => handleSelectPlayer(p)}
                  className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-800 transition cursor-pointer border-b border-gray-800 ${selectedPlayer?.id === p.id ? 'bg-gray-800 border-l-2 border-l-amber-400' : ''}`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-gray-200">{p.nickname || '(未取名)'}</span>
                    {p.banned ? <span className="text-xs bg-red-800 text-red-300 px-1.5 py-0.5 rounded">封禁</span> : null}
                  </div>
                  <div className="text-xs text-gray-500">@{p.username}</div>
                </button>
              ))}
            </div>
            <div className="flex-1 p-6 overflow-y-auto">
              {playerDetail ? (
                <div className="space-y-4">
                  {playerDetail.user.banned && (
                    <div className="bg-red-900/50 border border-red-700 rounded p-3">
                      <p className="text-red-400 text-sm font-bold mb-1">已封禁</p>
                      <p className="text-red-300 text-xs">{playerDetail.user.ban_reason}</p>
                    </div>
                  )}
                  <div>
                    <div className="text-xs text-gray-500 mb-1">昵称</div>
                    <div className="text-lg text-gray-200">{playerDetail.user.nickname || '(未取名)'}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">用户名</div>
                    <div className="text-gray-300">@{playerDetail.user.username}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">注册时间</div>
                    <div className="text-gray-300">{formatTime(playerDetail.user.created_at)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">最近存档</div>
                    <div className="text-gray-300">
                      {playerDetail.lastSave
                        ? `第 ${playerDetail.lastSave.floor} 层 | Lv.${playerDetail.lastSave.level} | ${formatTime(playerDetail.lastSave.updated_at)}`
                        : '暂无存档'}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">最近活动</div>
                    <div className="space-y-1">
                      {playerDetail.recentLogs.slice(0, 10).map((l, i) => (
                        <div key={i} className="text-sm text-gray-400">
                          {l.action === 'login' ? '登录' : '退出'} — {formatTime(l.created_at)}
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* 物品管理（统一视图） */}
                  <div className="pt-4 border-t border-gray-700">
                    <div className="text-[10px] text-amber-500/70 mb-2 bg-amber-900/20 border border-amber-800/30 rounded px-2 py-1">
                      [+] 直接写入仓库。 [−] 按 仓库→背包→装备 顺序扣除。玩家刷新/进出营地后生效。
                    </div>

                    {/* 汇总表 */}
                    <div className="max-h-96 overflow-y-auto space-y-0.5">
                      {/* 表头 */}
                      <div className="flex items-center text-[9px] text-gray-500 px-2 py-1 border-b border-gray-700 sticky top-0 bg-gray-900">
                        <span className="flex-1">物品</span>
                        <span className="w-10 text-center">仓库</span>
                        <span className="w-10 text-center">背包</span>
                        <span className="w-14 text-center">已装备</span>
                        <span className="w-10 text-center">合计</span>
                        <span className="w-16 text-center">操作</span>
                      </div>

                      {mergedItems().map(item => {
                        const total = item.storageQty + item.inventoryQty + (item.equipped ? 1 : 0);
                        const canMinus = total > 0;
                        return (
                          <div key={item.key}
                            className={`flex items-center py-1.5 px-2 rounded text-sm ${
                              item.isEquipment && item.equipped ? 'bg-purple-900/20 border border-purple-800/30' :
                              item.isEquipment ? 'bg-gray-800/50' : 'bg-gray-800/50'
                            }`}
                          >
                            <span className="flex-1 text-xs text-gray-300 truncate mr-1" title={item.name}>
                              {item.name}
                            </span>
                            <span className="w-10 text-center text-xs text-yellow-400">{item.storageQty || '-'}</span>
                            <span className="w-10 text-center text-xs text-blue-400">{item.inventoryQty || '-'}</span>
                            <span className="w-14 text-center">
                              {item.equipped ? (
                                <span className="text-[9px] text-purple-400 font-bold">{SLOT_LABELS[item.equipped] || item.equipped}</span>
                              ) : (
                                <span className="text-[9px] text-gray-600">-</span>
                              )}
                            </span>
                            <span className="w-10 text-center text-xs text-green-400 font-bold">{total}</span>
                            <span className="w-16 flex justify-center gap-1">
                              <button
                                onClick={() => item.isEquipment ? openEquipModal(item.key) : handlePlus(item.key)}
                                className="w-5 h-5 bg-gray-700 hover:bg-amber-700 text-gray-300 rounded text-xs leading-none cursor-pointer transition-colors"
                                title="添加（写入仓库）"
                              >+</button>
                              <button
                                onClick={() => canMinus && handleMinus(item.key)}
                                disabled={!canMinus}
                                className={`w-5 h-5 rounded text-xs leading-none transition-colors cursor-pointer ${
                                  canMinus ? 'bg-gray-700 hover:bg-red-700 text-gray-300' : 'bg-gray-800 text-gray-700 cursor-not-allowed'
                                }`}
                                title="扣除（仓库→背包→装备）"
                              >−</button>
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* 仓库中已有装备（含自定义词条） */}
                    {(() => {
                      const equips = storageEquipments();
                      if (equips.length === 0) return null;
                      return (
                        <div className="mt-3 pt-3 border-t border-gray-600">
                          <div className="text-[9px] text-gray-500 mb-1">仓库装备详情（含自定义词条）</div>
                          {equips.map(eq => {
                            const def = EQUIPMENT_TYPES[eq.itemKey];
                            const bonus = eq.generatedData?.bonus || {};
                            const hasCustom = eq.generatedData && Object.values(bonus).some(v => v !== (def?.bonus?.[Object.keys(bonus).find(k => bonus[k] === v)] ?? v));
                            return (
                              <div key={eq._idx} className="flex items-center justify-between bg-gray-800/70 rounded px-2 py-1 mb-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs" style={{ color: RARITY_COLORS[def?.rarity] || '#9CA3AF' }}>{def?.name || eq.itemKey}</span>
                                  <span className="text-[8px] text-gray-500">{SLOT_LABELS[def?.slot] || ''}</span>
                                  {hasCustom && <span className="text-[8px] text-amber-500">*自定义</span>}
                                </div>
                                <button onClick={() => handleRemoveStorageEquip(eq._idx)} className="text-[10px] text-red-400 hover:text-red-300 cursor-pointer">移除</button>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })()}

                    {/* 可添加的装备 */}
                    <div className="mt-3 pt-3 border-t border-gray-600">
                      <div className="text-[9px] text-gray-500 mb-1">添加装备（可选词条）</div>
                      <div className="grid grid-cols-2 gap-1 max-h-48 overflow-y-auto">
                        {ALL_EQUIP_KEYS.map(k => {
                          const eq = EQUIPMENT_TYPES[k];
                          return (
                            <button
                              key={k}
                              onClick={() => openEquipModal(k)}
                              className="flex items-center gap-1.5 bg-gray-800/50 hover:bg-amber-900/30 rounded px-2 py-1 text-left cursor-pointer transition-colors"
                            >
                              <span className="text-[10px]" style={{ color: RARITY_COLORS[eq.rarity] || '#9CA3AF' }}>{eq.name}</span>
                              <span className="text-[7px] text-gray-600">{SLOT_LABELS[eq.slot]}</span>
                              <span className="text-[7px] ml-auto px-1 rounded" style={{ backgroundColor: RARITY_COLORS[eq.rarity]+'30', color: RARITY_COLORS[eq.rarity] }}>{eq.rarity}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-700 flex gap-2">
                    {playerDetail.user.banned ? (
                      <button
                        onClick={() => handleUnban(playerDetail.user.id)}
                        className="px-4 py-2 bg-green-700 hover:bg-green-600 text-white text-sm rounded transition cursor-pointer"
                      >解封账号</button>
                    ) : (
                      <button
                        onClick={() => setBanTarget(playerDetail.user)}
                        className="px-4 py-2 bg-red-700 hover:bg-red-600 text-white text-sm rounded transition cursor-pointer"
                      >封禁账号</button>
                    )}
                    <button
                      onClick={() => setDeleteTarget(playerDetail.user)}
                      className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white text-sm rounded transition cursor-pointer"
                    >删除账号</button>
                  </div>
                </div>
              ) : (
                <div className="text-gray-500 text-sm flex items-center justify-center h-full">选择左侧玩家查看详情</div>
              )}
            </div>
          </>
        )}

        {tab === 'suggestions' && (
          <div className="flex-1 p-6 overflow-y-auto">
            {suggestions.length === 0 ? (
              <div className="text-gray-500 text-sm text-center py-20">暂无意见</div>
            ) : (
              <div className="space-y-3">
                {suggestions.map(s => (
                  <div key={s.id} className="bg-gray-900 border border-gray-700 rounded p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-amber-400 text-sm">{s.nickname || s.username}</span>
                        <span className="text-xs text-gray-500">{formatTime(s.created_at)}</span>
                      </div>
                      <button onClick={() => handleDeleteSuggestion(s.id)} className="text-xs text-red-400 hover:text-red-300 transition cursor-pointer">删除</button>
                    </div>
                    <p className="text-sm text-gray-300">{s.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'logs' && (
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="space-y-1">
              {logs.map(l => (
                <div key={l.id} className="flex items-center gap-4 text-sm py-1.5 border-b border-gray-800">
                  <span className={`px-2 py-0.5 rounded text-xs ${l.action === 'login' ? 'bg-green-900 text-green-400' : 'bg-red-900 text-red-400'}`}>
                    {l.action === 'login' ? '登录' : '退出'}
                  </span>
                  <span className="text-gray-300">{l.username}</span>
                  <span className="text-xs text-gray-500 ml-auto">{formatTime(l.created_at)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 封禁原因选择弹窗 */}
      {banTarget && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-red-700 rounded-lg p-6 w-[400px]">
            <h3 className="text-red-400 text-center mb-4" style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '11px' }}>
              封禁账号
            </h3>
            <p className="text-gray-400 text-sm text-center mb-4">
              封禁 @{banTarget.username}，请选择原因：
            </p>
            <div className="space-y-2 mb-4">
              {BAN_REASONS.map((r, i) => (
                <button
                  key={i}
                  onClick={() => handleBan(banTarget.id, r)}
                  className="w-full text-left px-3 py-2 bg-gray-800 border border-gray-700 rounded text-sm text-gray-300 hover:bg-gray-700 hover:border-red-500 transition cursor-pointer"
                >{r}</button>
              ))}
            </div>
            <button
              onClick={() => setBanTarget(null)}
              className="w-full py-2 bg-gray-700 text-gray-400 rounded text-sm hover:bg-gray-600 transition cursor-pointer"
            >取消</button>
          </div>
        </div>
      )}

      {/* 装备添加弹窗（含词条自定义） */}
      {equipTarget && (() => {
        const def = EQUIPMENT_TYPES[equipTarget];
        return (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-gray-900 border border-amber-700 rounded-lg p-6 w-[500px] max-h-[80vh] overflow-y-auto">
              <h3 className="text-amber-400 text-center mb-2" style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '10px' }}>
                添加装备
              </h3>
              <p className="text-gray-300 text-sm text-center mb-1">{def.name}</p>
              <p className="text-xs text-center mb-4">
                <span className="text-gray-500">{SLOT_LABELS[def.slot]} · </span>
                <span style={{ color: RARITY_COLORS[def.rarity] }}>{def.rarity}</span>
              </p>
              <div className="text-xs text-gray-500 mb-2">词条设置（留空使用默认值）</div>
              <div className="grid grid-cols-4 gap-2 mb-4">
                {BONUS_FIELDS.map(f => (
                  <div key={f} className="flex flex-col">
                    <label className="text-[9px] text-gray-500 mb-0.5">{f}</label>
                    <input
                      type="number"
                      value={equipBonus[f] ?? ''}
                      onChange={e => setEquipBonus(prev => ({ ...prev, [f]: e.target.value === '' ? undefined : parseFloat(e.target.value) }))}
                      className="bg-gray-800 border border-gray-600 text-gray-200 text-xs px-1 py-0.5 rounded w-full focus:outline-none focus:border-amber-500"
                    />
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <button onClick={() => setEquipTarget(null)} className="flex-1 py-2 bg-gray-700 text-gray-300 rounded text-sm hover:bg-gray-600 cursor-pointer">取消</button>
                <button onClick={handleAddEquip} className="flex-1 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded text-sm font-bold cursor-pointer">添加装备</button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* 删除确认弹窗 */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-red-700 rounded-lg p-6 w-[400px]">
            <h3 className="text-red-400 text-center mb-4" style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '11px' }}>
              删除账号
            </h3>
            <p className="text-gray-300 text-sm text-center mb-2">
              确认删除玩家 <span className="text-amber-400">@{deleteTarget.username}</span>？
            </p>
            <p className="text-red-400 text-xs text-center mb-6">
              此操作不可撤销，所有存档、意见和日志将被一并删除。
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2 bg-gray-700 text-gray-300 rounded text-sm hover:bg-gray-600 transition cursor-pointer"
              >取消</button>
              <button
                onClick={() => handleDelete(deleteTarget.id)}
                className="flex-1 py-2 bg-red-700 hover:bg-red-600 text-white rounded text-sm font-bold transition cursor-pointer"
              >确认删除</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
