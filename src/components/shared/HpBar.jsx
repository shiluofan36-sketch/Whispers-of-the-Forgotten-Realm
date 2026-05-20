export default function HpBar({ label, current, max, color }) {
  const pct = Math.max(0, (current / max) * 100);
  const barColor = color === 'green' ? 'bg-green-500' : 'bg-red-500';

  return (
    <div>
      <div className="text-gray-400 mb-1 text-xs">{label}</div>
      <div className="w-full bg-gray-700 rounded h-5 overflow-hidden">
        <div className={`h-full ${barColor} transition-all duration-200`} style={{ width: `${pct}%` }} />
      </div>
      <div className="text-right text-xs text-gray-400 mt-0.5">{current} / {max}</div>
    </div>
  );
}
