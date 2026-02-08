import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { SmartSlider } from './SmartSlider';

interface RiskAssessmentProps {
  scores: {
    legal: number;
    default: number;
    reputational: number;
    operational: number;
    litigationPercentage: number;
  };
  onChange: (scores: any) => void;
}

export function RiskAssessment({ scores, onChange }: RiskAssessmentProps) {
  const updateScore = (field: string, value: number) => {
    onChange({ ...scores, [field]: value });
  };

  return (
    <div className="glass-card rounded-lg shadow-md border border-white/20 p-6 backdrop-blur-md">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <AlertTriangle className="size-5 text-amber-600" />
          <h2 className="text-lg text-gray-900">Riscos</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Peso no Score:</span>
          <span className="px-2.5 py-1 bg-amber-50 text-amber-700 text-sm rounded border border-amber-200 font-medium">
            20%
          </span>
        </div>
      </div>

      <div className="space-y-5">
        <SmartSlider
          label="Risco Jurídico"
          value={scores.legal}
          onChange={(value) => updateScore('legal', value)}
          type="risk"
        />
        <SmartSlider
          label="Risco de Inadimplência"
          value={scores.default}
          onChange={(value) => updateScore('default', value)}
          type="risk"
        />
        <SmartSlider
          label="Risco Reputacional"
          value={scores.reputational}
          onChange={(value) => updateScore('reputational', value)}
          type="risk"
        />
        <SmartSlider
          label="Risco Operacional"
          value={scores.operational}
          onChange={(value) => updateScore('operational', value)}
          type="risk"
        />
      </div>

      {/* Campo de % de Litígio */}
      <div className="mt-6 pt-5 border-t border-gray-200">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Percentual de Litígio sobre Margem (%)
              </label>
              <p className="text-xs text-gray-600">
                Percentual estimado da margem que pode ser comprometido por litígios, processos judiciais ou contingências legais
              </p>
            </div>
            <div className="w-32">
              <input
                type="number"
                value={scores.litigationPercentage || 0}
                onChange={(e) => updateScore('litigationPercentage', Number(e.target.value))}
                min="0"
                max="100"
                step="0.5"
                className="w-full px-3 py-2 border border-red-300 rounded-lg text-sm text-right focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
          </div>
          
          {scores.litigationPercentage > 0 && (
            <div className="bg-white border border-red-200 rounded p-3">
              <div className="text-xs text-red-900 font-medium mb-1">
                Impacto na Margem Final:
              </div>
              <div className="text-xs text-gray-700">
                Este percentual será deduzido da margem final no cálculo da decisão Go/No-Go, 
                refletindo o risco financeiro de litígios no resultado do projeto.
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-gray-200">
        <div className="flex justify-between text-xs text-gray-500">
          <span>0 = Risco muito baixo</span>
          <span>10 = Risco muito alto</span>
        </div>
      </div>
    </div>
  );
}