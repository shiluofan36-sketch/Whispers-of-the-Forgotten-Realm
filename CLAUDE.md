# CLAUDE.md

## 项目概述

这是 **Whispers of the Forgotten Realm**，一个回合制地牢爬行 RPG 网页游戏。
目标是"先完成最小可运行版本（MVP）"，不追求复杂和炫酷。

- **类型**：单人回合制网格地图地牢 RPG — Whispers of the Forgotten Realm
- **渲染**：HTML5 Canvas 纯渲染（非 DOM/React 网格）
- **状态**：数据驱动、可变状态对象
- **阶段**：已完成 Phase 1~11（含 Node 服务层/特殊房间/NPC/Meta升级/世界观碎片），~90 个源文件，中大型项目规模

### 技术栈

| 层 | 技术 |
|----|------|
| 框架 | React 18 (仅 UI 层，不参与游戏逻辑) |
| 构建 | Vite 6 |
| 样式 | TailwindCSS 3 |
| 渲染 | HTML5 Canvas 2D API |
| 后端 | 无（纯前端，无数据库/登录/WebSocket） |

### 运行方式

```bash
npm install
npm run dev        # http://localhost:5173 (--host 监听局域网)
python ngrok_public.py  # 可选：公网测试
```

## 项目架构

```
src/
├── main.jsx / App.jsx      # React 入口 + 状态桥接
├── index.css               # Tailwind 指令
├── game/                   # 游戏引擎（纯 JS，零 React 依赖）
│   ├── data/               # 数据配置（Phase 9 拆分）
│   │   ├── renderData.js   # 地图/渲染/颜色/楼梯/障碍物
│   │   ├── playerData.js   # 玩家初始属性 + 升级增量
│   │   ├── combatData.js   # 暴击系统
│   │   ├── monsterData.js  # MONSTER_TYPES + BOSS_TYPES + GOLD_DROPS
│   │   ├── floorData.js    # FLOORS + 缩放 + 清层奖励
│   │   ├── itemData.js     # ITEM_TYPES + EQUIPMENT_TYPES + MAX_STACK
│   │   ├── skillData.js    # SKILLS
│   │   ├── campData.js     # 营地 + 商店配置
│   │   ├── achievementData.js # ACHIEVEMENTS
│   │   ├── gamePhaseData.js   # GAME_PHASE
│   │   └── index.js        # barrel 统一导出
│   ├── constants.js        # 薄层 re-export（保持向后兼容）
│   ├── state.js            # createInitialState() 单一数据源
│   ├── game.js             # 游戏控制器（输入路由 + 模块编排）
│   ├── player.js           # 玩家移动 + 碰撞检测
│   ├── map.js              # 地图工具：空地查找/碰撞/边界
│   ├── monsters.js         # 怪物生成（数据驱动，5种类型）
│   ├── items.js            # 道具定义 + getItemInfo()/getRandomItem()
│   ├── inventory/          # 背包/仓库/堆叠
│   │   ├── inventoryManager.js # 背包管理
│   │   ├── storageManager.js   # 仓库
│   │   └── stackSystem.js      # 堆叠逻辑
│   ├── skills.js           # 技能查询 + MP检查
│   ├── level.js            # 经验/升级系统
│   ├── input.js            # 键盘 WASD/方向键映射
│   ├── renderer.js         # Canvas 绘制
│   ├── battle/             # 战斗子系统
│   │   ├── battleEngine.js    # 战斗流程编排
│   │   ├── playerActions.js   # 玩家行动
│   │   ├── monsterAI.js       # 普通怪物AI
│   │   ├── damageSystem.js    # 伤害计算
│   │   ├── battleRewards.js   # 战斗结算 + 随机事件触发
│   │   └── battleEffects.js   # Buff管理
│   ├── dungeon/            # 地牢系统
│   │   ├── floorManager.js    # 楼层切换
│   │   ├── floorGenerator.js  # 楼层地图生成
│   │   ├── difficultyScaling.js # 难度缩放
│   │   ├── stairsSystem.js    # 楼梯锁定/解锁
│   │   └── floorProgression.js # 清层判定 + 奖励
│   ├── boss/               # Boss系统
│   │   ├── bossFactory.js        # Boss实体创建
│   │   ├── bossAI.js             # Boss行为决策（4种行为模式）
│   │   ├── bossSkills.js         # Boss技能
│   │   └── bossSummonSystem.js   # 召唤系统（亡灵法师）
│   ├── equipment/          # 装备系统（Phase 9 品质支持）
│   │   └── equipmentManager.js # 装备/卸下 + 品质/属性加成
│   ├── achievements/       # 成就系统
│   │   └── achievementManager.js
│   ├── expedition/         # 远征管理
│   │   └── expeditionManager.js
│   ├── camp/               # 营地系统
│   │   ├── campManager.js
│   │   └── shopManager.js
│   ├── events/             # 随机事件（Phase 9 新增）
│   │   └── randomEvents.js
│   ├── effects/            # 战斗反馈（Phase 10）
│   │   ├── floatingTextManager.js  # 伤害飘字
│   │   ├── screenShake.js          # 屏幕震动
│   │   └── entityFlash.js          # 受击闪烁
│   ├── audio/              # 音效系统（Phase 10，Web Audio API 合成）
│   │   └── audioManager.js
│   ├── statusEffects/      # 状态异常（Phase 10）
│   │   ├── effectDefinitions.js     # 配置
│   │   └── statusManager.js         # 管理器
│   ├── rooms/              # 特殊房间（Phase 11）
│   │   ├── roomData.js            # 5种房间类型定义
│   │   └── roomManager.js         # 生成+触发逻辑
│   ├── npc/                # NPC 系统（Phase 11）
│   │   ├── npcData.js             # 4个NPC定义+对话
│   │   └── npcManager.js          # 对话逻辑
│   ├── lore/               # 世界观碎片（Phase 11）
│   │   ├── loreData.js            # Re-export from shared/config
│   │   └── loreManager.js         # 随机选取+已读追踪
│   ├── meta/               # Meta升级（Phase 11）
│   │   ├── metaConfig.js          # 4条升级线配置
│   │   └── metaManager.js         # 购买+应用逻辑
│   └── save/               # 存档系统
│       ├── saveManager.js
│       └── saveSchema.js
├── services/               # 前端服务层（Phase 11）
│   ├── apiClient.js               # fetch封装（/api/v1）
│   ├── saveService.js             # 服务端存档+localStorage回退
│   └── configService.js           # 配置缓存获取
└── components/             # React UI 组件
    ├── GameCanvas.jsx      # <canvas> + rAF 循环
    ├── GameUI.jsx          # HUD 面板路由（43行，含React.lazy）
    ├── panels/             # 11 个游戏面板
    │   ├── CampPanel.jsx
    │   ├── ShopPanel.jsx
    │   ├── StoragePanel.jsx
    │   ├── FloorSelectPanel.jsx
    │   ├── EquipmentPanel.jsx
    │   ├── AchievementPanel.jsx
    │   ├── ExplorationPanel.jsx
    │   ├── BattlePanel.jsx
    │   ├── GameOverPanel.jsx
    │   ├── VictoryPanel.jsx
    │   └── MetaPanel.jsx
    └── shared/             # 5 个共享 UI 组件
        ├── HpBar.jsx
        ├── MpBar.jsx
        ├── InventoryDisplay.jsx
        ├── FloorClearedBanner.jsx
        └── Divider.jsx

server/                # Node.js 服务层（Phase 11）
├── index.js           # Express 入口（cors+compression+json）
├── config/index.js    # PORT 3001 / SAVES_DIR
├── routes/            # /api/v1/health, /save, /config, /lore
├── controllers/       # 请求处理
├── services/          # 文件读写/saveId校验/配置聚合
├── saves/             # JSON存档目录（gitignore）
└── utils/             # errorHandler + UUID工具

shared/               # 前后端共享（Phase 11）
└── config/            # 唯一配置源（14个模块）
    ├── bosses.js, monsters.js, equipment.js
    ├── floors.js, achievements.js, lore.js
    ├── players.js, combat.js, skills.js
    ├── camp.js, render.js, phases.js
    └── index.js       # barrel统一导出
```

