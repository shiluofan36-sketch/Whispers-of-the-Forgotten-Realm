import { useState, lazy, Suspense, useEffect, useRef } from 'react';
import Divider from '../shared/Divider';
import { getNpcInfo } from '../../game/npc/npcManager';
import { hasWorldFlag } from '../../game/world/worldFlags';
import KnowledgeTomePanel from './KnowledgeTomePanel';

const ShopPanel = lazy(() => import('./ShopPanel'));
const StoragePanel = lazy(() => import('./StoragePanel'));
const FloorSelectPanel = lazy(() => import('./FloorSelectPanel'));
const EquipmentPanel = lazy(() => import('./EquipmentPanel'));
const AchievementPanel = lazy(() => import('./AchievementPanel'));
const MetaPanel = lazy(() => import('./MetaPanel'));

const LazyLoad = ({ children }) => (
  <Suspense fallback={<div className="text-gray-500 text-xs p-2">Loading...</div>}>
    {children}
  </Suspense>
);

export default function CampPanel({ state, onCampAction }) {
  const [view, setView] = useState('main');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { player, unlockedFloors, inventorySlots } = state;

  // 教程步骤11：打开地下城之门视图时自动推进（避免 StrictMode 重复触发）
  const tutorial11Advanced = useRef(false);
  useEffect(() => {
    if (state.tutorialStep === 11 && view === 'floorSelect' && !tutorial11Advanced.current) {
      tutorial11Advanced.current = true;
      onCampAction('tutorial_advance');
    }
  }, [view, state.tutorialStep, onCampAction]);

  return (
    <div className="space-y-3">
      {/* 营地标题 */}
      <div className="bg-gray-800 rounded p-3 border border-yellow-700 text-center">
        <div className="text-yellow-400 font-bold text-lg font-pixel">CAMP</div>
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
          {/* 教程营地引导对话框 */}
          {state.pendingEvent && state.pendingEvent.isTutorial && (
            <div className="bg-amber-900 border-2 border-amber-500 rounded p-3 space-y-2 mb-2">
              <div className="text-amber-400 font-bold text-sm">{state.pendingEvent.name}</div>
              <div className="text-gray-300 text-xs whitespace-pre-wrap">{state.pendingEvent.description}</div>
              <div className="text-green-400 text-xs">奖励：{state.pendingEvent.reward}</div>
              <button
                onClick={() => onCampAction('event_accept')}
                className="w-full py-1.5 bg-amber-700 hover:bg-amber-600 rounded text-xs font-bold text-white"
              >
                我知道了
              </button>
            </div>
          )}

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
          <button
            onClick={() => setView('meta')}
            className="w-full py-2 rounded font-bold text-white bg-pink-700 hover:bg-pink-600 active:bg-pink-800 transition-colors"
          >
            [Meta] 营地升级
          </button>

          <Divider />

          {/* 知识宝典（教程完成后显示） */}
          {hasWorldFlag(state, 'tutorialCompleted') && (
            <button
              onClick={() => setView('knowledgeTome')}
              className="w-full py-2 rounded font-bold text-white bg-cyan-700 hover:bg-cyan-600 active:bg-cyan-800 transition-colors"
            >
              [?] 知识宝典
            </button>
          )}

          <Divider />

          {/* Phase 11: NPCs */}
          <div className="text-yellow-400 text-xs font-bold mb-1">营地的同伴们</div>
          {(state.npcs || []).map(npcId => {
            const npc = getNpcInfo(npcId);
            if (!npc) return null;
            return (
              <button
                key={npcId}
                onClick={() => setView('npc_' + npcId)}
                className="w-full py-1.5 rounded text-white bg-gray-700 hover:bg-gray-600 text-xs text-left px-2"
              >
                [{npc.name}] {npc.description.substring(0, 28)}...
              </button>
            );
          })}

          <Divider />

          {/* 删除存档 */}
          {!confirmDelete ? (
            <button
              onClick={() => setConfirmDelete(true)}
              className="w-full py-2 rounded font-bold text-red-400 bg-gray-800 border border-red-900 hover:bg-red-950 active:bg-red-900 transition-colors text-sm"
            >
              删除存档
            </button>
          ) : (
            <div className="bg-red-950 border border-red-700 rounded p-3 text-center space-y-2">
              <div className="text-red-400 text-xs font-bold">确定要删除存档吗？此操作不可撤销！</div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    onCampAction('delete_save');
                    window.location.reload();
                  }}
                  className="flex-1 py-1.5 rounded font-bold text-white bg-red-600 hover:bg-red-500 active:bg-red-700 transition-colors text-xs"
                >
                  确认删除
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="flex-1 py-1.5 rounded font-bold text-gray-300 bg-gray-700 hover:bg-gray-600 active:bg-gray-800 transition-colors text-xs"
                >
                  取消
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 成就子面板 */}
      {view === 'achievements' && <div className="animate-fade-in"><LazyLoad><AchievementPanel state={state} onBack={() => setView('main')} /></LazyLoad></div>}

      {/* 商店子面板 */}
      {view === 'shop' && <div className="animate-fade-in"><LazyLoad><ShopPanel state={state} onCampAction={onCampAction} onBack={() => setView('main')} /></LazyLoad></div>}

      {/* 仓库子面板 */}
      {view === 'storage' && <div className="animate-fade-in"><LazyLoad><StoragePanel state={state} onCampAction={onCampAction} onBack={() => setView('main')} /></LazyLoad></div>}

      {/* 装备子面板 */}
      {view === 'equipment' && <div className="animate-fade-in"><LazyLoad><EquipmentPanel state={state} onCampAction={onCampAction} onBack={() => setView('main')} /></LazyLoad></div>}

      {/* 楼层选择子面板 */}
      {view === 'floorSelect' && <div className="animate-fade-in"><LazyLoad><FloorSelectPanel state={state} onCampAction={onCampAction} onBack={() => setView('main')} /></LazyLoad></div>}

      {/* Meta 升级子面板 */}
      {view === 'meta' && <div className="animate-fade-in"><LazyLoad><MetaPanel state={state} onCampAction={onCampAction} onBack={() => setView('main')} /></LazyLoad></div>}

      {/* 知识宝典子面板 */}
      {view === 'knowledgeTome' && <div className="animate-fade-in"><KnowledgeTomePanel onBack={() => setView('main')} /></div>}

      {/* NPC 对话子面板 */}
      {view.startsWith('npc_') && <NpcTalkView npcId={view.replace('npc_', '')} state={state} onCampAction={onCampAction} onBack={() => setView('main')} />}
    </div>
  );
}

