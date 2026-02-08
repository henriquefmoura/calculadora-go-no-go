import React from 'react';
import { HardHat, AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';

interface TechnicalCapacityProps {
  data: {
    totalUnits: number;
    workDuration: number;
    engineerCapacity: number;
  };
  onChange: (data: any) => void;
}

export function TechnicalCapacity({ data, onChange }: TechnicalCapacityProps) {
  const updateField = (field: string, value: number) => {
    onChange({ ...data, [field]: value });
  };

  // Listen for units changes from ProjectDataForm
  React.useEffect(() => {
    const handleUnitsChange = (e: any) => {
      const units = Number(e.detail);
      if (units !== data.totalUnits) {
        updateField('totalUnits', units);
      }
    };
    
    window.addEventListener('unitsChanged', handleUnitsChange);
    return () => window.removeEventListener('unitsChanged', handleUnitsChange);
  }, [data.totalUnits]);

  // Cálculo de engenheiros necessários
  const calculateEngineers = () => {
    if (!data.totalUnits || !data.workDuration || !data.engineerCapacity) return 0;
    
    // Total de unidades a serem atendidas / (capacidade do engenheiro * duração da obra)
    const required = data.totalUnits / (data.engineerCapacity * data.workDuration);
    return Math.ceil(required);
  };

  const engineersNeeded = calculateEngineers();

  // Status baseado na carga de trabalho
  const getStatus = () => {
    if (!engineersNeeded) return { type: 'neutral', label: 'Aguardando dados', color: 'gray', icon: AlertCircle };
    
    const workloadPerEngineer = data.totalUnits / engineersNeeded;
    const optimalWorkload = data.engineerCapacity * data.workDuration;
    
    if (workloadPerEngineer <= optimalWorkload * 0.8) {
      return { 
        type: 'adequate', 
        label: 'Capacidade Adequada', 
        color: 'emerald', 
        icon: CheckCircle,
        message: 'Equipe dimensionada adequadamente com margem de segurança'
      };
    } else if (workloadPerEngineer <= optimalWorkload) {
      return { 
        type: 'alert', 
        label: 'Atenção', 
        color: 'amber', 
        icon: AlertTriangle,
        message: 'Equipe no limite da capacidade recomendada'
      };
    } else {
      return { 
        type: 'insufficient', 
        label: 'Capacidade Insuficiente', 
        color: 'red', 
        icon: AlertCircle,
        message: 'Necessário reforço de equipe ou revisão de cronograma'
      };
    }
  };

  const status = getStatus();
  const StatusIcon = status.icon;

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-5">
        <HardHat className="size-5 text-[#ff6900]" />
        <h2 className="text-lg text-gray-900">Capacidade Técnica / Engenharia</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm text-gray-700 mb-1.5">
            Total de Unidades
          </label>
          <input
            type="number"
            value={data.totalUnits || ''}
            onChange={(e) => updateField('totalUnits', Number(e.target.value))}
            placeholder="Ex: 120"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00834c] focus:border-[#00834c] outline-none"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1.5">
            Duração Média da Obra (meses)
          </label>
          <input
            type="number"
            value={data.workDuration || ''}
            onChange={(e) => updateField('workDuration', Number(e.target.value))}
            placeholder="Ex: 18"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00834c] focus:border-[#00834c] outline-none"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1.5">
            Capacidade do Engenheiro (un./mês)
          </label>
          <input
            type="number"
            value={data.engineerCapacity || ''}
            onChange={(e) => updateField('engineerCapacity', Number(e.target.value))}
            placeholder="Ex: 8"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00834c] focus:border-[#00834c] outline-none"
          />
        </div>
      </div>

      {/* Resultado */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Engenheiros Necessários */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-2">Engenheiros Necessários</div>
          <div className="text-4xl text-gray-900">
            {engineersNeeded}
          </div>
          {engineersNeeded > 0 && (
            <div className="text-xs text-gray-500 mt-2">
              {data.totalUnits} unidades em {data.workDuration} meses
            </div>
          )}
        </div>

        {/* Status */}
        <div 
          className={`
            border-2 rounded-lg p-4
            ${status.color === 'emerald' ? 'bg-emerald-50 border-emerald-500' : ''}
            ${status.color === 'amber' ? 'bg-amber-50 border-amber-500' : ''}
            ${status.color === 'red' ? 'bg-red-50 border-red-500' : ''}
            ${status.color === 'gray' ? 'bg-gray-50 border-gray-300' : ''}
          `}
        >
          <div className="flex items-center gap-2 mb-2">
            <StatusIcon 
              className={`
                size-5
                ${status.color === 'emerald' ? 'text-emerald-600' : ''}
                ${status.color === 'amber' ? 'text-amber-600' : ''}
                ${status.color === 'red' ? 'text-red-600' : ''}
                ${status.color === 'gray' ? 'text-gray-600' : ''}
              `}
            />
            <span 
              className={`
                text-sm
                ${status.color === 'emerald' ? 'text-emerald-900' : ''}
                ${status.color === 'amber' ? 'text-amber-900' : ''}
                ${status.color === 'red' ? 'text-red-900' : ''}
                ${status.color === 'gray' ? 'text-gray-900' : ''}
              `}
            >
              {status.label}
            </span>
          </div>
          {status.message && (
            <p className="text-xs text-gray-600 leading-relaxed">
              {status.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}