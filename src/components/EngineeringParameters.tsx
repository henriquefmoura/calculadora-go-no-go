import React, { useState } from 'react';
import { Settings, Calendar, DollarSign, TrendingUp, Badge } from 'lucide-react';
import { Tipologia } from './MixEmpreendimento';

interface EngineeringParametersProps {
  tipologias: Tipologia[];
}

const CUSTO_POR_UNIDADE = 2500; // Custo operacional médio por unidade

export function EngineeringParameters({ tipologias }: EngineeringParametersProps) {
  const [capacidadeMensal, setCapacidadeMensal] = useState<number>(0);

  const calculateMetrics = () => {
    const totalUnidades = tipologias.reduce((sum, t) => sum + t.quantidade, 0);
    
    if (capacidadeMensal === 0 || totalUnidades === 0) {
      return {
        totalUnidades,
        cronogramaMeses: 0,
        custoOperacional: 0,
        eficienciaMaxima: false
      };
    }

    // Cronograma Total de Entrega (em meses)
    const cronogramaMeses = Math.ceil(totalUnidades / capacidadeMensal);
    
    // Custo Operacional Otimizado
    const custoOperacional = totalUnidades * CUSTO_POR_UNIDADE;
    
    // Eficiência Máxima se cronograma < 12 meses
    const eficienciaMaxima = cronogramaMeses < 12;

    return {
      totalUnidades,
      cronogramaMeses,
      custoOperacional,
      eficienciaMaxima
    };
  };

  const metrics = calculateMetrics();

  return (
    <div className="glass-card rounded-lg shadow-md border border-white/20 p-6 backdrop-blur-md">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Settings className="size-5 text-[#00834c]" />
          <h2 className="text-lg text-gray-900">Parâmetros de Engenharia e Escala</h2>
        </div>
        {metrics.eficienciaMaxima && metrics.cronogramaMeses > 0 && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#00834c] text-white rounded-lg text-sm font-medium">
            <Badge className="size-4" />
            Eficiência Máxima
          </div>
        )}
      </div>

      {/* Input de Capacidade */}
      <div className="mb-6">
        <label className="block text-sm text-gray-700 mb-2">
          Capacidade de Produção Mensal (Unidades/Mês)
        </label>
        <input
          type="number"
          value={capacidadeMensal || ''}
          onChange={(e) => setCapacidadeMensal(Number(e.target.value))}
          placeholder="Ex: 25"
          className="w-full md:w-64 px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#00834c] focus:border-[#00834c] outline-none"
        />
        <p className="text-xs text-gray-500 mt-1.5">
          Número de unidades que podem ser executadas simultaneamente por mês
        </p>
      </div>

      {/* Card de Resultados */}
      {capacidadeMensal > 0 && metrics.totalUnidades > 0 && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Cronograma Total */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-5">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="size-5 text-blue-700" />
                <div className="text-sm text-blue-900 font-medium">Cronograma Total de Entrega</div>
              </div>
              <div className="text-4xl text-blue-900 font-bold mb-2">
                {metrics.cronogramaMeses}
                <span className="text-lg ml-2 font-normal text-blue-700">
                  {metrics.cronogramaMeses === 1 ? 'mês' : 'meses'}
                </span>
              </div>
              <div className="text-xs text-blue-700 mt-2">
                {metrics.totalUnidades} unidades ÷ {capacidadeMensal} un/mês
              </div>
              {metrics.eficienciaMaxima && (
                <div className="mt-3 pt-3 border-t border-blue-300">
                  <div className="text-xs text-blue-800 flex items-center gap-1">
                    <TrendingUp className="size-3" />
                    Execução otimizada em menos de 1 ano
                  </div>
                </div>
              )}
            </div>

            {/* Custo Operacional */}
            <div className="bg-gradient-to-br from-[#00834c]/10 to-[#00834c]/5 border border-[#00834c]/30 rounded-lg p-5">
              <div className="flex items-center gap-2 mb-3">
                <DollarSign className="size-5 text-[#00834c]" />
                <div className="text-sm text-[#00834c] font-medium">Custo Operacional Otimizado</div>
              </div>
              <div className="text-4xl text-[#00834c] font-bold mb-2">
                R$ {metrics.custoOperacional.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
              </div>
              <div className="text-xs text-gray-600 mt-2">
                R$ {CUSTO_POR_UNIDADE.toLocaleString('pt-BR')} × {metrics.totalUnidades} unidades
              </div>
              <div className="mt-3 pt-3 border-t border-[#00834c]/20">
                <div className="text-xs text-gray-700">
                  Custo médio por mês: R$ {(metrics.custoOperacional / metrics.cronogramaMeses).toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
                </div>
              </div>
            </div>
          </div>

          {/* Detalhamento */}
          <div className="bg-white/50 backdrop-blur-sm border border-gray-200 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-xs text-gray-600 mb-1">Total de Unidades</div>
                <div className="text-lg text-gray-900 font-medium">{metrics.totalUnidades}</div>
              </div>
              <div>
                <div className="text-xs text-gray-600 mb-1">Capacidade Mensal</div>
                <div className="text-lg text-gray-900 font-medium">{capacidadeMensal} un/mês</div>
              </div>
              <div>
                <div className="text-xs text-gray-600 mb-1">Utilização Mensal Média</div>
                <div className="text-lg text-gray-900 font-medium">
                  {((metrics.totalUnidades / metrics.cronogramaMeses) / capacidadeMensal * 100).toFixed(0)}%
                </div>
              </div>
            </div>
          </div>

          {/* Legenda */}
          <div className="pt-4 border-t border-gray-200">
            <p className="text-xs text-[#666666] leading-relaxed">
              <strong>Capacidade Operacional & Escalabilidade:</strong> Indicador técnico baseado na produtividade 
              da engenharia e disponibilidade de squads de instalação. Este cálculo considera a capacidade mensal 
              informada para dimensionar o cronograma de entrega e os custos operacionais do projeto.
            </p>
          </div>
        </div>
      )}

      {/* Estado Vazio */}
      {(capacidadeMensal === 0 || metrics.totalUnidades === 0) && (
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <Settings className="size-10 text-gray-400 mx-auto mb-3" />
          <p className="text-sm text-gray-600 mb-1">
            {metrics.totalUnidades === 0 
              ? 'Configure o Mix de Empreendimento primeiro'
              : 'Informe a capacidade de produção mensal'}
          </p>
          <p className="text-xs text-gray-500">
            {metrics.totalUnidades === 0
              ? 'Adicione tipologias no módulo "Mix de Empreendimento" acima'
              : 'Digite a capacidade mensal para ver os cálculos de cronograma e custo'}
          </p>
        </div>
      )}

      {/* Alertas de Otimização */}
      {capacidadeMensal > 0 && metrics.totalUnidades > 0 && (
        <>
          {metrics.cronogramaMeses > 24 && (
            <div className="mt-4 p-3 bg-amber-50 border-l-4 border-amber-500 rounded-r-lg">
              <div className="text-sm text-amber-900 font-medium mb-1">
                ⚠️ Cronograma Prolongado
              </div>
              <div className="text-xs text-amber-800">
                Execução superior a 24 meses pode impactar o retorno do investimento. 
                Considere aumentar a capacidade mensal para {Math.ceil(metrics.totalUnidades / 18)} un/mês.
              </div>
            </div>
          )}

          {metrics.cronogramaMeses >= 12 && metrics.cronogramaMeses <= 24 && !metrics.eficienciaMaxima && (
            <div className="mt-4 p-3 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
              <div className="text-sm text-blue-900 font-medium mb-1">
                💡 Oportunidade de Otimização
              </div>
              <div className="text-xs text-blue-800">
                Aumentar a capacidade para {Math.ceil(metrics.totalUnidades / 11)} un/mês 
                alcançaria eficiência máxima (execução em menos de 12 meses).
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
