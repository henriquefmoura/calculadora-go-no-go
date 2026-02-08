import React from 'react';
import { Building2, Plus, Trash2 } from 'lucide-react';

export interface Tipologia {
  id: string;
  tipo: string;
  metragem: number;
  quantidade: number;
  precoVenda: number;
}

interface MixEmpreendimentoProps {
  tipologias: Tipologia[];
  onChange: (tipologias: Tipologia[]) => void;
}

const CAPTURA_POR_M2 = 1200; // R$ 1.200 por m²

export function MixEmpreendimento({ tipologias, onChange }: MixEmpreendimentoProps) {
  const addTipologia = () => {
    const newTipologia: Tipologia = {
      id: Date.now().toString(),
      tipo: '',
      metragem: 0,
      quantidade: 0,
      precoVenda: 0
    };
    onChange([...tipologias, newTipologia]);
  };

  const removeTipologia = (id: string) => {
    onChange(tipologias.filter(t => t.id !== id));
  };

  const updateTipologia = (id: string, field: keyof Tipologia, value: string | number) => {
    onChange(
      tipologias.map(t => 
        t.id === id ? { ...t, [field]: value } : t
      )
    );
  };

  const calculatePotencialCaptura = (metragem: number) => {
    return metragem * CAPTURA_POR_M2;
  };

  const calculateTotals = () => {
    const totalUnidades = tipologias.reduce((sum, t) => sum + t.quantidade, 0);
    const totalVGV = tipologias.reduce((sum, t) => sum + (t.precoVenda * t.quantidade), 0);
    const totalPotencialLeroy = tipologias.reduce(
      (sum, t) => sum + (calculatePotencialCaptura(t.metragem) * t.quantidade),
      0
    );
    
    return { totalUnidades, totalVGV, totalPotencialLeroy };
  };

  const totals = calculateTotals();

  return (
    <div className="glass-card rounded-lg shadow-md border border-white/20 p-6 backdrop-blur-md">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Building2 className="size-5 text-[#00834c]" />
          <h2 className="text-lg text-gray-900">Mix de Empreendimento e Projeção de LTV</h2>
        </div>
        <button
          onClick={addTipologia}
          className="flex items-center gap-2 px-4 py-2 bg-[#00834c] hover:bg-[#006b3f] text-white rounded-lg transition-colors text-sm"
        >
          <Plus className="size-4" />
          Adicionar Tipologia
        </button>
      </div>

      {tipologias.length === 0 ? (
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <Building2 className="size-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 text-sm mb-2">Nenhuma tipologia cadastrada</p>
          <p className="text-gray-500 text-xs">
            Clique em "Adicionar Tipologia" para começar a configurar o mix do empreendimento
          </p>
        </div>
      ) : (
        <>
          {/* Tabela Desktop */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left text-xs font-medium text-gray-700 pb-3 pr-4">Tipologia</th>
                  <th className="text-right text-xs font-medium text-gray-700 pb-3 px-4">Metragem (m²)</th>
                  <th className="text-right text-xs font-medium text-gray-700 pb-3 px-4">Quantidade</th>
                  <th className="text-right text-xs font-medium text-gray-700 pb-3 px-4">Preço de Venda</th>
                  <th className="text-right text-xs font-medium text-gray-700 pb-3 px-4">VGV Tipologia</th>
                  <th className="text-right text-xs font-medium text-gray-700 pb-3 px-4">Potencial Captura Leroy</th>
                  <th className="text-center text-xs font-medium text-gray-700 pb-3 pl-4">Ações</th>
                </tr>
              </thead>
              <tbody>
                {tipologias.map((tipologia, index) => {
                  const potencialCaptura = calculatePotencialCaptura(tipologia.metragem);
                  const vgvTipologia = tipologia.precoVenda * tipologia.quantidade;
                  const potencialTotal = potencialCaptura * tipologia.quantidade;

                  return (
                    <tr key={tipologia.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                      <td className="py-3 pr-4">
                        <input
                          type="text"
                          value={tipologia.tipo}
                          onChange={(e) => updateTipologia(tipologia.id, 'tipo', e.target.value)}
                          placeholder="Ex: 2 dorms, Studio..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#00834c] focus:border-[#00834c] outline-none"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <input
                          type="number"
                          value={tipologia.metragem || ''}
                          onChange={(e) => updateTipologia(tipologia.id, 'metragem', Number(e.target.value))}
                          placeholder="0"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-right focus:ring-2 focus:ring-[#00834c] focus:border-[#00834c] outline-none"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <input
                          type="number"
                          value={tipologia.quantidade || ''}
                          onChange={(e) => updateTipologia(tipologia.id, 'quantidade', Number(e.target.value))}
                          placeholder="0"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-right focus:ring-2 focus:ring-[#00834c] focus:border-[#00834c] outline-none"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 text-xs text-gray-500">R$</span>
                          <input
                            type="number"
                            value={tipologia.precoVenda || ''}
                            onChange={(e) => updateTipologia(tipologia.id, 'precoVenda', Number(e.target.value))}
                            placeholder="0"
                            className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg text-sm text-right focus:ring-2 focus:ring-[#00834c] focus:border-[#00834c] outline-none"
                          />
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right text-sm text-gray-700">
                        R$ {vgvTipologia.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
                      </td>
                      <td className="py-3 px-4 text-right text-sm text-[#00834c] font-medium">
                        R$ {potencialTotal.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
                        <div className="text-xs text-gray-500 mt-0.5">
                          R$ {potencialCaptura.toLocaleString('pt-BR')}/un
                        </div>
                      </td>
                      <td className="py-3 pl-4 text-center">
                        <button
                          onClick={() => removeTipologia(tipologia.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Cards Mobile */}
          <div className="md:hidden space-y-4">
            {tipologias.map((tipologia) => {
              const potencialCaptura = calculatePotencialCaptura(tipologia.metragem);
              const vgvTipologia = tipologia.precoVenda * tipologia.quantidade;
              const potencialTotal = potencialCaptura * tipologia.quantidade;

              return (
                <div key={tipologia.id} className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-900">Tipologia</h4>
                    <button
                      onClick={() => removeTipologia(tipologia.id)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                  
                  <input
                    type="text"
                    value={tipologia.tipo}
                    onChange={(e) => updateTipologia(tipologia.id, 'tipo', e.target.value)}
                    placeholder="Ex: 2 dorms, Studio..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#00834c] focus:border-[#00834c] outline-none"
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Metragem (m²)</label>
                      <input
                        type="number"
                        value={tipologia.metragem || ''}
                        onChange={(e) => updateTipologia(tipologia.id, 'metragem', Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#00834c] focus:border-[#00834c] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Quantidade</label>
                      <input
                        type="number"
                        value={tipologia.quantidade || ''}
                        onChange={(e) => updateTipologia(tipologia.id, 'quantidade', Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#00834c] focus:border-[#00834c] outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Preço de Venda</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-xs text-gray-500">R$</span>
                      <input
                        type="number"
                        value={tipologia.precoVenda || ''}
                        onChange={(e) => updateTipologia(tipologia.id, 'precoVenda', Number(e.target.value))}
                        className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#00834c] focus:border-[#00834c] outline-none"
                      />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-200 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">VGV Tipologia:</span>
                      <span className="text-gray-900 font-medium">
                        R$ {vgvTipologia.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Potencial Leroy:</span>
                      <span className="text-[#00834c] font-medium">
                        R$ {potencialTotal.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Totalizadores */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
              <div className="text-xs text-blue-700 mb-1">Total de Unidades</div>
              <div className="text-2xl text-blue-900 font-medium">{totals.totalUnidades}</div>
            </div>

            <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-lg p-4">
              <div className="text-xs text-gray-600 mb-1">VGV Total do Empreendimento</div>
              <div className="text-2xl text-gray-900 font-medium">
                R$ {totals.totalVGV.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
              </div>
            </div>

            <div className="bg-gradient-to-r from-[#00834c]/10 to-[#00834c]/5 border border-[#00834c]/30 rounded-lg p-4">
              <div className="text-xs text-[#00834c] mb-1">Potencial Total Leroy Merlin</div>
              <div className="text-2xl text-[#00834c] font-medium">
                R$ {totals.totalPotencialLeroy.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
              </div>
              <div className="text-xs text-gray-600 mt-1">
                {totals.totalVGV > 0 && (
                  <>
                    {((totals.totalPotencialLeroy / totals.totalVGV) * 100).toFixed(1)}% do VGV
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="text-xs text-blue-900">
              <strong>Metodologia de Cálculo:</strong> Potencial de Captura = R$ {CAPTURA_POR_M2.toLocaleString('pt-BR')}/m² × Metragem × Quantidade de Unidades
            </div>
          </div>
        </>
      )}
    </div>
  );
}
