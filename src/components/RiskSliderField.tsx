import React from 'react';

interface RiskSliderFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

export function RiskSliderField({ label, value, onChange }: RiskSliderFieldProps) {
  const getColor = () => {
    if (value >= 8) return '#dc2626'; // red-600
    if (value >= 6) return '#f59e0b'; // amber-500
    if (value >= 4) return '#eab308'; // yellow-500
    return '#059669'; // emerald-600
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm text-gray-700">{label}</label>
        <span 
          className="text-sm px-2 py-0.5 rounded"
          style={{
            backgroundColor: value >= 7 ? '#fee2e2' : value >= 5 ? '#fef3c7' : '#d1fae5',
            color: value >= 7 ? '#991b1b' : value >= 5 ? '#92400e' : '#065f46'
          }}
        >
          {value}
        </span>
      </div>
      <div className="relative">
        <input
          type="range"
          min="0"
          max="10"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, ${getColor()} 0%, ${getColor()} ${value * 10}%, #e5e7eb ${value * 10}%, #e5e7eb 100%)`
          }}
        />
      </div>
    </div>
  );
}
