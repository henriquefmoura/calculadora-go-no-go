import React from 'react';
import { Target } from 'lucide-react';
import { SmartSlider } from './SmartSlider';

interface StrategySynergyProps {
  scores: {
    adherence: number;
    synergy: number;
    recurrence: number;
    crossSell: number;
  };
  onChange: (scores: any) => void;
}

export function StrategySynergy({ scores, onChange }: StrategySynergyProps) {
  const updateScore = (field: string, value: number) => {
    onChange({ ...scores, [field]: value });
  };

  return (
    <div className="glass-card rounded-lg shadow-md border border-white/20 p-6 backdrop-blur-md">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Target className="size-5 text-[#00834c]" />
          <h2 className="text-lg text-gray-900">Estratégia e Sinergia</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Peso no Score:</span>
          <span className="px-2.5 py-1 bg-[#00834c]/10 text-[#00834c] text-sm rounded border border-[#00834c]/20 font-medium">
            15%
          </span>
        </div>
      </div>

      <div className="space-y-5">
        <SmartSlider
          label="Aderência à Estratégia da Companhia"
          value={scores.adherence}
          onChange={(value) => updateScore('adherence', value)}
          type="opportunity"
        />
        <SmartSlider
          label="Sinergia com Serviços (Instala / Reformas)"
          value={scores.synergy}
          onChange={(value) => updateScore('synergy', value)}
          type="opportunity"
        />
        <SmartSlider
          label="Potencial de Recorrência"
          value={scores.recurrence}
          onChange={(value) => updateScore('recurrence', value)}
          type="opportunity"
        />
        <SmartSlider
          label="Potencial de Cross-sell"
          value={scores.crossSell}
          onChange={(value) => updateScore('crossSell', value)}
          type="opportunity"
        />
      </div>

      <div className="mt-5 pt-4 border-t border-gray-200">
        <div className="flex justify-between text-xs text-gray-500">
          <span>0 = Muito desfavorável</span>
          <span>10 = Muito favorável</span>
        </div>
      </div>
    </div>
  );
}