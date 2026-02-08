import React from 'react';

interface FinancialSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  prefix?: string;
  suffix?: string;
  formatValue?: (value: number) => string;
}

export function FinancialSlider({ 
  label, 
  value, 
  onChange, 
  min, 
  max, 
  step,
  prefix = '',
  suffix = '',
  formatValue
}: FinancialSliderProps) {
  const getColor = () => {
    const percentage = ((value - min) / (max - min)) * 100;
    if (percentage >= 70) return '#00834c'; // Verde Leroy Merlin
    if (percentage >= 50) return '#ff6900'; // Laranja Leroy Merlin
    if (percentage >= 30) return '#f59e0b'; // Amber
    return '#9ca3af'; // Gray
  };

  const displayValue = formatValue ? formatValue(value) : value.toString();
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm text-gray-700">{label}</label>
        <span className="text-sm px-2.5 py-1 bg-gray-100 text-gray-900 rounded font-medium">
          {prefix}{displayValue}{suffix}
        </span>
      </div>
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, ${getColor()} 0%, ${getColor()} ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`
          }}
        />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-xs text-gray-500">{prefix}{min}{suffix}</span>
        <span className="text-xs text-gray-500">{prefix}{max.toLocaleString('pt-BR')}{suffix}</span>
      </div>
    </div>
  );
}