### 关键设计模式

1. **单一数据源**：游戏状态是一个可变 JS 对象，`state.js` 的 `createInitialState()` 定义形状
2. **游戏引擎与 React 分离**：`src/game/` 下所有文件不依赖 React，可独立测试
3. **控制器模式**：`game.js` 的 `createGame()` 返回 `{ getState, handleInput, handleBattleAction, handleUseItem, handleSkill, renderFrame, setOnUpdate }`
4. **React 状态同步**：App.jsx 通过 `onUpdate` 回调 + `{...state}` 浅拷贝触发重渲染
5. **数据驱动**：怪物/道具/技能/楼层/Boss 在 `constants.js` 中纯配置定义
6. **状态机**：`EXPLORATION → BATTLE → EXPLORATION/GAME_OVER/VICTORY`
7. **模块化战斗引擎**：battleEngine 统一入口编排，playerActions/monsterAI/damageSystem/battleRewards/battleEffects 各司其职
8. **地牢规则闭环**：进入楼层→楼梯锁定→清空怪物→清层奖励→楼梯解锁→下一层

### 游戏状态机

```
EXPLORATION ──碰到怪物──> BATTLE ──怪物死亡(非Boss层/未清层)──> EXPLORATION (回血+新怪物)
     ^                        │
     │             怪物死亡(Boss层) ──> VICTORY
     │                        │
     │             玩家死亡 ──> GAME_OVER
     │
     └── 清空楼层 + 踩解锁楼梯 ──> 下一层 EXPLORATION
```

