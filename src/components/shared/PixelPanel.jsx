import React from 'react';

const accentBorderMap = {
  red:       'border-red-500',
  green:     'border-green-500',
  blue:      'border-blue-500',
  yellow:    'border-yellow-500',
  purple:    'border-purple-500',
  orange:    'border-orange-500',
  gray:      'border-gray-600',
};

export default function PixelPanel({ accentColor, className = '', children }) {
  const borderClass = accentColor
    ? (accentBorderMap[accentColor] || 'border-gray-600')
    : 'border-gray-700';

  return (
    <div className={`
      bg-gray-900 pixel-border rounded
      ${borderClass}
      ${className}
    `}>
      {children}
    </div>
  );
}
