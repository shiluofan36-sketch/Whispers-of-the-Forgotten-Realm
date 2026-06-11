import { getTutorialStepMeta } from '../../game/tutorial/tutorialData';

export default function TutorialOverlay({ state }) {
  const step = state.tutorialStep;
  if (step < 1 || step > 6) return null;

  const meta = getTutorialStepMeta(step);
  if (!meta) return null;

  return (
    <div className="bg-amber-900/80 border-2 border-amber-500 rounded p-3 mb-3 animate-fade-in">
      <div className="flex items-center justify-between mb-1">
        <div className="text-amber-300 font-bold text-xs" style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '8px' }}>
          {meta.title}
        </div>
        <div className="text-amber-500 text-xs" style={{ fontSize: '10px' }}>
          {step}/12
        </div>
      </div>
      <div className="text-amber-200 text-sm leading-relaxed">
        {meta.guidance}
      </div>
    </div>
  );
}
