import { SKILLS, TOTAL_FLOORS } from '../../game/constants';
import { getExpToNext } from '../../game/level';
import { getSkillInfo, canUseSkill, getSkillCooldown } from '../../game/skills';
import Divider from '../shared/Divider';
import HpBar from '../shared/HpBar';
import MpBar from '../shared/MpBar';
import InventoryDisplay from '../shared/InventoryDisplay';
import TutorialOverlay from './TutorialOverlay';

function logColor(msg) {
  if (msg.includes('CRIT')) return 'text-yellow-300 font-bold';
  if (msg.includes('闪避')) return 'text-green-300';
  if (msg.includes('恢复') || msg.includes('疗')) return 'text-green-400';
  if (msg.includes('获得') || msg.includes('掉落')) return 'text-yellow-400';
  if (msg.includes('随机事件') || msg.includes('[')) return 'text-purple-400';
  if (msg.includes('灼烧') || msg.includes('中毒') || msg.includes('冻结') || msg.includes('流血')) return 'text-orange-400';
  if (msg.includes('狂暴') || msg.includes('BOSS')) return 'text-red-400 font-bold';
  if (msg.includes('升级') || msg.includes('LV')) return 'text-yellow-300';
  if (msg.includes('成就')) return 'text-cyan-400';
  if (msg.includes('伤害') || msg.includes('造成')) return 'text-gray-400';
  return 'text-gray-500';
}

export default function BattlePanel({ state, onAction, onUseItem, onSkill, onCampAction }) {
  const { player, monster, battleTurn, inventory, battleLog,
          currentFloor, floorName, isBossFloor, expeditionGold } = state;
  const skillKeys = Object.keys(SKILLS);

  return (
    <>
      {/* 教程引导覆盖层 */}
      <TutorialOverlay state={state} />

      {/* 教程Boss投降对话框 */}
      {state.pendingEvent && state.pendingEvent.isTutorial && (
        <div className="bg-amber-900 border-2 border-amber-500 rounded p-3 space-y-2 mb-2">
          <div className="text-amber-400 font-bold text-sm">{state.pendingEvent.name}</div>
          <div className="text-gray-300 text-xs whitespace-pre-wrap">{state.pendingEvent.description}</div>
          <div className="text-green-400 text-xs">奖励：{state.pendingEvent.reward}</div>
          <button
            onClick={() => onCampAction('event_accept')}
            className="w-full py-1.5 bg-amber-700 hover:bg-amber-600 rounded text-xs font-bold text-white"
          >
            继续
          </button>
        </div>
      )}

      {/* 楼层标识 */}
      <div className="text-xs text-gray-500">
        {floorName} — Floor {currentFloor}/{TOTAL_FLOORS}
        {isBossFloor && <span className="text-red-400 font-bold ml-1">[BOSS]</span>}
      </div>

      {/* 战斗标题 */}
      <div className="space-y-1">
        <div className={`font-bold text-base font-pixel ${isBossFloor ? 'text-red-500' : 'text-red-400'}`}>
          战斗中：{monster?.name}
          {monster?.enraged && <span className="text-red-600 animate-pulse ml-1">[狂暴]</span>}
        </div>
        <div>
          <span className="text-gray-400">回合：</span>
          <span className="text-yellow-400 font-bold">{battleTurn}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span><span className="text-gray-400">等级</span> <span className="text-yellow-400">LV {player.level}</span></span>
          <span><span className="text-gray-400">Gold</span> <span className="text-yellow-400">{expeditionGold}</span></span>
        </div>
        <div>
          <span className="text-gray-400">经验：</span>
          <span className="text-green-400 text-xs">{player.exp} / {getExpToNext(state)}</span>
        </div>
      </div>

      <Divider />

      {/* 血条 */}
      <div className="space-y-2">
        <div>
          <HpBar label="HP" current={player.hp} max={player.maxHp} color="green" />
          <MpBar current={player.mp} max={player.maxMp} />
          <div className="flex flex-wrap gap-1 mt-0.5">
            {player.isDefending && <span className="text-blue-400 text-xs">[防御中]</span>}
            {player.attackBuff > 0 && <span className="text-orange-400 text-xs">[攻击+{player.attackBuff}]</span>}
            {player.defenseBuff > 0 && <span className="text-cyan-400 text-xs">[护盾x{player.defenseBuff}]</span>}
            {player.shieldTurns > 0 && <span className="text-blue-300 text-xs">[技能护盾 {player.shieldTurns}回合]</span>}
          </div>
        </div>

        <div>
          <HpBar label={`${monster?.name} HP`} current={monster?.hp} max={monster?.maxHp} color="red" />
          {monster?.isDefending && <span className="text-blue-400 text-xs">[防御中]</span>}
        </div>
      </div>

      <Divider />

      {/* 攻击/防御/治疗 */}
      <div className="space-y-2">
        <button onClick={() => onAction('attack')} className="w-full py-2 rounded font-bold text-white bg-red-600 hover:bg-red-500 active:bg-red-700 transition-colors">攻击</button>
        <button onClick={() => onAction('defend')} className="w-full py-2 rounded font-bold text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 transition-colors">防御</button>
        <button onClick={() => onAction('heal')} className="w-full py-2 rounded font-bold text-white bg-green-600 hover:bg-green-500 active:bg-green-700 transition-colors">治疗</button>
      </div>

      <Divider />

      {/* 技能 */}
      <div>
        <div className="text-gray-400 mb-1 text-xs">技能</div>
        <div className="space-y-1">
          {skillKeys.map(skillKey => {
            const skill = getSkillInfo(skillKey);
            const usable = canUseSkill(state, skillKey);
            const cd = getSkillCooldown(state, skillKey);
            const cdText = cd > 0 ? ` (CD:${cd})` : '';
            return (
              <button
                key={skillKey}
                onClick={() => onSkill(skillKey)}
                disabled={!usable}
                title={!usable ? (cd > 0 ? `冷却中 ${cd}回合` : 'MP不足') : `消耗 ${skill.mp} MP`}
                className={`w-full py-1.5 rounded font-bold text-xs text-white transition-colors
                  ${usable ? 'bg-purple-600 hover:bg-purple-500 active:bg-purple-700'
                           : 'bg-gray-700 text-gray-500 cursor-not-allowed'}`}
              >
                [{skill.key.toUpperCase()}] {skill.name} ({skill.mp} MP){cdText}
              </button>
            );
          })}
        </div>
      </div>

      <Divider />

      {/* 背包 */}
      <InventoryDisplay inventory={inventory} onUseItem={onUseItem} />
      <div className="text-xs text-gray-500 text-center">数字键 1/2/3 或点击使用道具</div>

      <Divider />

      {/* 战斗日志 */}
      <div className="bg-gray-800 rounded p-2 text-xs border border-gray-700 max-h-32 overflow-y-auto space-y-0.5">
        {battleLog.map((msg, i) => <div key={i} className={logColor(msg)}>{msg}</div>)}
      </div>
    </>
  );
}
