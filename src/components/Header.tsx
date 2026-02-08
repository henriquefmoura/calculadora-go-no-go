import React from 'react';
import { Calculator, Save } from 'lucide-react';

interface HeaderProps {
  onCalculate: () => void;
  onSave: () => void;
}

export function Header({ onCalculate, onSave }: HeaderProps) {
  return (
    <header className="glass-card rounded-lg shadow-md border border-white/20 backdrop-blur-md">
      <div className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Calculadora Go/No-Go</h1>
            <p className="text-sm text-gray-600">Análise de Parcerias com Incorporadoras - Leroy Merlin Instalações e Reformas</p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={onSave}
              className="px-6 py-2.5 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <Save className="size-4" />
              Salvar
            </button>
            <button
              onClick={onCalculate}
              className="px-8 py-3 bg-[#00834c] hover:bg-[#006b3f] text-white rounded-lg font-bold text-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2 border-2 border-[#00a65f]"
            >
              <Calculator className="size-5" />
              Calcular Go/No-Go
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}