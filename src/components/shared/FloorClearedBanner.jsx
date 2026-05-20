import { useState, useEffect } from 'react';

export default function FloorClearedBanner({ floor }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 2500);
    return () => clearTimeout(timer);
  }, [floor]);

  if (!visible) return null;

  return (
    <div className="bg-yellow-900/80 rounded p-3 border-2 border-yellow-500 text-center animate-pulse">
      <div className="text-yellow-400 font-bold text-sm">FLOOR CLEARED!</div>
      <div className="text-yellow-300 text-xs mt-0.5">Floor {floor} Complete</div>
    </div>
  );
}
