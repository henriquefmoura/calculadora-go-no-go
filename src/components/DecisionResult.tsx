import React from 'react';
import { CheckCircle2, AlertCircle, XCircle, DollarSign } from 'lucide-react';
import { Scores, ProjectData, ReformPackages, OperationalData, CommunicationPackage, CommercialModel } from '../App';
import { GaugeChart } from './GaugeChart';

interface DecisionResultProps {
  scores: Scores;
  projectData: ProjectData;
  reformPackages: ReformPackages;
  operationalData: OperationalData;
  communicationPackage: CommunicationPackage;
  commercialModel: CommercialModel;
}

export function DecisionResult({ scores, projectData, reformPackages, operationalData, communicationPackage, commercialModel }: DecisionResultProps) {
  // Calculate reform packages revenue impact with limits
  const MAX_REVENUE_PER_UNIT = 80000;
  
  const calculateReformRevenue = () => {
    const units = Number(projectData.units) || 0;
    const bathroomRevenue = (reformPackages.bathroom.value * reformPackages.bathroom.adhesion / 100) * units;
    const kitchenRevenue = (reformPackages.kitchen.value * reformPackages.kitchen.adhesion / 100) * units;
    const livingRoomRevenue = (reformPackages.livingRoom.value * reformPackages.livingRoom.adhesion / 100) * units;
    const bedroomRevenue = (reformPackages.bedroom.value * reformPackages.bedroom.adhesion / 100) * units;
    
    let totalRevenue = bathroomRevenue + kitchenRevenue + livingRoomRevenue + bedroomRevenue;
    
    // Apply per-unit limit
    const revenuePerUnit = totalRevenue / (units || 1);
    if (revenuePerUnit > MAX_REVENUE_PER_UNIT) {
      totalRevenue = MAX_REVENUE_PER_UNIT * units;
    }
    
    return totalRevenue;
  };

  const grossReformRevenue = calculateReformRevenue();
  
  // Calculate commission
  const calculateCommission = () => {
    if (commercialModel.commissionType === 'percentage') {
      return (grossReformRevenue * commercialModel.commissionValue) / 100;
    }
    return commercialModel.commissionValue * (Number(projectData.units) || 0);
  };

  const commission = calculateCommission();
  const netReformRevenue = grossReformRevenue - commission;
  
  // Reform revenue impact on score (based on NET revenue)
  const revenuePerUnit = netReformRevenue / (Number(projectData.units) || 1);
  const reformRevenueScore = Math.min(10, (revenuePerUnit / 10000) * 10);

  // Check for auto NO-GO conditions
  const hasAutoNoGo = () => {
    if (scores.financial.margin < 3) return true;
    if (scores.financial.payback > 24) return true;
    
    const criticalRisks = [
      scores.risk.legal,
      scores.risk.default,
      scores.risk.reputational,
      scores.risk.operational
    ].filter(r => r >= 8).length;
    if (criticalRisks >= 2) return true;
    
    const totalRooms = operationalData.totalUnits * operationalData.roomsPerUnit;
    const requiredMonthlyCapacity = operationalData.workDuration > 0 
      ? totalRooms / operationalData.workDuration 
      : 0;
    const peakCapacity = requiredMonthlyCapacity * (operationalData.peakMultiplier || 1.5);
    const peakUtilization = operationalData.monthlyCapacityAvailable > 0
      ? (peakCapacity / operationalData.monthlyCapacityAvailable) * 100
      : 0;
    if (peakUtilization > 150) return true;
    
    return false;
  };

  const autoNoGo = hasAutoNoGo();

  // Commercial renegotiation needed
  const needsRenegotiation = commission / grossReformRevenue > 0.15 || scores.financial.margin < 7;

  // Operational Viability Consolidated Score
  const calculateOperationalScore = () => {
    // A. Execution Capacity (40%)
    const totalRooms = operationalData.totalUnits * operationalData.roomsPerUnit;
    const requiredMonthlyCapacity = operationalData.workDuration > 0 ? totalRooms / operationalData.workDuration : 0;
    const capacityUtilization = operationalData.monthlyCapacityAvailable > 0 
      ? (requiredMonthlyCapacity / operationalData.monthlyCapacityAvailable) 
      : 0;
    
    let executionScore = 10;
    if (capacityUtilization > 1.0) executionScore = 3;
    else if (capacityUtilization > 0.85) executionScore = 6;
    else if (capacityUtilization > 0.7) executionScore = 8;
    
    // B. Technical Structure (30%)
    const engineersNeeded = operationalData.totalUnits && operationalData.workDuration && operationalData.engineerCapacity
      ? Math.ceil(operationalData.totalUnits / (operationalData.engineerCapacity * operationalData.workDuration))
      : 0;
    
    let technicalScore = 5;
    if (engineersNeeded > 0) {
      const workloadPerEngineer = operationalData.totalUnits / engineersNeeded;
      const optimalWorkload = operationalData.engineerCapacity * operationalData.workDuration;
      const utilization = workloadPerEngineer / optimalWorkload;
      
      if (utilization <= 0.8) technicalScore = 10;
      else if (utilization <= 1.0) technicalScore = 7;
      else technicalScore = 4;
    }
    
    // C. Supply & Complexity (30%)
    const complexityScore = 10 - operationalData.technicalComplexity; // Inverted
    const supplyScore = 10 - operationalData.supplyDependency; // Inverted
    const logisticsScore = 10 - operationalData.logisticalRisk; // Inverted
    const standardizationScore = operationalData.standardization; // Higher is better
    
    const supplyComplexityScore = (complexityScore + supplyScore + logisticsScore + standardizationScore) / 4;
    
    // Weighted average
    const consolidatedScore = (
      executionScore * 0.40 +
      technicalScore * 0.30 +
      supplyComplexityScore * 0.30
    );
    
    return consolidatedScore;
  };

  const operationalScore = calculateOperationalScore();

  // Communication package impact
  const communicationScore = () => {
    if (!communicationPackage) return 5; // Neutral
    if (communicationPackage === 'basic') return 6;
    if (communicationPackage === 'standard') return 8;
    if (communicationPackage === 'premium') return 10;
    return 5;
  };

  const commScore = communicationScore();
  
  // Normalize financial scores to 0-10 scale for calculation
  const normalizeMargin = (margin: number) => (margin / 15) * 10; // 0-15% -> 0-10
  const normalizeTicket = (ticket: number) => ((ticket - 2000) / (40000 - 2000)) * 10; // 2k-40k -> 0-10
  const normalizeLTV = (ltv: number) => (ltv / 30000) * 10; // 0-30k -> 0-10
  const normalizePayback = (payback: number) => Math.max(0, 10 - (payback / 36) * 10); // Lower is better
  const normalizeCAC = (cac: number) => Math.max(0, 10 - (cac / 5000) * 10); // Lower is better

  // Calculate weighted scores
  const financialScore = (
    normalizeMargin(scores.financial.margin) +
    normalizeTicket(scores.financial.ticket) +
    normalizeLTV(scores.financial.ltv) +
    normalizePayback(scores.financial.payback) +
    normalizeCAC(scores.financial.cac)
  ) / 5;

  // Risk is inverted - lower risk is better
  const riskScore = 10 - (
    scores.risk.legal +
    scores.risk.default +
    scores.risk.reputational +
    scores.risk.operational
  ) / 4;

  const strategyScore = (
    scores.strategy.adherence +
    scores.strategy.synergy +
    scores.strategy.recurrence +
    scores.strategy.crossSell
  ) / 4;

  // Weighted average with operational consolidated
  // Financial 25%, Operational 30%, Risk 20%, Strategy 15%, Reform Revenue 5%, Communication 5%
  const finalScore = Math.round(
    (financialScore * 0.25 + 
     operationalScore * 0.30 + 
     riskScore * 0.20 + 
     strategyScore * 0.15 + 
     reformRevenueScore * 0.05 +
     commScore * 0.05) * 10
  );

  const getDecision = () => {
    if (autoNoGo) return { type: 'NO-GO AUTOMÁTICO', color: 'red', icon: XCircle };
    if (finalScore >= 70) return { type: 'GO', color: 'leroy-green', icon: CheckCircle2 };
    if (finalScore >= 50) return { type: 'GO COM RESSALVAS', color: 'leroy-orange', icon: AlertCircle };
    return { type: 'NO-GO', color: 'red', icon: XCircle };
  };

  const decision = getDecision();
  const Icon = decision.icon;

  const getExplanation = () => {
    const factors = [];
    
    if (financialScore >= 7) factors.push('viabilidade financeira sólida');
    if (operationalScore >= 7) factors.push('forte capacidade operacional');
    if (riskScore >= 7) factors.push('baixo perfil de risco');
    if (strategyScore >= 7) factors.push('alta aderência estratégica');
    
    if (financialScore < 5) factors.push('viabilidade financeira comprometida');
    if (operationalScore < 5) factors.push('limitações operacionais');
    if (riskScore < 5) factors.push('alto perfil de risco');
    if (strategyScore < 5) factors.push('baixa aderência estratégica');

    if (factors.length === 0) factors.push('indicadores moderados em todas as dimensões');

    return `Esta decisão foi classificada como ${decision.type} principalmente devido a ${factors.slice(0, 2).join(' e ')}.`;
  };

  const getConditionals = () => {
    if (finalScore < 50) return null;
    if (finalScore >= 70) return null;

    const conditionals = [];
    
    if (scores.risk.legal >= 6) {
      conditionals.push('Aprovação jurídica com due diligence completa');
    }
    if (scores.risk.default >= 6) {
      conditionals.push('Estabelecimento de garantias contratuais robustas');
    }
    if (scores.financial.margin < 7) {
      conditionals.push('Revisão e otimização da estrutura de custos');
    }
    if (scores.operational.partners < 5) {
      conditionals.push('Qualificação prévia de rede de parceiros na região');
    }
    if (scores.operational.complexity >= 7) {
      conditionals.push('Plano de execução detalhado com marcos de validação');
    }
    if (riskScore < 5) {
      conditionals.push('Plano de mitigação de riscos aprovado pelo comitê');
    }

    return conditionals.slice(0, 4);
  };

  const conditionals = getConditionals();

  return (
    <div className="glass-card rounded-lg shadow-xl border border-white/20 p-8 backdrop-blur-md">
      <h2 className="text-xl text-gray-900 mb-6">Resultado da Decisão</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        {/* Gauge Chart */}
        <div className="md:col-span-1 flex items-center justify-center">
          <GaugeChart value={finalScore} />
        </div>

        {/* Decision Card */}
        <div className="md:col-span-2 flex items-center justify-center">
          <div 
            className={`
              px-8 py-6 rounded-xl flex items-center gap-4 border-2 backdrop-blur-sm
              ${decision.color === 'leroy-green' ? 'bg-[#00834c]/10 border-[#00834c]' : ''}
              ${decision.color === 'leroy-orange' ? 'bg-[#ff6900]/10 border-[#ff6900]' : ''}
              ${decision.color === 'red' ? 'bg-red-50 border-red-500' : ''}
            `}
          >
            <Icon 
              className={`
                size-12
                ${decision.color === 'leroy-green' ? 'text-[#00834c]' : ''}
                ${decision.color === 'leroy-orange' ? 'text-[#ff6900]' : ''}
                ${decision.color === 'red' ? 'text-red-600' : ''}
              `}
            />
            <div>
              <div className="text-xs text-gray-600 mb-1">Decisão Recomendada</div>
              <div 
                className={`
                  text-2xl font-medium
                  ${decision.color === 'leroy-green' ? 'text-[#00834c]' : ''}
                  ${decision.color === 'leroy-orange' ? 'text-[#ff6900]' : ''}
                  ${decision.color === 'red' ? 'text-red-700' : ''}
                `}
              >
                {decision.type}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Breakdown */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-xs text-gray-600 mb-1">Viabilidade Financeira</div>
          <div className="text-2xl text-gray-900">{Math.round(financialScore * 10)}</div>
        </div>
        <div className="bg-[#ff6900]/5 border border-[#ff6900]/20 rounded-lg p-4">
          <div className="text-xs text-gray-600 mb-1">Viabilidade Operacional</div>
          <div className="text-2xl text-[#ff6900]">{Math.round(operationalScore * 10)}</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-xs text-gray-600 mb-1">Gestão de Riscos</div>
          <div className="text-2xl text-gray-900">{Math.round(riskScore * 10)}</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-xs text-gray-600 mb-1">Alinhamento Estratégico</div>
          <div className="text-2xl text-gray-900">{Math.round(strategyScore * 10)}</div>
        </div>
      </div>

      {/* Revenue Breakdown: Gross vs Net */}
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg">
        <div className="flex items-center gap-2 mb-3">
          <DollarSign className="size-5 text-blue-700" />
          <h3 className="text-sm text-blue-900 font-medium">Análise de Receita: Bruta vs Líquida</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <div className="text-xs text-blue-700 mb-1">Receita Bruta (Pacotes)</div>
            <div className="text-lg text-blue-900 font-medium">
              R$ {grossReformRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
            </div>
          </div>
          <div>
            <div className="text-xs text-red-700 mb-1">Comissão Construtora</div>
            <div className="text-lg text-red-900 font-medium">
              - R$ {commission.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
            </div>
            <div className="text-xs text-red-600">
              {commercialModel.commissionType === 'percentage' 
                ? `${commercialModel.commissionValue}% da receita`
                : `R$ ${commercialModel.commissionValue}/unidade`
              }
            </div>
          </div>
          <div>
            <div className="text-xs text-[#00834c] mb-1">Receita Líquida</div>
            <div className="text-lg text-[#00834c] font-medium">
              R$ {netReformRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-600 mb-1">Impacto da Comissão</div>
            <div className={`text-lg font-medium ${
              commission / grossReformRevenue > 0.2 ? 'text-red-600' : 
              commission / grossReformRevenue > 0.15 ? 'text-amber-600' : 
              'text-gray-900'
            }`}>
              {((commission / grossReformRevenue) * 100).toFixed(1)}%
            </div>
          </div>
        </div>
      </div>

      {/* New Strategic Factors */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#00834c]/5 border border-[#00834c]/20 rounded-lg p-4">
          <div className="text-xs text-gray-600 mb-1">Score de Receita Líquida</div>
          <div className="flex items-end justify-between">
            <div className="text-2xl text-[#00834c]">{Math.round(reformRevenueScore * 10)}</div>
            <div className="text-xs text-gray-600">
              R$ {revenuePerUnit.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}/unidade
            </div>
          </div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-xs text-gray-600 mb-1">Pacote de Comunicação</div>
          <div className="text-2xl text-blue-600">{Math.round(commScore * 10)}</div>
        </div>
      </div>

      {/* Auto NO-GO Warning */}
      {autoNoGo && (
        <div className="mt-6 p-4 bg-red-100 border-2 border-red-600 rounded-lg">
          <div className="flex items-start gap-3">
            <XCircle className="size-6 text-red-700 shrink-0" />
            <div>
              <div className="text-sm text-red-900 font-medium mb-2">
                NO-GO AUTOMÁTICO - Travas de Governança Acionadas
              </div>
              <div className="text-xs text-red-800">
                Uma ou mais condições críticas de veto foram identificadas. 
                O projeto não pode ser aprovado sem renegociação comercial ou revisão substancial de premissas.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Renegotiation Alert */}
      {needsRenegotiation && !autoNoGo && (
        <div className="mt-4 p-4 bg-amber-50 border-l-4 border-amber-500 rounded-r-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="size-5 text-amber-600 mt-0.5 shrink-0" />
            <div>
              <div className="text-sm text-amber-900 font-medium mb-1">
                GO Condicionado à Renegociação Comercial
              </div>
              <div className="text-xs text-amber-800">
                {commission / grossReformRevenue > 0.15 && (
                  <p>• Comissão acima de 15% impacta significativamente a margem líquida</p>
                )}
                {scores.financial.margin < 7 && (
                  <p>• Margem abaixo de 7% requer otimização de estrutura de custos</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Explanation */}
      <div className="mt-6 p-4 bg-[#00834c]/5 border border-[#00834c]/20 rounded-lg">
        <p className="text-sm text-gray-700">{getExplanation()}</p>
      </div>

      {/* Conditionals for GO with Conditions */}
      {conditionals && conditionals.length > 0 && (
        <div className="mt-4 p-4 bg-amber-50 border-l-4 border-[#ff6900] rounded-r-lg">
          <h3 className="text-sm text-gray-900 mb-3">
            Condicionantes para Aprovação:
          </h3>
          <ul className="space-y-2">
            {conditionals.map((condition, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-[#ff6900] mt-1 shrink-0">▪</span>
                <span>{condition}</span>
              </li>
            ))}
          </ul>
          <p className="text-xs text-gray-600 mt-3 pt-3 border-t border-amber-200">
            O atendimento a estas condições é mandatório para aprovação pelo comitê executivo.
          </p>
        </div>
      )}
    </div>
  );
}