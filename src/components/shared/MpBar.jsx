export default function MpBar({ current, max }) {
  const pct = Math.max(0, (current / max) * 100);

  return (
    <div>
      <div className="w-full bg-gray-800 pixel-border border-gray-700 h-3 overflow-hidden mt-1">
        <div className="h-full bg-blue-600 transition-all duration-200" style={{ width: `${pct}%` }} />
      </div>
      <div className="text-right text-xs text-gray-500 mt-0.5">MP: {current} / {max}</div>
    </div>
  );
}
