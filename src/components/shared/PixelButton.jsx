import React from 'react';

const sizeClasses = {
  sm: 'px-3 py-1 text-xs',
  md: 'px-4 py-1.5 text-sm',
  lg: 'px-5 py-2 text-base',
};

const colorMap = {
  red:    'bg-red-700 border-red-500 hover:bg-red-600 active:bg-red-800 text-white',
  green:  'bg-green-700 border-green-500 hover:bg-green-600 active:bg-green-800 text-white',
  blue:   'bg-blue-700 border-blue-500 hover:bg-blue-600 active:bg-blue-800 text-white',
  yellow: 'bg-yellow-700 border-yellow-500 hover:bg-yellow-600 active:bg-yellow-800 text-white',
  purple: 'bg-purple-700 border-purple-500 hover:bg-purple-600 active:bg-purple-800 text-white',
  orange: 'bg-orange-700 border-orange-500 hover:bg-orange-600 active:bg-orange-800 text-white',
  gray:   'bg-gray-700 border-gray-600 hover:bg-gray-600 active:bg-gray-800 text-gray-200',
  pink:   'bg-pink-700 border-pink-500 hover:bg-pink-600 active:bg-pink-800 text-white',
};

export default function PixelButton({ color = 'gray', size = 'md', disabled, className = '', onClick, children }) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`
        pixel-btn font-bold rounded
        ${sizeClasses[size] || sizeClasses.md}
        ${disabled
          ? 'bg-gray-800 border-gray-700 text-gray-500 cursor-not-allowed'
          : colorMap[color] || colorMap.gray
        }
        ${className}
      `}
    >
      {children}
    </button>
  );
}
