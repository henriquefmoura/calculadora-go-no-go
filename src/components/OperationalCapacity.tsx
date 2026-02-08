import React from 'react';
import { Settings } from 'lucide-react';
import { SliderField } from './SliderField';

interface OperationalCapacityProps {
  scores: {
    execution: number;
    partners: number;
    sla: number;
    complexity: number;
    scalability: number;
  };
  onChange: (scores: any) => void;
}

export function OperationalCapacity({ scores, onChange }: OperationalCapacityProps) {
  const updateScore = (field: string, value: number) => {
    onChange({ ...scores, [field]: value });
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Settings className="size-5 text-[#ff6900]" />
          <h2 className="text-lg text-gray-900">Capacidade Operacional</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Peso no Score:</span>
          <span className="px-2.5 py-1 bg-[#ff6900]/10 text-[#ff6900] text-sm rounded border border-[#ff6900]/20 font-medium">
            25%
          </span>
        </div>
      </div>

      <div className="space-y-5">
        <SliderField
          label="Capacidade de Execução (instalação/reforma)"
          value={scores.execution}
          onChange={(value) => updateScore('execution', value)}
        />
        <SliderField
          label="Disponibilidade de Parceiros Técnicos"
          value={scores.partners}
          onChange={(value) => updateScore('partners', value)}
        />
        <SliderField
          label="SLA Esperado"
          value={scores.sla}
          onChange={(value) => updateScore('sla', value)}
        />
        <SliderField
          label="Complexidade Técnica do Projeto"
          value={scores.complexity}
          onChange={(value) => updateScore('complexity', value)}
        />
        <SliderField
          label="Escalabilidade da Operação"
          value={scores.scalability}
          onChange={(value) => updateScore('scalability', value)}
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