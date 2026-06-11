import { useState } from 'react';

export default function NicknameModal({ onSubmit }) {
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!nickname.trim()) {
      setError('昵称不能为空');
      return;
    }
    if (nickname.trim().length > 12) {
      setError('昵称最多 12 个字符');
      return;
    }
    try {
      await onSubmit(nickname.trim());
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-amber-600 rounded-lg p-8 w-96">
        <h2 className="text-amber-400 text-center mb-4" style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '12px' }}>
          首次登录
        </h2>
        <p className="text-gray-400 text-sm text-center mb-4">欢迎！请为自己取一个冒险者名字</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="输入你的名字"
            maxLength={12}
            value={nickname}
            onChange={e => { setNickname(e.target.value); setError(''); }}
            autoFocus
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 text-gray-200 rounded text-sm focus:outline-none focus:border-amber-500 text-center"
          />
          {error && <p className="text-red-400 text-xs text-center">{error}</p>}
          <button
            type="submit"
            disabled={!nickname.trim()}
            className="w-full py-2 bg-amber-600 hover:bg-amber-500 disabled:bg-gray-700 text-white rounded text-sm font-bold transition"
          >
            确认
          </button>
        </form>
      </div>
    </div>
  );
}
