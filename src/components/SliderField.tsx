import React from 'react';

interface SliderFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

export function SliderField({ label, value, onChange }: SliderFieldProps) {
  const getColor = () => {
    if (value >= 8) return '#00834c'; // Verde Leroy Merlin
    if (value >= 6) return '#ff6900'; // Laranja Leroy Merlin
    if (value >= 4) return '#f59e0b'; // Amber
    return '#9ca3af'; // Gray
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm text-gray-700">{label}</label>
        <span className="text-sm px-2 py-0.5 bg-gray-100 text-gray-700 rounded">
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