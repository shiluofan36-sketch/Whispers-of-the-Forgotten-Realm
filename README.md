# Whispers of the Forgotten Realm

一个单人回合制地牢爬行 RPG 网页游戏，支持用户系统、存档同步和管理后台。

## 快速开始

```bash
# 安装依赖
npm install

# 启动前端开发服务器
npm run dev

# 启动后端服务（需要 MySQL）
node server/index.js
```

前端：`http://localhost:5173`
后端 API：`http://localhost:3001/api/v1`

## 游戏操作

| 模式 | 操作 |
|------|------|
| 探索 | WASD / 方向键 移动 |
| 战斗 | 点击按钮（攻击/防御/治疗）或 Q/E/R 使用技能 |
| 背包 | 数字键 1/2/3 或点击背包道具 |
| 技能 | Q（重击）/ E（护盾）/ R（吸血） |

## 核心功能

### 游戏系统

- **12层地牢**：森林/洞穴/遗迹/熔岩/墓地/冰霜/虚空 7种生物群落主题
- **回合制战斗**：攻击/防御/治疗 + 3个主动技能，暴击/闪避/三层减伤机制
- **怪物系统**：5种普通怪物 + 15%概率精英化（4种词缀），难度随楼层缩放
- **Boss 系统**：7种 Boss，4种 AI 行为模式（默认/施法者/阶段切换/召唤师）
- **装备系统**：3槽位（武器/防具/饰品），16种属性维度，4种品质，装备切换
- **Build 流派**：7种流派（火/冰/毒/吸血/暴击/坦/狂战）+ 7种协同组合
- **遗物系统**：9种遗物，每局随机，临时增益
- **状态异常**：灼烧/中毒/冻结/流血，玩家和怪物通用
- **Meta 永久升级**：4条升级线（仓库/铁匠铺/药剂店/冒险者大厅），金币购买
- **NPC 对话**：4个营地 NPC，上下文感知对话（根据玩家进度变化）
- **特殊房间**：5种房间类型，rarity 加权生成
- **随机事件**：10种事件（4自动 + 6选择型）
- **成就系统**：12个成就，事件驱动自动检查
- **教程系统**：12步渐进式引导
- **战争迷雾**：生物群落专属光源 + 欧氏距离视野 + 已探索区域半透明

### 用户系统

- JWT 无状态认证（bcrypt 密码加密）
- 注册 / 登录 / 昵称设置
- 角色封禁（含原因记录）
- 管理员后台：玩家管理 / 背包操控 / 建议查看 / 登录日志

### 存档

- localStorage 本地存档 + MySQL 服务端同步
- 7种自动存档触发时机

## 技术栈

| 层 | 技术 |
|---|---|
| 前端框架 | React 18 |
| 构建工具 | Vite 6 |
| 样式 | TailwindCSS 3 |
| 渲染引擎 | HTML5 Canvas 2D API |
| 后端框架 | Express.js |
| 数据库 | MySQL（mysql2/promise） |
| 认证 | JWT + bcryptjs |
| 音效 | Web Audio API（纯代码合成，无外部文件） |

## 项目结构

```
src/
├── game/                   # 游戏引擎（纯 JS，零 React 依赖）
│   ├── battle/             # 战斗系统（引擎/AI/伤害/奖励）
│   ├── boss/               # Boss AI + 技能 + 召唤
│   ├── dungeon/            # 楼层生成/管理/难度缩放
│   ├── equipment/          # 装备管理 + 词缀 + 掉落
│   ├── renderer/           # Canvas 渲染（地图/实体/迷雾/光源/粒子）
│   ├── relics/             # 遗物系统
│   ├── build/              # Build 流派分析
│   ├── camp/               # 营地 + 商店
│   ├── meta/               # Meta 永久升级
│   ├── events/             # 随机事件
│   ├── rooms/              # 特殊房间
│   ├── npc/                # NPC 对话
│   ├── tutorial/           # 教程系统
│   ├── save/               # 存档系统
│   └── state.js            # 单一游戏状态对象
├── components/             # React UI 组件
│   ├── panels/             # 12个游戏面板
│   └── shared/             # 共享 UI 组件
├── services/               # API 客户端服务
└── App.jsx                 # 根组件 + 状态桥接
server/                     # Express 后端
├── routes/                 # API 路由（认证/存档/配置/管理）
├── controllers/            # 请求处理
├── db/                     # MySQL 连接 + 数据表
├── middleware/             # JWT 认证 + 管理员鉴权
└── index.js                # 服务入口
shared/config/              # 前后端共享配置（14个模块）
```

## 开发脚本

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动前端开发服务器 |
| `npm run dev:host` | 同上，监听局域网 |
| `npm run build` | 构建生产版本 |
| `npm run preview` | 预览生产构建 |
| `node server/index.js` | 启动后端 API 服务 |

## 环境变量

后端可通过环境变量覆盖默认配置：

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `PORT` | `3001` | 后端端口 |
| `JWT_SECRET` | `rpg_game_secret_key_2024` | JWT 密钥 |
| `DB_HOST` | `127.0.0.1` | MySQL 地址 |
| `DB_PORT` | `3306` | MySQL 端口 |
| `DB_USER` | `root` | MySQL 用户名 |
| `DB_PASSWORD` | `123456` | MySQL 密码 |
| `DB_NAME` | `rpg_game` | 数据库名 |
| `CORS_ORIGIN` | `*` | 跨域来源 |
