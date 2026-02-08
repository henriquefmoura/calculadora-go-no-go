import React from 'react';
import { Cog, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';

interface OperationalData {
  totalUnits: number;
  roomsPerUnit: number;
  workDuration: number;
  monthlyCapacityNeeded: number;
  monthlyCapacityAvailable: number;
  engineerCapacity: number;
  technicalComplexity: number;
  supplyDependency: number;
  logisticalRisk: number;
  standardization: number;
  peakMonths: number;
  peakMultiplier: number;
}

interface OperationalViabilityProps {
  data: OperationalData;
  onChange: (data: OperationalData) => void;
}

export function OperationalViability({ data, onChange }: OperationalViabilityProps) {
  const updateField = (field: keyof OperationalData, value: number) => {
    onChange({ ...data, [field]: value });
  };

  // A. Cálculos de Capacidade de Execução
  const totalRooms = data.totalUnits * data.roomsPerUnit;
  const requiredMonthlyCapacity = data.workDuration > 0 ? Math.ceil(totalRooms / data.workDuration) : 0;
  
  // Análise de pico operacional
  const peakMonthlyCapacity = Math.ceil(requiredMonthlyCapacity * (data.peakMultiplier || 1.5));
  const peakCapacityUtilization = data.monthlyCapacityAvailable > 0 
    ? (peakMonthlyCapacity / data.monthlyCapacityAvailable) * 100 
    : 0;
  
  const capacityUtilization = data.monthlyCapacityAvailable > 0 
    ? (requiredMonthlyCapacity / data.monthlyCapacityAvailable) * 100 
    : 0;
  
  // Risco de concentração
  const concentrationRisk = (data.peakMonths || 0) / (data.workDuration || 1);
  const hasConcentrationRisk = concentrationRisk > 0.3; // >30% da obra concentrada

  const getExecutionStatus = () => {
    if (!data.totalUnits || !data.workDuration) {
      return { type: 'neutral', label: 'Aguardando dados', color: 'gray', icon: AlertTriangle };
    }
    
    if (peakCapacityUtilization <= 80) {
      return { 
        type: 'viable', 
        label: 'Capacidade Adequada', 
        color: 'emerald', 
        icon: CheckCircle2,
        message: 'Capacidade instalada comporta a demanda com margem de segurança'
      };
    } else if (peakCapacityUtilization <= 100) {
      return { 
        type: 'alert', 
        label: 'Atenção', 
        color: 'amber', 
        icon: AlertTriangle,
        message: 'Operando próximo ao limite da capacidade instalada'
      };
    } else {
      return { 
        type: 'critical', 
        label: 'Capacidade Insuficiente', 
        color: 'red', 
        icon: XCircle,
        message: 'Necessário aumento de capacidade ou revisão de cronograma'
      };
    }
  };

  // B. Cálculos de Estrutura Técnica
  const calculateEngineers = () => {
    if (!data.totalUnits || !data.workDuration || !data.engineerCapacity) return 0;
    const required = data.totalUnits / (data.engineerCapacity * data.workDuration);
    return Math.ceil(required);
  };

  const engineersNeeded = calculateEngineers();

  const getTechnicalStatus = () => {
    if (!engineersNeeded) return { label: 'Aguardando dados', color: 'gray' };
    
    const workloadPerEngineer = data.totalUnits / engineersNeeded;
    const optimalWorkload = data.engineerCapacity * data.workDuration;
    const utilization = workloadPerEngineer / optimalWorkload;
    
    if (utilization <= 0.8) return { label: 'Adequado', color: 'emerald' };
    if (utilization <= 1.0) return { label: 'Risco Moderado', color: 'amber' };
    return { label: 'Crítico', color: 'red' };
  };

  // D. Identificação de Gargalos
  const getBottlenecks = () => {
    const bottlenecks = [];
    
    if (peakCapacityUtilization > 100) {
      bottlenecks.push({
        severity: 'critical',
        title: 'Capacidade de Execução Insuficiente',
        description: `Demanda de ${requiredMonthlyCapacity} ambientes/mês excede capacidade de ${data.monthlyCapacityAvailable}/mês`
      });
    } else if (peakCapacityUtilization > 85) {
      bottlenecks.push({
        severity: 'warning',
        title: 'Utilização de Capacidade Elevada',
        description: `${Math.round(capacityUtilization)}% da capacidade instalada comprometida`
      });
    }

    const techStatus = getTechnicalStatus();
    if (techStatus.color === 'red') {
      bottlenecks.push({
        severity: 'critical',
        title: 'Equipe Técnica Subdimensionada',
        description: `Necessário ${engineersNeeded} engenheiros com carga acima do recomendado`
      });
    }

    if (data.technicalComplexity >= 8) {
      bottlenecks.push({
        severity: 'warning',
        title: 'Alta Complexidade Técnica',
        description: 'Projeto demanda expertise especializada e processos customizados'
      });
    }

    if (data.supplyDependency >= 7) {
      bottlenecks.push({
        severity: 'warning',
        title: 'Dependência Crítica de Supply',
        description: 'Risco de atrasos por indisponibilidade de materiais específicos'
      });
    }

    if (data.logisticalRisk >= 7) {
      bottlenecks.push({
        severity: 'critical',
        title: 'Risco Logístico Elevado',
        description: 'Necessário plano de contingência para cadeia de suprimentos'
      });
    }

    if (data.standardization <= 3) {
      bottlenecks.push({
        severity: 'warning',
        title: 'Baixa Padronização',
        description: 'Dificuldade de escala e replicação do modelo operacional'
      });
    }

    if (bottlenecks.length === 0) {
      bottlenecks.push({
        severity: 'success',
        title: 'Operação Viável',
        description: 'Nenhum gargalo operacional crítico identificado'
      });
    }

    return bottlenecks.slice(0, 4);
  };

  const executionStatus = getExecutionStatus();
  const technicalStatus = getTechnicalStatus();
  const bottlenecks = getBottlenecks();
  const ExecutionIcon = executionStatus.icon;

  return (
    <div className="glass-card rounded-lg shadow-md border border-white/20 p-6 backdrop-blur-md">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Cog className="size-5 text-[#ff6900]" />
          <h2 className="text-lg text-gray-900">Viabilidade Operacional do Empreendimento</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Peso no Score:</span>
          <span className="px-2.5 py-1 bg-[#ff6900]/10 text-[#ff6900] text-sm rounded border border-[#ff6900]/20 font-medium">
            30%
          </span>
        </div>
      </div>

      {/* A. Capacidade de Execução */}
      <div className="mb-6">
        <h3 className="text-sm text-gray-900 mb-3 flex items-center gap-2">
          <span className="w-6 h-6 bg-[#00834c] text-white rounded-full flex items-center justify-center text-xs">A</span>
          Capacidade de Execução
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4 mb-4">
          <div>
            <label className="block text-xs text-gray-600 mb-1.5">Total de Unidades</label>
            <input
              type="number"
              value={data.totalUnits || ''}
              onChange={(e) => updateField('totalUnits', Number(e.target.value))}
              placeholder="120"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#00834c] focus:border-[#00834c] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1.5">Ambientes/Unidade</label>
            <input
              type="number"
              value={data.roomsPerUnit || ''}
              onChange={(e) => updateField('roomsPerUnit', Number(e.target.value))}
              placeholder="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#00834c] focus:border-[#00834c] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1.5">Duração Obra (meses)</label>
            <input
              type="number"
              value={data.workDuration || ''}
              onChange={(e) => updateField('workDuration', Number(e.target.value))}
              placeholder="18"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#00834c] focus:border-[#00834c] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1.5">Meses de Pico</label>
            <input
              type="number"
              value={data.peakMonths || ''}
              onChange={(e) => updateField('peakMonths', Number(e.target.value))}
              placeholder="6"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#00834c] focus:border-[#00834c] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1.5">Multiplicador Pico</label>
            <input
              type="number"
              step="0.1"
              value={data.peakMultiplier || ''}
              onChange={(e) => updateField('peakMultiplier', Number(e.target.value))}
              placeholder="1.5"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#00834c] focus:border-[#00834c] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1.5">Cap. Necessária/Mês</label>
            <input
              type="text"
              value={requiredMonthlyCapacity}
              readOnly
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-700"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1.5">Cap. Disponível/Mês</label>
            <input
              type="number"
              value={data.monthlyCapacityAvailable || ''}
              onChange={(e) => updateField('monthlyCapacityAvailable', Number(e.target.value))}
              placeholder="30"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#00834c] focus:border-[#00834c] outline-none"
            />
          </div>
        </div>

        {/* Alertas de Pico e Concentração */}
        {peakCapacityUtilization > 100 && (
          <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="size-5 text-red-600 mt-0.5 shrink-0" />
              <div>
                <div className="text-sm text-red-900 font-medium">Alerta Crítico: Capacidade Insuficiente no Pico</div>
                <div className="text-xs text-red-700 mt-1">
                  Demanda de pico: {peakMonthlyCapacity} ambientes/mês ({Math.round(peakCapacityUtilization)}% da capacidade).
                  Necessário reforço de {Math.ceil(peakMonthlyCapacity - data.monthlyCapacityAvailable)} ambientes/mês ou revisão de cronograma.
                </div>
              </div>
            </div>
          </div>
        )}

        {hasConcentrationRisk && (
          <div className="mb-4 p-3 bg-amber-50 border-l-4 border-amber-500 rounded-r-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="size-5 text-amber-600 mt-0.5 shrink-0" />
              <div>
                <div className="text-sm text-amber-900 font-medium">Risco de Concentração de Demanda</div>
                <div className="text-xs text-amber-700 mt-1">
                  {Math.round(concentrationRisk * 100)}% da obra concentrada em {data.peakMonths} meses. 
                  Considere escalonamento para evitar sobrecarga operacional.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Indicador Visual */}
        <div 
          className={`
            border-2 rounded-lg p-4
            ${executionStatus.color === 'emerald' ? 'bg-emerald-50 border-emerald-500' : ''}
            ${executionStatus.color === 'amber' ? 'bg-amber-50 border-amber-500' : ''}
            ${executionStatus.color === 'red' ? 'bg-red-50 border-red-500' : ''}
            ${executionStatus.color === 'gray' ? 'bg-gray-50 border-gray-300' : ''}
          `}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ExecutionIcon 
                className={`
                  size-6
                  ${executionStatus.color === 'emerald' ? 'text-emerald-600' : ''}
                  ${executionStatus.color === 'amber' ? 'text-amber-600' : ''}
                  ${executionStatus.color === 'red' ? 'text-red-600' : ''}
                  ${executionStatus.color === 'gray' ? 'text-gray-600' : ''}
                `}
              />
              <div>
                <div 
                  className={`
                    text-sm
                    ${executionStatus.color === 'emerald' ? 'text-emerald-900' : ''}
                    ${executionStatus.color === 'amber' ? 'text-amber-900' : ''}
                    ${executionStatus.color === 'red' ? 'text-red-900' : ''}
                    ${executionStatus.color === 'gray' ? 'text-gray-900' : ''}
                  `}
                >
                  {executionStatus.label}
                </div>
                <div className="text-xs text-gray-600">{executionStatus.message}</div>
              </div>
            </div>
            {data.totalUnits > 0 && (
              <div className="text-right">
                <div className="text-2xl text-gray-900">{Math.round(capacityUtilization)}%</div>
                <div className="text-xs text-gray-600">Utilização</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* B. Estrutura Técnica & Engenharia */}
      <div className="mb-6">
        <h3 className="text-sm text-gray-900 mb-3 flex items-center gap-2">
          <span className="w-6 h-6 bg-[#ff6900] text-white rounded-full flex items-center justify-center text-xs">B</span>
          Estrutura Técnica & Engenharia
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-gray-600 mb-1.5">Capacidade do Engenheiro (un./mês)</label>
            <input
              type="number"
              value={data.engineerCapacity || ''}
              onChange={(e) => updateField('engineerCapacity', Number(e.target.value))}
              placeholder="8"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#00834c] focus:border-[#00834c] outline-none"
            />
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <div className="text-xs text-gray-600 mb-1">Engenheiros Necessários</div>
            <div className="text-2xl text-gray-900">{engineersNeeded}</div>
          </div>

          <div className={`
            border-2 rounded-lg p-3
            ${technicalStatus.color === 'emerald' ? 'bg-emerald-50 border-emerald-500' : ''}
            ${technicalStatus.color === 'amber' ? 'bg-amber-50 border-amber-500' : ''}
            ${technicalStatus.color === 'red' ? 'bg-red-50 border-red-500' : ''}
            ${technicalStatus.color === 'gray' ? 'bg-gray-50 border-gray-300' : ''}
          `}>
            <div className="text-xs text-gray-600 mb-1">Status Operacional</div>
            <div className={`
              text-sm
              ${technicalStatus.color === 'emerald' ? 'text-emerald-900' : ''}
              ${technicalStatus.color === 'amber' ? 'text-amber-900' : ''}
              ${technicalStatus.color === 'red' ? 'text-red-900' : ''}
              ${technicalStatus.color === 'gray' ? 'text-gray-900' : ''}
            `}>
              {technicalStatus.label}
            </div>
          </div>
        </div>
      </div>

      {/* C. Supply & Complexidade */}
      <div className="mb-6">
        <h3 className="text-sm text-gray-900 mb-3 flex items-center gap-2">
          <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">C</span>
          Supply & Complexidade
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs text-gray-700">Complexidade Técnica</label>
              <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded">{data.technicalComplexity}</span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              value={data.technicalComplexity}
              onChange={(e) => updateField('technicalComplexity', Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between mt-1 text-xs text-gray-500">
              <span>Simples</span>
              <span>Muito Complexo</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs text-gray-700">Dependência de Supply</label>
              <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded">{data.supplyDependency}</span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              value={data.supplyDependency}
              onChange={(e) => updateField('supplyDependency', Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between mt-1 text-xs text-gray-500">
              <span>Baixa</span>
              <span>Muito Alta</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs text-gray-700">Risco Logístico</label>
              <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded">{data.logisticalRisk}</span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              value={data.logisticalRisk}
              onChange={(e) => updateField('logisticalRisk', Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between mt-1 text-xs text-gray-500">
              <span>Baixo</span>
              <span>Muito Alto</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs text-gray-700">Grau de Padronização</label>
              <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded">{data.standardization}</span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              value={data.standardization}
              onChange={(e) => updateField('standardization', Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between mt-1 text-xs text-gray-500">
              <span>Customizado</span>
              <span>Muito Padronizado</span>
            </div>
          </div>
        </div>
      </div>

      {/* D. Alerta Operacional */}
      <div>
        <h3 className="text-sm text-gray-900 mb-3 flex items-center gap-2">
          <span className="w-6 h-6 bg-amber-600 text-white rounded-full flex items-center justify-center text-xs">D</span>
          Alerta Operacional
        </h3>
        
        <div className="space-y-2">
          {bottlenecks.map((bottleneck, index) => (
            <div 
              key={index}
              className={`
                border-l-4 rounded-r-lg p-3
                ${bottleneck.severity === 'critical' ? 'bg-red-50 border-red-500' : ''}
                ${bottleneck.severity === 'warning' ? 'bg-amber-50 border-amber-500' : ''}
                ${bottleneck.severity === 'success' ? 'bg-emerald-50 border-emerald-500' : ''}
              `}
            >
              <div className="flex items-start gap-2">
                <AlertTriangle 
                  className={`
                    size-4 mt-0.5 shrink-0
                    ${bottleneck.severity === 'critical' ? 'text-red-600' : ''}
                    ${bottleneck.severity === 'warning' ? 'text-amber-600' : ''}
                    ${bottleneck.severity === 'success' ? 'text-emerald-600' : ''}
                  `}
                />
                <div>
                  <div className="text-sm text-gray-900">{bottleneck.title}</div>
                  <div className="text-xs text-gray-600 mt-0.5">{bottleneck.description}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}