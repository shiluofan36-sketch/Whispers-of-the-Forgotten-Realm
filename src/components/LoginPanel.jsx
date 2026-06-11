import { useState } from 'react';

export default function LoginPanel({ onLogin }) {
  const [mode, setMode] = useState('login'); // login | register
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await onLogin(mode, username, password);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-950">
      <div className="bg-gray-900 border border-gray-700 rounded-lg px-10 py-10 w-[440px]">
        <h1 className="text-amber-400 text-center mb-2 leading-relaxed" style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '11px' }}>
          Whispers of<br/>the Forgotten Realm
        </h1>
        <p className="text-gray-600 text-center text-xs mb-8">— 地牢爬行 RPG —</p>

        <div className="flex mb-6">
          <button
            onClick={() => { setMode('login'); setError(''); }}
            className={`flex-1 py-2 text-sm transition ${mode === 'login' ? 'text-amber-400 border-b-2 border-amber-400' : 'text-gray-500 border-b border-gray-700'}`}
          >登录</button>
          <button
            onClick={() => { setMode('register'); setError(''); }}
            className={`flex-1 py-2 text-sm transition ${mode === 'register' ? 'text-amber-400 border-b-2 border-amber-400' : 'text-gray-500 border-b border-gray-700'}`}
          >注册</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="用户名"
            maxLength={20}
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 text-gray-200 rounded text-sm focus:outline-none focus:border-amber-500"
          />
          <input
            type="password"
            placeholder="密码"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 text-gray-200 rounded text-sm focus:outline-none focus:border-amber-500"
          />
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <button
            type="submit"
            disabled={loading || !username || !password}
            className="w-full py-2 bg-amber-600 hover:bg-amber-500 disabled:bg-gray-700 text-white rounded text-sm font-bold transition"
          >
            {loading ? '请稍候...' : mode === 'login' ? '登 录' : '注 册'}
          </button>
        </form>
      </div>
    </div>
  );
}
