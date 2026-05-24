// NPC 定义（Phase 11）
export const CAMP_NPCS = {
  BLACKSMITH: {
    id: 'blacksmith',
    name: '铁匠奥林',
    description: '一个魁梧的矮人，在营地边缘守着熔炉。',
    greeting: '"需要更好的装备吗？我见过深渊底部的金属。"',
    loreCategory: 'items',
    topics: [
      { text: '关于你的熔炉', response: '"这把锤子已经传承了三代人。地牢里的矿石比地表坚固得多。"' },
      { text: '知道什么传说吗？', response: '"龙鳞甲是用远古巨龙的褪鳞锻造的——那是唯一能承受龙焰的材料。"', lore: true },
    ],
  },
  MERCHANT: {
    id: 'merchant',
    name: '商人莉莎',
    description: '一个巧舌如簧的旅行者，带着来自遥远国度的货物。',
    greeting: '"一切都标好了价，亲爱的探险者。不过嘛——好东西可以商量。"',
    loreCategory: 'world',
    topics: [
      { text: '你从哪里来？', response: '"我去过的地方比这里的楼层还多。地上的世界比你想象的大得多。"' },
      { text: '有什么特别商品？', response: '"偶尔会有人带回一些...不寻常的东西。如果你出得起价。"', lore: true },
    ],
  },
  HUNTER: {
    id: 'hunter',
    name: '猎人凯尔',
    description: '一个满身伤痕的老兵，深知每一层地牢的危险。',
    greeting: '"小心脚下。我见过的事情足够让你做一个月噩梦。"',
    loreCategory: 'monsters',
    topics: [
      { text: '说说怪物的事', response: '"暗影不是生物——它们是活着的恐惧。你砍不到真正伤害它的地方。"', lore: true },
      { text: '有什么建议？', response: '"史莱姆看起来很弱，但它们的恢复能力会让你在持久战中吃亏。速战速决。"' },
    ],
  },
  SCHOLAR: {
    id: 'scholar',
    name: '学者艾拉拉',
    description: '一位年迈的贤者，正在研究地牢的历史。',
    greeting: '"墙壁记得我们早已遗忘的事情。如果你愿意听..."',
    loreCategory: 'dungeon',
    topics: [
      { text: '地牢的起源', response: '"这些地牢并非自然形成。十二层结构太精确了——这是某种...设计。"', lore: true },
      { text: '关于火焰元素', response: '"据说元素神殿里的存在并非守护者，而是囚徒。被锁在里面防止它烧毁世界。"' },
    ],
  },
};
