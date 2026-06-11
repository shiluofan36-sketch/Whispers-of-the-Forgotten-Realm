export default function StartScreen({ nickname, onStart }) {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-950">
      <div className="text-center space-y-10">
        <div>
          <h1 className="text-amber-400 mb-3 leading-relaxed" style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '12px' }}>
            Whispers of<br/>the Forgotten Realm
          </h1>
          <p className="text-gray-500 text-sm">— 地牢爬行 RPG —</p>
        </div>

        <div className="text-gray-400 text-sm space-y-2">
          <p>欢迎回来，<span className="text-amber-400">{nickname}</span></p>
        </div>

        <button
          onClick={onStart}
          className="px-12 py-4 bg-amber-600 hover:bg-amber-500 text-white rounded text-lg font-bold transition cursor-pointer animate-pulse"
          style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '14px' }}
        >
          开始游戏
        </button>

        <p className="text-gray-600 text-xs mt-8">
          WASD 移动 · 数字键使用道具 · Q/E/R 技能
        </p>
      </div>
    </div>
  );
}
