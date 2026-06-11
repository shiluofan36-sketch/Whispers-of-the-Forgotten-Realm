# Whispers of the Forgotten Realm

一个单人回合制地牢爬行 RPG 网页游戏。
纯前端项目，使用 React + Vite + TailwindCSS + Canvas。

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

浏览器打开 `http://localhost:5173` 即可开始游戏。

## 游戏操作

| 模式 | 操作 |
|------|------|
| 探索 | WASD / 方向键 移动 |
| 战斗 | 点击按钮（攻击/防御/治疗） |
| 背包 | 数字键 1/2/3 或点击背包道具 |

## 公网测试（ngrok）

在电脑上启动项目后，可以通过 ngrok 生成公网链接，用手机访问游戏。

### 第一步：启动前端

```bash
# 终端1
npm run dev
```

确认终端显示 `Network: http://192.168.x.x:5173/` 表示已监听局域网。

### 第二步：安装 ngrok

如果还没安装 ngrok：

- 访问 [ngrok.com](https://ngrok.com) 注册免费账号
- 下载 ngrok 客户端
- 运行 `ngrok config add-authtoken <你的token>`（仅首次需要）

### 第三步：启动 ngrok 映射

```bash
# 终端2
ngrok http 5173
```

成功后显示：

```
Forwarding  https://xxxxx.ngrok-free.app -> http://localhost:5173
```

### 第四步：手机访问

复制 `https://xxxxx.ngrok-free.app` 这个链接，在手机浏览器打开即可访问游戏。

### 注意事项

- **免费版 ngrok 限制**：每个进程有访问频率限制，多人同时访问可能被限流
- **链接有效期**：免费版 ngrok 链接在进程重启后会变化
- **防火墙**：如果 ngrok 无法连接，检查防火墙是否拦截
- **HTTPS**：浏览器可能要求 HTTPS 才能使用某些功能，ngrok 自带 HTTPS 证书
- **WebSocket**：Vite 的 HMR (热更新) 走 WebSocket，ngrok 默认支持

## 项目结构

```
src/
├── game/           # 游戏引擎（纯逻辑，不依赖 React）
│   ├── constants.js   # 所有配置常量
│   ├── state.js       # 游戏状态创建
│   ├── game.js        # 游戏控制器
│   ├── battle.js      # 战斗系统
│   ├── monsters.js    # 怪物生成
│   ├── player.js      # 玩家移动
│   ├── map.js         # 地图 + 障碍物
│   ├── items.js       # 道具系统
│   ├── inventory.js   # 背包系统
│   ├── renderer.js    # Canvas 渲染
│   └── input.js       # 键盘映射
└── components/     # React UI
    ├── GameCanvas.jsx  # Canvas 组件
    └── GameUI.jsx      # HUD 面板
```

## 技术栈

- React 18
- Vite 6
- TailwindCSS 3
- HTML5 Canvas

## 开发脚本

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务器（监听局域网） |
| `npm run dev:host` | 同上，显式指定 --host |
| `npm run build` | 构建生产版本 |
| `npm run preview` | 预览生产构建 |
