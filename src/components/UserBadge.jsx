import { useState, useRef, useEffect } from 'react';

export default function UserBadge({ nickname, onLogout, onSuggestion }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={ref} className="absolute top-2 left-2 z-40">
      <button
        onClick={() => setOpen(!open)}
        className="bg-gray-900/90 border border-gray-600 rounded px-3 py-1.5 text-amber-400 text-sm hover:border-amber-500 transition cursor-pointer"
        style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '10px' }}
      >
        {nickname}
      </button>

      {open && (
        <div className="mt-1 bg-gray-900 border border-gray-600 rounded shadow-lg overflow-hidden">
          <button
            onClick={() => { setOpen(false); onSuggestion(); }}
            className="w-full text-left px-4 py-2 text-gray-300 text-sm hover:bg-gray-800 transition cursor-pointer"
          >意见箱</button>
          <button
            onClick={() => { setOpen(false); onLogout(); }}
            className="w-full text-left px-4 py-2 text-red-400 text-sm hover:bg-gray-800 transition cursor-pointer border-t border-gray-700"
          >退出登录</button>
        </div>
      )}
    </div>
  );
}
