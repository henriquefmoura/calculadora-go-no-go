import React from 'react';
import { Handshake, TrendingDown } from 'lucide-react';

interface CommercialModelData {
  commissionType: 'percentage' | 'fixed';
  commissionValue: number;
  incentives: string;
  counterparties: string;
}

interface CommercialModelProps {
  data: CommercialModelData;
  onChange: (data: CommercialModelData) => void;
  reformRevenue: number;
}

export function CommercialModel({ data, onChange, reformRevenue }: CommercialModelProps) {
  const updateField = (field: keyof CommercialModelData, value: string | number) => {
    onChange({ ...data, [field]: value });
  };

  // Cálculo da comissão
  const calculateCommission = () => {
    if (data.commissionType === 'percentage') {
      return (reformRevenue * data.commissionValue) / 100;
    }
    return data.commissionValue;
  };

  const commission = calculateCommission();
  const netRevenue = reformRevenue - commission;
  const impactOnMargin = reformRevenue > 0 ? (commission / reformRevenue) * 100 : 0;

  return (
    <div className="glass-card rounded-lg shadow-md border border-white/20 p-6 backdrop-blur-md">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Handshake className="size-5 text-[#ff6900]" />
          <h2 className="text-lg text-gray-900">Modelo Comercial com a Construtora</h2>
        </div>
        <div className="flex items-center gap-2">
          <TrendingDown className="size-4 text-gray-500" />
          <span className="text-xs text-gray-600">Impacto na Receita</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Comissão */}
        <div>
          <h3 className="text-sm text-gray-900 mb-3">Comissão à Construtora</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-gray-600 mb-1.5">Tipo de Comissão</label>
              <select
                value={data.commissionType}
                onChange={(e) => updateField('commissionType', e.target.value as 'percentage' | 'fixed')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#00834c] focus:border-[#00834c] outline-none"
              >
                <option value="percentage">Percentual da Receita</option>
                <option value="fixed">Valor Fixo por Unidade</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-600 mb-1.5">
                {data.commissionType === 'percentage' ? 'Percentual (%)' : 'Valor Fixo (R$)'}
              </label>
              <div className="relative">
                {data.commissionType === 'fixed' && (
                  <span className="absolute left-3 top-2 text-sm text-gray-500">R$</span>
                )}
                <input
                  type="number"
                  value={data.commissionValue || ''}
                  onChange={(e) => updateField('commissionValue', Number(e.target.value))}
                  placeholder={data.commissionType === 'percentage' ? '0' : '0'}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#00834c] focus:border-[#00834c] outline-none ${
                    data.commissionType === 'fixed' ? 'pl-10' : ''
                  }`}
                />
                {data.commissionType === 'percentage' && (
                  <span className="absolute right-3 top-2 text-sm text-gray-500">%</span>
                )}
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <div className="text-xs text-gray-600 mb-2">Comissão Total Estimada</div>
              <div className="text-2xl text-gray-900">
                R$ {commission.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Impacto na margem: {impactOnMargin.toFixed(1)}%
              </div>
            </div>
          </div>
        </div>

        {/* Incentivos e Contrapartidas */}
        <div>
          <h3 className="text-sm text-gray-900 mb-3">Incentivos e Contrapartidas</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-gray-600 mb-1.5">Incentivos Oferecidos</label>
              <textarea
                value={data.incentives}
                onChange={(e) => updateField('incentives', e.target.value)}
                placeholder="Ex: Bonificação por volume, material promocional, stand exclusivo..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#00834c] focus:border-[#00834c] outline-none resize-none"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-600 mb-1.5">Contrapartidas Exigidas</label>
              <textarea
                value={data.counterparties}
                onChange={(e) => updateField('counterparties', e.target.value)}
                placeholder="Ex: Exclusividade, espaço no plantão, lista de compradores..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#00834c] focus:border-[#00834c] outline-none resize-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Resultado Financeiro */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-xs text-gray-600 mb-1">Receita Bruta Estimada</div>
          <div className="text-xl text-blue-900">
            R$ {reformRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-xs text-gray-600 mb-1">Comissão Total</div>
          <div className="text-xl text-red-900">
            - R$ {commission.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </div>
        </div>

        <div className="bg-[#00834c]/10 border border-[#00834c]/20 rounded-lg p-4">
          <div className="text-xs text-gray-600 mb-1">Receita Líquida</div>
          <div className="text-xl text-[#00834c] font-medium">
            R$ {netRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </div>
        </div>
      </div>

      {impactOnMargin > 20 && (
        <div className="mt-4 p-3 bg-amber-50 border-l-4 border-amber-500 rounded-r-lg">
          <div className="flex items-start gap-2">
            <TrendingDown className="size-4 text-amber-600 mt-0.5 shrink-0" />
            <div>
              <div className="text-sm text-amber-900 font-medium">Alerta: Alta Comissão</div>
              <div className="text-xs text-amber-700 mt-1">
                Comissão de {impactOnMargin.toFixed(1)}% impacta significativamente a margem. 
                Considere renegociação ou contrapartidas adicionais.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
