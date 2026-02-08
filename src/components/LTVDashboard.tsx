import React from 'react';
import { TrendingUp, DollarSign, Repeat, Target } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Tipologia } from './MixEmpreendimento';

interface LTVDashboardProps {
  tipologias: Tipologia[];
  margemServico: number; // Margem percentual do serviço inicial (ex: 20%)
}

const CROSS_SELL_RATE = 0.15; // 15% de cross-sell
const ANOS_PROJECAO = 3;

export function LTVDashboard({ tipologias, margemServico }: LTVDashboardProps) {
  const calculateMetrics = () => {
    const totalUnidades = tipologias.reduce((sum, t) => sum + t.quantidade, 0);
    const totalVGV = tipologias.reduce((sum, t) => sum + (t.precoVenda * t.quantidade), 0);
    const potencialCapturaPorUnidade = tipologias.length > 0
      ? tipologias.reduce((sum, t) => sum + (t.metragem * 1200 * t.quantidade), 0) / totalUnidades
      : 0;
    
    // Receita inicial do serviço
    const receitaInicial = potencialCapturaPorUnidade;
    
    // Margem do serviço inicial
    const margemInicial = receitaInicial * (margemServico / 100);
    
    // Projeção de cross-sell em decoração/manutenção por 3 anos
    const crossSellAnual = receitaInicial * CROSS_SELL_RATE;
    const crossSellTotal = crossSellAnual * ANOS_PROJECAO;
    
    // LTV Total = Margem Inicial + Cross-sell 3 anos
    const ltvPorCliente = margemInicial + crossSellTotal;
    
    // Potencial total
    const potencialTotalLeroy = potencialCapturaPorUnidade * totalUnidades;
    const ltvTotalEmpreendimento = ltvPorCliente * totalUnidades;
    
    return {
      totalUnidades,
      totalVGV,
      potencialCapturaPorUnidade,
      receitaInicial,
      margemInicial,
      crossSellAnual,
      crossSellTotal,
      ltvPorCliente,
      potencialTotalLeroy,
      ltvTotalEmpreendimento
    };
  };

  const metrics = calculateMetrics();

  // Dados para o gráfico de comparação
  const chartData = [
    {
      name: 'Incorporadora',
      label: 'VGV Incorporadora',
      value: metrics.totalVGV,
      color: '#9ca3af'
    },
    {
      name: 'Leroy Merlin',
      label: 'Potencial Leroy',
      value: metrics.potencialTotalLeroy,
      color: '#00834c'
    }
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-gray-900">{payload[0].payload.label}</p>
          <p className="text-lg font-bold text-[#00834c] mt-1">
            R$ {payload[0].value.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
          </p>
        </div>
      );
    }
    return null;
  };

  if (tipologias.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Card Principal de LTV */}
      <div className="glass-card rounded-lg shadow-lg border-2 border-[#00834c]/30 p-6 backdrop-blur-md bg-gradient-to-br from-[#00834c]/5 to-[#00834c]/10">
        <div className="flex items-center gap-2 mb-5">
          <Target className="size-6 text-[#00834c]" />
          <h2 className="text-xl text-gray-900 font-medium">Dashboard de LTV por Cliente</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Margem Serviço Inicial */}
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-5 border border-[#00834c]/20">
            <div className="flex items-center gap-2 mb-3">
              <DollarSign className="size-5 text-blue-600" />
              <div className="text-xs text-gray-600">Margem Serviço Inicial</div>
            </div>
            <div className="text-3xl text-blue-900 font-bold mb-2">
              R$ {metrics.margemInicial.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
            </div>
            <div className="text-xs text-gray-600">
              Base: R$ {metrics.receitaInicial.toLocaleString('pt-BR', { minimumFractionDigits: 0 })} × {margemServico}% margem
            </div>
          </div>

          {/* Cross-sell 3 anos */}
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-5 border border-[#ff6900]/20">
            <div className="flex items-center gap-2 mb-3">
              <Repeat className="size-5 text-[#ff6900]" />
              <div className="text-xs text-gray-600">Cross-sell 3 Anos</div>
            </div>
            <div className="text-3xl text-[#ff6900] font-bold mb-2">
              R$ {metrics.crossSellTotal.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
            </div>
            <div className="text-xs text-gray-600">
              {CROSS_SELL_RATE * 100}% recorrente/ano em decoração e manutenção
            </div>
          </div>

          {/* LTV Total */}
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-5 border-2 border-[#00834c]">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="size-5 text-[#00834c]" />
              <div className="text-xs text-[#00834c] font-medium">LTV Estimado por Cliente</div>
            </div>
            <div className="text-4xl text-[#00834c] font-bold mb-2">
              R$ {metrics.ltvPorCliente.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
            </div>
            <div className="text-xs text-gray-600">
              Margem + {ANOS_PROJECAO} anos de recorrência
            </div>
          </div>
        </div>

        {/* Breakdown do LTV */}
        <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-gray-200">
          <div className="text-sm text-gray-900 font-medium mb-3">Composição do LTV</div>
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Margem do Serviço Inicial:</span>
              <span className="text-gray-900 font-medium">
                R$ {metrics.margemInicial.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Cross-sell Ano 1 (decoração):</span>
              <span className="text-gray-900 font-medium">
                + R$ {metrics.crossSellAnual.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Cross-sell Ano 2 (manutenção):</span>
              <span className="text-gray-900 font-medium">
                + R$ {metrics.crossSellAnual.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Cross-sell Ano 3 (renovação):</span>
              <span className="text-gray-900 font-medium">
                + R$ {metrics.crossSellAnual.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
              </span>
            </div>
            <div className="pt-2 border-t border-gray-300 flex justify-between items-center">
              <span className="text-sm text-[#00834c] font-medium">LTV Total:</span>
              <span className="text-lg text-[#00834c] font-bold">
                R$ {metrics.ltvPorCliente.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
              </span>
            </div>
          </div>
        </div>

        {/* Projeção Total do Empreendimento */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#00834c]/10 border border-[#00834c]/30 rounded-lg p-4">
            <div className="text-xs text-gray-700 mb-1">Potencial Total de Receita Leroy</div>
            <div className="text-2xl text-[#00834c] font-bold">
              R$ {metrics.potencialTotalLeroy.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
            </div>
            <div className="text-xs text-gray-600 mt-1">
              {metrics.totalUnidades} unidades × R$ {metrics.potencialCapturaPorUnidade.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}/un
            </div>
          </div>

          <div className="bg-[#00834c] text-white rounded-lg p-4">
            <div className="text-xs mb-1 opacity-90">LTV Total do Empreendimento</div>
            <div className="text-2xl font-bold">
              R$ {metrics.ltvTotalEmpreendimento.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
            </div>
            <div className="text-xs mt-1 opacity-90">
              Margem + Cross-sell de {metrics.totalUnidades} clientes
            </div>
          </div>
        </div>
      </div>

      {/* Gráfico de Comparação */}
      <div className="glass-card rounded-lg shadow-md border border-white/20 p-6 backdrop-blur-md">
        <h3 className="text-lg text-gray-900 mb-4">Comparativo: VGV Incorporadora vs Potencial Leroy Merlin</h3>
        
        {metrics.totalVGV > 0 ? (
          <>
            <div style={{ width: '100%', height: '320px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    type="number"
                    tickFormatter={(value) => `R$ ${(value / 1000000).toFixed(1)}M`}
                    stroke="#6b7280"
                  />
                  <YAxis 
                    type="category" 
                    dataKey="name"
                    stroke="#6b7280"
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-4 h-4 bg-gray-400 rounded"></div>
                <div>
                  <div className="text-xs text-gray-600">VGV da Incorporadora</div>
                  <div className="text-sm text-gray-900 font-medium">
                    R$ {metrics.totalVGV.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-[#00834c]/10 rounded-lg">
                <div className="w-4 h-4 bg-[#00834c] rounded"></div>
                <div>
                  <div className="text-xs text-gray-700">Potencial Leroy Merlin</div>
                  <div className="text-sm text-[#00834c] font-medium">
                    R$ {metrics.potencialTotalLeroy.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
                  </div>
                  <div className="text-xs text-gray-600">
                    {((metrics.potencialTotalLeroy / metrics.totalVGV) * 100).toFixed(1)}% do VGV
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-900">
                <strong>Relevância da Parceria:</strong> O potencial de faturamento da Leroy Merlin representa{' '}
                {((metrics.potencialTotalLeroy / metrics.totalVGV) * 100).toFixed(1)}% do VGV total da incorporadora,
                demonstrando o valor estratégico da parceria para monetização do empreendimento.
              </p>
            </div>
          </>
        ) : (
          <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <div className="text-center">
              <Target className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">Adicione tipologias para visualizar o comparativo</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}