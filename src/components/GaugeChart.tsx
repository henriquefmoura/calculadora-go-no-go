import React from 'react';

interface GaugeChartProps {
  value: number;
  max?: number;
}

export function GaugeChart({ value, max = 100 }: GaugeChartProps) {
  const percentage = (value / max) * 100;
  const rotation = (percentage / 100) * 180 - 90;
  
  const getColor = () => {
    if (value >= 70) return '#00834c'; // Green
    if (value >= 50) return '#ff6900'; // Orange
    return '#dc2626'; // Red
  };

  const getLabel = () => {
    if (value >= 70) return 'GO';
    if (value >= 50) return 'GO COM RESSALVAS';
    return 'NO-GO';
  };

  const color = getColor();
  const label = getLabel();

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-48 h-24">
        {/* Background Arc */}
        <svg className="w-full h-full" viewBox="0 0 200 100">
          <path
            d="M 20 90 A 80 80 0 0 1 180 90"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="16"
            strokeLinecap="round"
          />
          {/* Colored Arc */}
          <path
            d="M 20 90 A 80 80 0 0 1 180 90"
            fill="none"
            stroke={color}
            strokeWidth="16"
            strokeLinecap="round"
            strokeDasharray={`${(percentage / 100) * 251.2} 251.2`}
            style={{
              transition: 'stroke-dasharray 1s ease-in-out, stroke 0.3s ease-in-out'
            }}
          />
        </svg>
        
        {/* Center Value */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
          <div 
            className="text-5xl transition-colors duration-300"
            style={{ color }}
          >
            {value}
          </div>
          <div className="text-xs text-gray-500 mt-1">de {max}</div>
        </div>

        {/* Needle */}
        <div className="absolute bottom-0 left-1/2 w-1 h-20 origin-bottom" style={{ transform: `translateX(-50%) rotate(${rotation}deg)`, transition: 'transform 1s ease-in-out' }}>
          <div className="w-full h-full bg-gray-700 rounded-full"></div>
          <div className="absolute bottom-0 left-1/2 w-3 h-3 bg-gray-800 rounded-full transform -translate-x-1/2"></div>
        </div>
      </div>

      {/* Label */}
      <div 
        className="mt-4 px-6 py-2 rounded-full text-sm font-medium transition-colors duration-300"
        style={{ 
          backgroundColor: `${color}15`,
          color: color,
          border: `2px solid ${color}`
        }}
      >
        {label}
      </div>
    </div>
  );
}
