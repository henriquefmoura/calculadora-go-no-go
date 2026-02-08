import React, { useState } from 'react';
import { Plus, Trash2, Wrench, Fan, Wallpaper, Lock, Flame, UtensilsCrossed, Wind, Droplet, Lightbulb, AlertCircle } from 'lucide-react';

type TipoInstalacao = 
  | 'Ar-condicionado (split)'
  | 'Ventilador de teto'
  | 'Papel de parede'
  | 'Fechadura digital'
  | 'Cooktop'
  | 'Forno'
  | 'Coifa'
  | 'Chuveiro'
  | 'Lustre / luminária';

interface Instalacao {
  id: string;
  tipo: TipoInstalacao;
  quantidade: number;
  precoVenda: number;
  repassePrestador: number;
}

const tiposInstalacao: TipoInstalacao[] = [
  'Ar-condicionado (split)',
  'Ventilador de teto',
  'Papel de parede',
  'Fechadura digital',
  'Cooktop',
  'Forno',
  'Coifa',
  'Chuveiro',
  'Lustre / luminária'
];

const iconMap: Record<TipoInstalacao, React.ReactNode> = {
  'Ar-condicionado (split)': <Wind className="w-4 h-4" />,
  'Ventilador de teto': <Fan className="w-4 h-4" />,
  'Papel de parede': <Wallpaper className="w-4 h-4" />,
  'Fechadura digital': <Lock className="w-4 h-4" />,
  'Cooktop': <Flame className="w-4 h-4" />,
  'Forno': <UtensilsCrossed className="w-4 h-4" />,
  'Coifa': <Wind className="w-4 h-4" />,
  'Chuveiro': <Droplet className="w-4 h-4" />,
  'Lustre / luminária': <Lightbulb className="w-4 h-4" />
};

