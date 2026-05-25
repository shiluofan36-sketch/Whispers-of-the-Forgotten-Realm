import { getAchievementList } from '../../game/achievements/achievementManager';

export default function AchievementPanel({ state, onBack }) {
  const achievements = getAchievementList(state);
  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="text-green-400 font-bold font-pixel">
          ACHIEVEMENTS ({unlockedCount}/{achievements.length})
        </div>
        <button onClick={onBack} className="text-gray-400 hover:text-white text-xs">← 返回</button>
      </div>

      <div className="space-y-1">
        {achievements.map(a => (
          <div
            key={a.id}
            className={`rounded p-2 border text-xs ${
              a.unlocked
                ? 'bg-gray-700 border-yellow-700 text-yellow-300'
                : 'bg-gray-800 border-gray-700 text-gray-500'
            }`}
          >
            <div className="flex justify-between">
              <span className={a.unlocked ? 'font-bold' : ''}>{a.name}</span>
              <span>{a.unlocked ? '✓' : '?'}</span>
            </div>
            <div className="text-xs mt-0.5">{a.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
