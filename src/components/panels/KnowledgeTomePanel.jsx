import Divider from '../shared/Divider';

export default function KnowledgeTomePanel({ onBack }) {
  return (
    <div className="space-y-3 animate-fade-in max-h-96 overflow-y-auto">
      <div className="bg-gray-800 rounded p-3 border border-cyan-700 text-center">
        <div className="text-cyan-400 font-bold text-lg" style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '12px' }}>
          知识宝典
        </div>
        <div className="text-gray-500 text-xs mt-1">随时查阅的冒险指南</div>
      </div>

      {/* 按键操作 */}
      <Section title="按键操作">
        <Row k="W A S D" v="移动角色（上下左右）" />
        <Row k="方向键" v="也可用于移动" />
        <Row k="1 2 3" v="使用背包第1/2/3格道具" />
        <Row k="Q" v="重击技能（5 MP）" />
        <Row k="E" v="护盾技能（8 MP）" />
        <Row k="R" v="吸血技能（10 MP）" />
        <Row k="T" v="毒击技能（12 MP）" />
        <Row k="F" v="冰障技能（15 MP）" />
      </Section>

      <Divider />

      {/* 战斗系统 */}
      <Section title="战斗系统">
        <Row k="攻击" v="造成物理伤害，可能触发暴击" />
        <Row k="防御" v="本回合受到的伤害减半" />
        <Row k="治疗" v="恢复HP（受治疗加成影响）" />
        <Row k="暴击" v="基础10%+敏捷×2%，暴击伤害×2" />
        <Row k="技能" v="消耗MP，部分有冷却时间" />
        <Row k="道具" v="药水/卷轴，战斗中可随时使用" />
      </Section>

      <Divider />

      {/* 营地功能 */}
      <Section title="营地功能">
        <Row k="篝火" v="完全恢复HP和MP" />
        <Row k="商店" v="购买药水、卷轴、背包扩容" />
        <Row k="仓库" v="物品永久保存，死亡不丢失" />
        <Row k="装备" v="武器/防具/饰品三槽位" />
        <Row k="地下城之门" v="选择楼层开始远征" />
        <Row k="成就" v="查看已解锁成就" />
        <Row k="营地升级" v="Meta永久强化(金币购买)" />
      </Section>

      <Divider />

      {/* 进阶知识 */}
      <Section title="进阶知识">
        <Row k="清层" v="击杀当前层所有怪物→楼梯解锁→奖励" />
        <Row k="品质" v="普通(灰)/稀有(蓝)/史诗(紫)/传说(金)" />
        <Row k="Boss" v="第4/6/8/10/12层各有一个独特Boss" />
        <Row k="精英怪" v="15%概率，金色边框，额外奖励" />
        <Row k="死亡" v="丢失远征金币+背包物品，保留等级/仓库/Meta" />
        <Row k="状态异常" v="灼烧/中毒/冻结/流血，战斗后清除" />
        <Row k="遗物" v="远征开始时随机获得，仅当次有效" />
      </Section>

      <button
        onClick={onBack}
        className="w-full py-2 rounded font-bold text-white bg-cyan-700 hover:bg-cyan-600 active:bg-cyan-800 transition-colors text-xs"
      >
        关闭宝典
      </button>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <div className="text-cyan-400 text-xs font-bold mb-1">{title}</div>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

function Row({ k, v }) {
  return (
    <div className="flex gap-2 text-xs">
      <span className="text-amber-400 font-bold min-w-[80px]">{k}</span>
      <span className="text-gray-400">{v}</span>
    </div>
  );
}