/** Phase 11: NPC 对话组件 */
function NpcTalkView({ npcId, state, onCampAction, onBack }) {
  const [dialogue, setDialogue] = useState(null);
  const npc = getNpcInfo(npcId);

  if (!npc) return <div className="text-red-400 text-xs">NPC 未找到</div>;

  function handleTalk(topicIndex) {
    const result = onCampAction('npc_talk', { npcId, topicIndex });
    if (result) {
      setDialogue({ text: result.dialogue, name: result.npcName });
    }
  }

  return (
    <div className="space-y-3">
      <div className="bg-gray-800 rounded p-3 border border-yellow-700">
        <div className="text-yellow-400 font-bold text-sm font-pixel">{npc.name}</div>
        <div className="text-gray-500 text-xs">{npc.description}</div>
      </div>

      {!dialogue ? (
        <>
          <button
            onClick={() => handleTalk(-1)}
            className="w-full py-2 rounded font-bold text-white bg-blue-700 hover:bg-blue-600 text-xs"
          >
            打招呼
          </button>
          {npc.topics.map((topic, i) => (
            <button
              key={i}
              onClick={() => handleTalk(i)}
              className="w-full py-1.5 rounded text-white bg-gray-700 hover:bg-gray-600 text-xs text-left px-2"
            >
              {topic.text}
            </button>
          ))}
        </>
      ) : (
        <>
          <div className="bg-gray-900 rounded p-3 border border-gray-700 text-xs text-gray-300 whitespace-pre-wrap">
            {dialogue.text}
          </div>
          <button
            onClick={() => setDialogue(null)}
            className="w-full py-2 rounded font-bold text-white bg-gray-700 hover:bg-gray-600 text-xs"
          >
            继续对话
          </button>
        </>
      )}

      <button
        onClick={onBack}
        className="w-full py-2 rounded font-bold text-white bg-gray-700 hover:bg-gray-600 text-xs"
      >
        离开
      </button>
    </div>
  );
}
