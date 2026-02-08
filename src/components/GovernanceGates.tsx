import React from 'react';
import { ShieldAlert, XOctagon, AlertTriangle } from 'lucide-react';
import { Scores, OperationalData, ReformPackages } from '../App';

interface GovernanceGatesProps {
  scores: Scores;
  operationalData: OperationalData;
  reformPackages: ReformPackages;
}

export function GovernanceGates({ scores, operationalData, reformPackages }: GovernanceGatesProps) {
  // Critérios de NO-GO automático
  const getAutoNoGoGates = () => {
    const gates = [];

    // Validação de segurança
    if (!scores || !scores.financial || !scores.risk || !scores.strategy) {
      return gates;
    }

    // 1. Margem muito baixa
    if (scores.financial.margin < 3) {
      gates.push({
        severity: 'critical',
        gate: 'Margem Insuficiente',
        threshold: '< 3%',
        current: `${scores.financial.margin}%`,
        description: 'Margem abaixo do mínimo aceitável para viabilidade do negócio'
      });
    }

    // 2. Payback muito longo
    if (scores.financial.payback > 24) {
      gates.push({
        severity: 'critical',
        gate: 'Payback Excessivo',
        threshold: '> 24 meses',
        current: `${scores.financial.payback} meses`,
        description: 'Período de retorno incompatível com estratégia de crescimento'
      });
    }

    // 3. Riscos críticos múltiplos
    const criticalRisks = [
      scores.risk.legal,
      scores.risk.default,
      scores.risk.reputational,
      scores.risk.operational
    ].filter(r => r >= 8).length;

    if (criticalRisks >= 2) {
      gates.push({
        severity: 'critical',
        gate: 'Perfil de Risco Elevado',
        threshold: '< 2 riscos críticos',
        current: `${criticalRisks} riscos ≥8`,
        description: 'Múltiplos fatores de risco em nível crítico comprometem viabilidade'
      });
    }

    // 4. Capacidade operacional insuficiente
    const totalRooms = operationalData.totalUnits * operationalData.roomsPerUnit;
    const requiredMonthlyCapacity = operationalData.workDuration > 0 
      ? totalRooms / operationalData.workDuration 
      : 0;
    const peakCapacity = requiredMonthlyCapacity * (operationalData.peakMultiplier || 1.5);
    const peakUtilization = operationalData.monthlyCapacityAvailable > 0
      ? (peakCapacity / operationalData.monthlyCapacityAvailable) * 100
      : 0;

    if (peakUtilization > 150) {
      gates.push({
        severity: 'critical',
        gate: 'Capacidade Operacional Crítica',
        threshold: '≤ 150% no pico',
        current: `${Math.round(peakUtilization)}%`,
        description: 'Demanda de pico excede significativamente a capacidade instalada'
      });
    }

    // 5. LTV muito baixo
    if (scores.financial.ltv < 5000) {
      gates.push({
        severity: 'warning',
        gate: 'LTV Abaixo do Esperado',
        threshold: '≥ R$5.000',
        current: `R$ ${scores.financial.ltv.toLocaleString('pt-BR')}`,
        description: 'Valor de vida do cliente insuficiente para justificar investimento'
      });
    }

    // 6. Baixa aderência estratégica
    if (scores.strategy.adherence <= 3) {
      gates.push({
        severity: 'warning',
        gate: 'Desalinhamento Estratégico',
        threshold: '> 3/10',
        current: `${scores.strategy.adherence}/10`,
        description: 'Projeto não alinhado com diretrizes estratégicas da companhia'
      });
    }

    return gates;
  };

  const gates = getAutoNoGoGates();
  const criticalGates = gates.filter(g => g.severity === 'critical');
  const warningGates = gates.filter(g => g.severity === 'warning');
  const hasAutoNoGo = criticalGates.length > 0;

  return (
    <div className="glass-card rounded-lg shadow-md border border-white/20 p-6 backdrop-blur-md">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <ShieldAlert className="size-5 text-red-600" />
          <h2 className="text-lg text-gray-900">Travas de Governança</h2>
        </div>
        {hasAutoNoGo && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-red-100 border border-red-500 rounded-lg">
            <XOctagon className="size-4 text-red-700" />
            <span className="text-sm text-red-900 font-medium">NO-GO AUTOMÁTICO</span>
          </div>
        )}
      </div>

      {gates.length === 0 ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center shrink-0">
              <span className="text-white text-lg">✓</span>
            </div>
            <div>
              <div className="text-sm text-emerald-900 font-medium">Todas as Travas de Governança Atendidas</div>
              <div className="text-xs text-emerald-700 mt-1">
                Nenhum critério de veto identificado. Projeto pode seguir para análise de score final.
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Critical Gates */}
          {criticalGates.map((gate, index) => (
            <div key={`critical-${index}`} className="bg-red-50 border-2 border-red-500 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <XOctagon className="size-6 text-red-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="text-sm text-red-900 font-medium">{gate.gate}</div>
                      <div className="text-xs text-red-700 mt-1">{gate.description}</div>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-xs text-red-600">Limite: {gate.threshold}</div>
                      <div className="text-sm text-red-900 font-medium">Atual: {gate.current}</div>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-red-200">
                    <div className="text-xs text-red-800 font-medium">
                      ⚠️ CRITÉRIO DE VETO: Esta condição impede aprovação automática do projeto
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Warning Gates */}
          {warningGates.map((gate, index) => (
            <div key={`warning-${index}`} className="bg-amber-50 border border-amber-300 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="size-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-sm text-amber-900 font-medium">{gate.gate}</div>
                      <div className="text-xs text-amber-700 mt-1">{gate.description}</div>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-xs text-amber-600">Esperado: {gate.threshold}</div>
                      <div className="text-sm text-amber-900 font-medium">Atual: {gate.current}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {hasAutoNoGo && (
        <div className="mt-4 p-4 bg-red-100 border-l-4 border-red-600 rounded-r-lg">
          <div className="text-sm text-red-900 font-medium mb-2">
            Ações Necessárias para Reverter NO-GO Automático:
          </div>
          <ul className="space-y-1 text-xs text-red-800">
            {criticalGates.map((gate, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-red-600 mt-0.5">•</span>
                <span>Corrigir "{gate.gate}" através de renegociação comercial ou revisão de premissas</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {warningGates.length > 0 && !hasAutoNoGo && (
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="text-xs text-amber-900">
            <strong>Atenção:</strong> {warningGates.length} alerta(s) identificado(s). 
            Recomenda-se plano de mitigação antes da aprovação final.
          </div>
        </div>
      )}
    </div>
  );
}
