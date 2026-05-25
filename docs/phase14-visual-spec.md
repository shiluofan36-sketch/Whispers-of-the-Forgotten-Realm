# Phase 14 视觉规范文档

## 一、整体视觉方向

**暗黑像素风 RPG** — Dark Fantasy + Pixel Art + Roguelike + Dungeon Crawler

视觉参考：Darkest Dungeon / Slay the Spire / Loop Hero / The Binding of Isaac

## 二、渲染层序（从上到下）

```
1. 背景填充（纯色）
2. 瓦片地板（tileRenderer）
3. 网格线覆盖（半透明）
4. 障碍物（像素瓦片）
5. 特殊房间（半透明+符号）
6. 楼梯（像素瓦片）
7. 氛围叠加（atmosphereRenderer）
8. 实体（精灵精灵系统）
   ├── Boss小兵
   ├── 怪物/Boss
   └── 玩家
9. 技能特效（slash/projectile/pulse/flash）
10. 粒子系统（particleSystem）
11. 屏幕抖动
12. 战斗边框
13. 浮动文字
14. 装备掉落卡片
15. 状态图标
```

## 三、统一稀有度颜色

| 品质 | Hex | Tailwind类 | 发光色 |
|------|-----|-----------|--------|
| 普通 | #9CA3AF | text-rarity-common | 无 |
| 稀有 | #3B82F6 | text-rarity-rare | #3B82F6 |
| 史诗 | #A855F7 | text-rarity-epic | #A855F7 |
| 传说 | #F59E0B | text-rarity-legendary | #F59E0B |

**单一配置源**：`shared/config/render.js` → `RARITY_COLORS` / `RARITY_GLOW`

## 四、精灵系统

### 分辨率
- 普通精灵：32×32 像素
- Boss精灵：64×64 像素

### 动画类型（所有实体通用）

| 动画 | 帧数 | 帧时长 | 对应animState.type |
|------|------|--------|-------------------|
| idle | 4帧 | 500ms | idle |
| attack | 4帧 | 80ms | lunge |
| hurt | 2帧 | 70ms | hitReact |
| death | 4帧 | 60ms | death |
| enrage | 4帧 | 150ms | enrage |

### 实体类型覆盖

**玩家**：暗色盔甲骑士（蓝灰/金属/盾牌/剑）

**普通怪物（32×32）**：
- GOBLIN — 绿皮小矮人
- SKELETON — 白骨士兵
- SLIME — 绿色软泥
- SHADOW — 紫色暗影
- GIANT_RAT — 棕毛巨鼠
- cultist — 紫袍邪教徒
- wolf — 灰黑野狼

**Boss（64×64）**：
- ANCIENT_DRAGON — 红龙+翅膀
- DEMON_LORD — 紫角恶魔+巨剑
- SHADOW_LORD — 紫暗斗篷+皇冠
- FIRE_ELEMENTAL — 橙红火焰体
- NECROMANCER — 绿袍骷髅法师+法杖

### 架构
- `spriteGenerator.js` — Canvas 2D 整数坐标绘制到离屏Canvas
- `spriteManager.js` — Map缓存 + 帧查找
- `animationFrameController.js` — animState.type → 帧索引映射
- `entityRenderer.js` — 读取精灵帧，drawImage 渲染

### 回退策略
无精灵数据的实体自动回退到原始纯色矩形+文字标签渲染

## 五、瓦片系统

### 源分辨率
8×8 像素数据 → 放大6倍到48×48（CELL_SIZE）

### 瓦片类型
dungeon / grass / stone / wall / lava / cracked

### 生物群落调色板（7种）

| 生物群落 | 地板基色 | 氛围效果 |
|---------|---------|---------|
| forest | 深绿 | 绿色雾气 + 雾团 |
| cave | 深蓝灰 | 灰尘粒子 + 暗角 |
| ruins | 深棕 | 火把闪烁 + 暖光 |
| lava | 深红黑 | 底部熔岩发光 |
| graveyard | 深灰黑 | 蓝紫鬼火 |
| ice | 冰蓝 | 飘雪粒子 |
| void | 深紫黑 | 紫光飘忽 |

### Boss房间特殊氛围
红色环境光 + 暗角加深

## 六、粒子系统

### 粒子类型

| 类型 | 触发事件 | 颜色 | 数量/次 |
|------|---------|------|---------|
| crit | 暴击命中 | 橙/金 | 8 |
| poison | 中毒tick | 绿 | 6 |
| ice | 冻结tick | 蓝/白 | 7 |
| enrage | Boss狂暴 | 红/橙 | 15 |
| loot | 装备掉落 | 金/白 | 10 |
| heal | 治疗 | 绿/白 | 6 |

### 架构
- 预分配200粒子对象池（零GC）
- `particleEmitter.js` — 发射+更新
- `particleSystem.js` — 统一管理

### 性能
- 粒子数上限：200
- 典型活跃数：~30
- 每粒子：1次 fillRect/arc 调用
- 零帧内内存分配

## 七、UI风格系统

### 字体
- **标题像素字体**：Press Start 2P（Google Fonts CDN）
- **正文等宽字体**：Courier New（系统）
- **CSS工具类**：`.font-pixel` / `.font-mono`

### 像素边框
- `.pixel-border` — 2px实线边框 + 2px阴影偏移
- `.pixel-btn` — 4px底部/右侧边框模拟按下深度
- 按下时底部/右侧缩至2px + translate(2px,2px)

### 稀有度发光
- `.rarity-glow-common` — 4px 灰色
- `.rarity-glow-rare` — 6px 蓝色
- `.rarity-glow-epic` — 8px 紫色
- `.rarity-glow-legendary` — 10px 金色

### 共享组件
- `PixelButton.jsx` — 像素风按钮（8色×3尺寸）
- `PixelPanel.jsx` — 像素风面板（7色边框）
- `HpBar.jsx` — 分段像素血条
- `MpBar.jsx` — 像素蓝条

## 八、性能指标

### 内存
- 瓦片缓存：~49个×48×48 ≈ 440KB
- 精灵缓存：~270个×32×32 ≈ 1MB
- Boss精灵：~20个×64×64 ≈ 320KB
- 图标缓存：~36个×16×16 ≈ 36KB
- 粒子池：200对象 ≈ 10KB
- **合计**：~2MB（初始化一次，永久缓存）

### 帧渲染（约150次drawImage/fillRect）
- 100次 tile drawImage
- 5次 sprite drawImage
- 30次 particle fillRect
- 15次 atmosphere fillRect/arc

### 增量时间
- updateEffects 调用上限 dt≤0.1s（10fps下限保护）

## 九、后续扩展方向

### 精灵系统
- 更多帧动画（跑步/施法/闲置细节）
- 换装系统（不同装备显示不同外观）
- NPC精灵（铁匠/商人/猎人/学者）

### 瓦片系统
- 动画瓦片（流水/火焰/闪烁水晶）
- 破坏性地板（裂痕→完全碎裂）
- 昼夜切换（全局亮度调整）

### 粒子系统
- 技能组合特效（元素反应）
- 环境粒子（持续雨/雪/落叶）
- 高级粒子行为（引力/碰撞/拖尾）

### 装备图标
- 更多装备类型图标
- 套装特效图标
- 动态稀有度边框动画

### 氛围系统
- 天气系统（雨/雪/雾/沙尘暴）
- 昼夜循环（随时间变化）
- BGM视觉可视化

### UI系统
- 全像素字体覆盖（替换所有Courier New）
- 像素风图标字体
- 动画面板切换（翻页/溶解）