### 当前功能清单（Phase 1~9）

| 系统 | 说明 |
|------|------|
| 地图 | 10x10 网格，Canvas 渲染，6个随机障碍物（每层主题色不同） |
| 地牢 | 12层固定地牢，楼梯推进机制，3主题（森林/洞穴/遗迹） |
| 楼梯锁定 | 必须清空当前层所有怪物才能解锁楼梯（红色X→金色>） |
| 清层奖励 | HP+20%, MP+30%, 随机道具, EXP(层数×20), FLOOR CLEARED! 横幅 |
| 移动 | WASD/方向键，不可穿越障碍物 |
| 回合 | 每次移动/行动 = 1回合 |
| 怪物 | 5种普通怪物，楼层怪物池筛选，难度随楼层缩放(HP+15%/ATK+10%每层) |
| 战斗 | 回合制，攻击/防御/治疗 + 3技能(Q/E/R)，怪物AI随机攻防 |
| 暴击 | 基础10% + 敏捷×2%，2倍伤害 |
| MP系统 | 技能消耗MP，MP不足时按钮禁用/键盘拦截 |
| Buff | 攻击卷轴(+5伤害)、防御卷轴(下次受伤减半) |
| 道具 | 怪物50%掉落，3格背包，数字键1/2/3或点击使用 |
| 成长 | 6维属性(力/防/敏/MP/EXP/等级)，升级回满HP/MP |
| Boss | 5种Boss(F4/F6/F8/F10/F12)，各自独立AI+技能+狂暴+专属掉落 |
| 装备 | 3槽位(武器/防具/饰品)，11种装备，品质系统(普通/稀有/史诗) |
| 成就 | 12个成就，事件驱动自动检查 |
| 营地 | 商店/仓库/营火/装备/楼层选择/成就查看 |
| 远征 | 选择楼层开始远征，死亡丢失远征金币和背包，保留成长和仓库 |
| 存档 | localStorage 持久化，自动存档(升级/楼层解锁/返回营地) |
| 随机事件 | 击杀普通怪物10%触发：宝箱/治疗之泉/陷阱/装备箱 |
| 战斗反馈 | 伤害飘字/CRIT!/BLOCK/受击闪烁/屏幕震动/Boss狂暴大字警告 |
| 音效 | Web Audio API 合成 11 种音效（无需外部文件） |
| Boss AI | 4 种行为模式：默认概率/暗影领主连续施法/火焰元素阶段切换/亡灵法师召唤 |
| 状态异常 | 灼烧/中毒/冻结/流血，玩家和怪物通用，回合结算 |
| 精英怪 | 15% 概率，4 种词缀（狂暴/剧毒/迅捷/钢铁），金色边框+额外奖励 |
| 地图主题 | 7 种主题（森林/洞穴/遗迹/熔岩/墓地/冰霜/虚空） |
| Build 流派 | 战士/暴击/技能/吸血 4 方向，通过 19 件装备体现 |
| 服务层 | Node.js + Express，API v1（健康检查/配置下发/存档/世界观数据） |
| shared/config | 唯一配置源，前后端共享，server 不 import src/game/* |
| 特殊房间 | 5 种（宝藏室/诅咒之间/祝福祭坛/流浪商人/治愈之泉），rarity 加权生成 |
| NPC | 4 人固定存在（铁匠/商人/猎人/学者），对话含世界观碎片 |
| 随机事件升级 | 6 种选择型事件（祭坛/上锁的门/诅咒宝箱/雕像/流浪商人/遗迹） |
| 世界观碎片 | 28 条文本（world/dungeon/monsters/bosses/items 5 类） |
| Meta 升级 | 4 条升级线（仓库/铁匠铺/药剂店/冒险者大厅），Gold 购买永久保留 |
| worldFlags | 世界状态记忆，事件/房间/NPC 上下文感知 |

### 游戏规则

- **楼梯锁定规则**：进入新层后楼梯初始锁定（红色X）。必须击杀当前层所有怪物（Floor 1:2只, Floor 2:3只, Floor 3:3只）才能解锁（金色>）。Boss层无楼梯。
- **MP 规则**：技能消耗MP（重击5/护盾8/吸血10）。MP不足时技能不可使用，不会消耗回合。MP不能小于0。
- **清层规则**：所有怪物死亡后触发清层奖励。楼层清空后不再刷新怪物。
- **胜利条件**：击败 Floor 12 火焰元素 → VICTORY。
- **状态异常规则**：灼烧(每回合-5HP)/中毒(-3HP)/冻结(50%无法行动)/流血(行动后-4HP)。同类型刷新持续时间，战斗结束后自动清除。
- **精英怪规则**：普通怪物 15% 概率精英化，随机词缀影响 HP/ATK/DEF。经验 1.5x，金币 2x，掉落率 +20%。
- **Boss 小兵规则**：亡灵法师每 3 回合召唤骷髅喽啰（最多 2 只），喽啰不提供经验。玩家攻击 30% 概率打到小兵。
- **特殊房间规则**：非Boss层按 rarity 加权随机生成1个房间（总概率 ~80%），踩上触发效果并显示世界观碎片。
- **Meta升级规则**：营地4条升级线使用永久金币购买，死亡不丢失。冒险者大厅加成在远征开始时应用。
- **存档规则（Phase 11升级）**：优先服务端JSON存档（server/saves/），失败自动回退 localStorage。saveId 为 UUID v4。
- **API 规则**：所有API前缀 /api/v1，禁止服务端战斗结算。

### 重要约束（不要做的事）

- 不要加入多人联机、WebSocket、数据库、登录系统
- 不要引入 Phaser 等大型游戏引擎
- 不要添加动画系统、粒子特效
- 不要破坏现有模块边界
- 不要过度封装、不要复杂设计模式
- **不要做 battle API**（战斗全前端，HTTP延迟 >100ms 破坏手感）
- **server 不 import src/game/***（使用 shared/config 唯一配置源）
- 保持代码新手可读，添加必要注释
- 每个 Phase 完成后更新桌面报告：`C:\Users\Administrator\Desktop\项目现状报告.md`

### Phase 12+ 可扩展方向（预留，不实现）

- **云存档**：需要认证 + 云存储（saveId UUID 体系已就绪）
- **多存档槽**：改变 saveId 即可支持多角色
- **Seed 地牢生成**：floorGenerator 添加 seed 参数
- **每日挑战**：日期 seed + 排行榜
- **装备强化**：equipment 对象添加 enhancement 等级
- **套装系统**：EQUIPMENT_TYPES 添加 setId，在 equipmentManager 中检查
- **更多 Meta 升级**：营地扩建、宠物系统、遗产装备
- **多语言**：shared/config 数据可加 i18n 字段

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.