export function MixInstalacoesSimples() {
  const [instalacoes, setInstalacoes] = useState<Instalacao[]>([]);

  const adicionarInstalacao = () => {
    const novaInstalacao: Instalacao = {
      id: Math.random().toString(36).substr(2, 9),
      tipo: 'Ar-condicionado (split)',
      quantidade: 0,
      precoVenda: 0,
      repassePrestador: 0
    };
    setInstalacoes([...instalacoes, novaInstalacao]);
  };

  const removerInstalacao = (id: string) => {
    setInstalacoes(instalacoes.filter(i => i.id !== id));
  };

  const atualizarInstalacao = (id: string, campo: keyof Instalacao, valor: any) => {
    setInstalacoes(instalacoes.map(i => 
      i.id === id ? { ...i, [campo]: valor } : i
    ));
  };

  const calcularReceitaBruta = (inst: Instalacao) => {
    return inst.precoVenda * inst.quantidade;
  };

  const calcularCustoRepasse = (inst: Instalacao) => {
    return inst.repassePrestador * inst.quantidade;
  };

  const calcularMargemLeroy = (inst: Instalacao) => {
    return calcularReceitaBruta(inst) - calcularCustoRepasse(inst);
  };

  const calcularMargemPercentual = (inst: Instalacao) => {
    const receita = calcularReceitaBruta(inst);
    if (receita === 0) return 0;
    return (calcularMargemLeroy(inst) / receita) * 100;
  };

  // Consolidação
  const totalInstalacoes = instalacoes.reduce((sum, i) => sum + i.quantidade, 0);
  const receitaBrutaTotal = instalacoes.reduce((sum, i) => sum + calcularReceitaBruta(i), 0);
  const margemTotalLeroy = instalacoes.reduce((sum, i) => sum + calcularMargemLeroy(i), 0);
  const margemMedia = receitaBrutaTotal > 0 ? (margemTotalLeroy / receitaBrutaTotal) * 100 : 0;

  // Indicador de saúde
  const getIndicadorSaude = () => {
    if (margemMedia >= 25) {
      return { cor: 'bg-green-100 border-green-400 text-green-800', texto: 'Instalações simples com margem sustentável', icon: '✓' };
    } else if (margemMedia >= 15) {
      return { cor: 'bg-yellow-100 border-yellow-400 text-yellow-800', texto: 'Margem em atenção - monitorar repasses', icon: '⚠' };
    } else {
      return { cor: 'bg-red-100 border-red-400 text-red-800', texto: 'Modelo de repasse exige revisão', icon: '✕' };
    }
  };

  const indicador = getIndicadorSaude();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="glass-card rounded-lg shadow-md border border-white/20 p-6 backdrop-blur-md">
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#00834c] rounded flex items-center justify-center">
            <Wrench className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg text-gray-900">Mix de Instalações Simples e Margem</h2>
            <p className="text-sm text-gray-600 mt-1">Projeção de receita, repasse e margem por tipo de serviço</p>
          </div>
        </div>
        <button
          onClick={adicionarInstalacao}
          className="flex items-center gap-2 px-4 py-2 bg-[#00834c] text-white rounded-lg hover:bg-[#006b3f] transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          Adicionar Instalação
        </button>
      </div>

      {/* Tabela */}
      <div className="bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200 overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Tipo de Instalação
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Quantidade<br/>Estimada
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Preço de Venda<br/>Unitário (R$)
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Receita Bruta<br/>Total (R$)
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Repasse ao<br/>Prestador (R$ unit.)
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Custo Total<br/>de Repasse (R$)
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Margem<br/>Leroy (R$)
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Margem (%)
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {instalacoes.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-gray-500">
                    <Wrench className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>Nenhuma instalação adicionada.</p>
                    <p className="text-sm mt-1">Clique em "Adicionar Instalação" para começar.</p>
                  </td>
                </tr>
              ) : (
                instalacoes.map((inst) => (
                  <tr key={inst.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400">{iconMap[inst.tipo]}</span>
                        <select
                          value={inst.tipo}
                          onChange={(e) => atualizarInstalacao(inst.id, 'tipo', e.target.value)}
                          className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00834c]"
                        >
                          {tiposInstalacao.map(tipo => (
                            <option key={tipo} value={tipo}>{tipo}</option>
                          ))}
                        </select>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        value={inst.quantidade || ''}
                        onChange={(e) => atualizarInstalacao(inst.id, 'quantidade', Number(e.target.value))}
                        className="w-24 border border-gray-300 rounded px-2 py-1.5 text-sm text-right focus:outline-none focus:ring-2 focus:ring-[#00834c]"
                        min="0"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        value={inst.precoVenda || ''}
                        onChange={(e) => atualizarInstalacao(inst.id, 'precoVenda', Number(e.target.value))}
                        className="w-28 border border-gray-300 rounded px-2 py-1.5 text-sm text-right focus:outline-none focus:ring-2 focus:ring-[#00834c]"
                        min="0"
                        step="0.01"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(calcularReceitaBruta(inst))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        value={inst.repassePrestador || ''}
                        onChange={(e) => atualizarInstalacao(inst.id, 'repassePrestador', Number(e.target.value))}
                        className="w-28 border border-gray-300 rounded px-2 py-1.5 text-sm text-right focus:outline-none focus:ring-2 focus:ring-[#00834c]"
                        min="0"
                        step="0.01"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-900">
                        {formatCurrency(calcularCustoRepasse(inst))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm font-semibold text-[#00834c]">
                        {formatCurrency(calcularMargemLeroy(inst))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className={`text-sm font-medium ${
                        calcularMargemPercentual(inst) >= 25 ? 'text-green-600' :
                        calcularMargemPercentual(inst) >= 15 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {calcularMargemPercentual(inst).toFixed(1)}%
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => removerInstalacao(inst.id)}
                        className="text-red-500 hover:text-red-700 transition-colors p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cards de Consolidação */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
          <div className="text-xs text-blue-700 mb-1">Total de Instalações</div>
          <div className="text-2xl font-medium text-blue-900">{totalInstalacoes}</div>
        </div>
        
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-lg p-4">
          <div className="text-xs text-gray-600 mb-1">Receita Bruta Total – Instalações</div>
          <div className="text-2xl font-medium text-gray-900">{formatCurrency(receitaBrutaTotal)}</div>
        </div>
        
        <div className="bg-gradient-to-r from-[#00834c]/10 to-[#00834c]/5 border border-[#00834c]/30 rounded-lg p-4">
          <div className="text-xs text-[#00834c] mb-1">Margem Total Leroy Merlin – Instalações</div>
          <div className="text-2xl font-medium text-[#00834c]">{formatCurrency(margemTotalLeroy)}</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-xs text-gray-600 mb-1">Margem Média (%)</div>
          <div className={`text-2xl font-medium ${
            margemMedia >= 25 ? 'text-green-600' :
            margemMedia >= 15 ? 'text-yellow-600' :
            'text-red-600'
          }`}>
            {margemMedia.toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Indicador de Saúde */}
      {instalacoes.length > 0 && (
        <div className={`border rounded-lg p-4 mb-6 ${indicador.cor}`}>
          <div className="flex items-center gap-3">
            <div className="text-2xl">{indicador.icon}</div>
            <div>
              <div className="font-semibold">Análise de Margem</div>
              <div className="text-sm mt-0.5">{indicador.texto}</div>
            </div>
          </div>
        </div>
      )}

      {/* Metodologia de Cálculo */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <div className="font-semibold text-blue-900 mb-2">Metodologia de Cálculo:</div>
            <div className="text-sm text-blue-800 space-y-1">
              <div><strong>Receita</strong> = Preço unitário × Quantidade</div>
              <div><strong>Margem Leroy</strong> = Receita – Repasse ao prestador</div>
              <div><strong>Margem (%)</strong> = Margem / Receita</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}