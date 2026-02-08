import React from 'react';
import { TrendingUp, AlertTriangle } from 'lucide-react';

interface SmartSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  type?: 'opportunity' | 'risk';
  tooltip?: string;
}

export function SmartSlider({ label, value, onChange, type = 'opportunity', tooltip }: SmartSliderProps) {
  const getState = () => {
    if (type === 'opportunity') {
      if (value >= 7) return { color: 'emerald', icon: TrendingUp, label: 'Oportunidade' };
      if (value >= 4) return { color: 'gray', icon: null, label: 'Neutro' };
      return { color: 'amber', icon: AlertTriangle, label: 'Atenção' };
    } else {
      // Risk type - inverted
      if (value >= 7) return { color: 'red', icon: AlertTriangle, label: 'Alto Risco' };
      if (value >= 4) return { color: 'amber', icon: AlertTriangle, label: 'Risco Moderado' };
      return { color: 'emerald', icon: TrendingUp, label: 'Baixo Risco' };
    }
  };

  const state = getState();
  const StateIcon = state.icon;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs text-gray-700">{label}</label>
        <div className="flex items-center gap-2">
          {StateIcon && (
            <StateIcon 
              className={`
                size-3.5
                ${state.color === 'emerald' ? 'text-emerald-600' : ''}
                ${state.color === 'amber' ? 'text-amber-600' : ''}
                ${state.color === 'red' ? 'text-red-600' : ''}
              `}
            />
          )}
          <span 
            className={`
              text-xs px-2 py-0.5 rounded
              ${state.color === 'emerald' ? 'bg-emerald-50 text-emerald-700' : ''}
              ${state.color === 'amber' ? 'bg-amber-50 text-amber-700' : ''}
              ${state.color === 'red' ? 'bg-red-50 text-red-700' : ''}
              ${state.color === 'gray' ? 'bg-gray-100 text-gray-700' : ''}
            `}
          >
            {value}
          </span>
        </div>
      </div>
      <div className="relative">
        <input
          type="range"
          min="0"
          max="10"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className={`
            slider w-full h-2 rounded-lg appearance-none cursor-pointer
            ${state.color === 'emerald' ? 'slider-green' : ''}
            ${state.color === 'amber' ? 'slider-amber' : ''}
            ${state.color === 'red' ? 'slider-red' : ''}
            ${state.color === 'gray' ? 'slider-gray' : ''}
          `}
        />
      </div>
      <div className="flex justify-between mt-1 text-xs text-gray-500">
        <span>{type === 'opportunity' ? 'Baixo' : 'Baixo'}</span>
        <span className={`
          text-xs
          ${state.color === 'emerald' ? 'text-emerald-600' : ''}
          ${state.color === 'amber' ? 'text-amber-600' : ''}
          ${state.color === 'red' ? 'text-red-600' : ''}
        `}>
          {state.label}
        </span>
        <span>{type === 'opportunity' ? 'Alto' : 'Alto'}</span>
      </div>
    </div>
  );
}
