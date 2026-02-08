import React from 'react';
import { TrendingUp } from 'lucide-react';
import { FinancialSlider } from './FinancialSlider';
import { InfoTooltip } from './InfoTooltip';

interface FinancialViabilityProps {
  scores: {
    margin: number;
    ticket: number;
    ltv: number;
    payback: number;
    cac: number;
  };
  onChange: (scores: any) => void;
}

export function FinancialViability({ scores, onChange }: FinancialViabilityProps) {
  const updateScore = (field: string, value: number) => {
    onChange({ ...scores, [field]: value });
  };

  return (
    <div className="glass-card rounded-lg shadow-md border border-white/20 p-6 backdrop-blur-md">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <TrendingUp className="size-5 text-[#00834c]" />
          <h2 className="text-lg text-gray-900">Viabilidade Financeira</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Peso no Score:</span>
          <span className="px-2.5 py-1 bg-[#00834c]/10 text-[#00834c] text-sm rounded border border-[#00834c]/20 font-medium">
            25%
          </span>
        </div>
      </div>

      <div className="space-y-5">
        <FinancialSlider
          label="Margem Estimada"
          value={scores.margin}
          onChange={(value) => updateScore('margin', value)}
          min={0}
          max={15}
          step={0.5}
          suffix="%"
        />
        <div className="flex items-center gap-1">
          <FinancialSlider
            label="Ticket Médio de Serviços"
            value={scores.ticket}
            onChange={(value) => updateScore('ticket', value)}
            min={2000}
            max={40000}
            step={1000}
            prefix="R$ "
            formatValue={(val) => val.toLocaleString('pt-BR')}
          />
        </div>
        <div className="flex items-center">
          <div className="flex-1">
            <div className="flex items-center gap-1 mb-2">
              <label className="text-xs text-gray-700">Potencial de LTV</label>
              <InfoTooltip content="Lifetime Value: Receita total estimada por cliente ao longo do relacionamento. Meta 2026: R$20.000+ para parcerias estratégicas com incorporadoras." />
            </div>
            <FinancialSlider
              label=""
              value={scores.ltv}
              onChange={(value) => updateScore('ltv', value)}
              min={0}
              max={30000}
              step={1000}
              prefix="R$ "
              formatValue={(val) => val.toLocaleString('pt-BR')}
            />
          </div>
        </div>
        <FinancialSlider
          label="Payback Esperado (meses)"
          value={scores.payback}
          onChange={(value) => updateScore('payback', value)}
          min={0}
          max={36}
          step={1}
          suffix=" meses"
        />
        <div className="flex items-center">
          <div className="flex-1">
            <div className="flex items-center gap-1 mb-2">
              <label className="text-xs text-gray-700">CAC Estimado</label>
              <InfoTooltip content="Custo de Aquisição de Cliente: Investimento necessário para conquistar uma unidade. Benchmark Leroy Merlin 2026: <R$2.000 para alta eficiência." />
            </div>
            <FinancialSlider
              label=""
              value={scores.cac}
              onChange={(value) => updateScore('cac', value)}
              min={0}
              max={5000}
              step={100}
              prefix="R$ "
              formatValue={(val) => val.toLocaleString('pt-BR')}
            />
          </div>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          Ajuste os valores conforme os dados do projeto
        </p>
      </div>
    </div>
  );
}