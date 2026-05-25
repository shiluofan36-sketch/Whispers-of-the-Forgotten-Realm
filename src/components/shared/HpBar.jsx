export default function HpBar({ label, current, max, color }) {
  const pct = Math.max(0, (current / max) * 100);
  const barColor = color === 'green' ? 'bg-green-600' : 'bg-red-600';

  return (
    <div>
      <div className="text-gray-400 mb-1 text-xs font-pixel">{label}</div>
      <div className="w-full bg-gray-800 pixel-border border-gray-700 h-5 overflow-hidden">
        <div
          className={`h-full ${barColor} transition-all duration-200`}
          style={{ width: `${pct}%`, imageRendering: 'pixelated' }}
        >
          {/* 分段线 */}
          {Array.from({ length: Math.floor(max / 20) }, (_, i) => (
            <div key={i} className="float-right h-full w-px bg-gray-900/30" style={{ marginRight: `${(20/max)*100}%` }} />
          ))}
        </div>
      </div>
      <div className="text-right text-xs text-gray-400 mt-0.5">{current} / {max}</div>
    </div>
  );
}
