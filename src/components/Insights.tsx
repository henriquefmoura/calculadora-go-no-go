import React from 'react';
import { AlertOctagon, TrendingUp, CheckSquare } from 'lucide-react';
import { Scores } from '../App';

interface InsightsProps {
  scores: Scores;
}

export function Insights({ scores }: InsightsProps) {
  const getCriticalRisks = () => {
    const risks = [];
    
    // Validação de segurança
    if (!scores || !scores.risk || !scores.financial || !scores.strategy) {
      return [{
        title: 'Aguardando Dados',
        description: 'Configure os critérios de avaliação para visualizar os insights'
      }];
    }
    
    if (scores.risk.legal >= 7) {
      risks.push({
        title: 'Risco Jurídico Elevado',
        description: 'Requer análise jurídica completa antes da aprovação'
      });
    }
    if (scores.risk.default >= 7) {
      risks.push({
        title: 'Alto Risco de Inadimplência',
        description: 'Estabelecer garantias contratuais robustas e modelo de pagamento escalonado'
      });
    }
    if (scores.risk.reputational >= 7) {
      risks.push({
        title: 'Risco Reputacional Significativo',
        description: 'Avaliar histórico da incorporadora e implementar cláusulas de proteção de marca'
      });
    }
    if (scores.risk.operational >= 7) {
      risks.push({
        title: 'Complexidade Operacional Alta',
        description: 'Estruturar equipe dedicada e prever contingências operacionais'
      });
    }
    if (scores.financial.margin < 5) {
      risks.push({
        title: 'Margem Financeira Insuficiente',
        description: 'Renegociar condições comerciais ou reavaliar estrutura de custos'
      });
    }
    
    if (risks.length === 0) {
      risks.push({
        title: 'Perfil de Risco Controlado',
        description: 'Nenhum fator de risco crítico identificado na análise atual'
      });
    }
    
    return risks.slice(0, 3);
  };

  const getOpportunities = () => {
    const opportunities = [];
    
    // Validação de segurança
    if (!scores || !scores.financial || !scores.strategy) {
      return [{
        title: 'Aguardando Análise',
        description: 'Complete os dados para identificar oportunidades'
      }];
    }
    
    if (scores.financial.margin >= 10) {
      opportunities.push({
        title: 'Margem Atrativa',
        description: 'Projeto com rentabilidade acima da média do portfólio'
      });
    }
    if (scores.financial.ticket >= 25000) {
      opportunities.push({
        title: 'Alto Ticket Médio',
        description: 'Potencial de receita significativa por unidade atendida'
      });
    }
    if (scores.financial.ltv >= 20000) {
      opportunities.push({
        title: 'LTV Elevado',
        description: 'Oportunidade de receita recorrente e relacionamento de longo prazo'
      });
    }
    if (scores.strategy.synergy >= 7) {
      opportunities.push({
        title: 'Forte Sinergia Operacional',
        description: 'Aproveitamento de capacidade instalada e competências existentes'
      });
    }
    if (scores.strategy.crossSell >= 7) {
      opportunities.push({
        title: 'Potencial de Cross-sell',
        description: 'Base para expansão de serviços e produtos complementares'
      });
    }
    if (scores.strategy.recurrence >= 7) {
      opportunities.push({
        title: 'Modelo Escalável',
        description: 'Possibilidade de replicação em outros empreendimentos'
      });
    }
    
    if (opportunities.length === 0) {
      opportunities.push({
        title: 'Projeto Estratégico',
        description: 'Oportunidade alinhada com objetivos corporativos de expansão'
      });
    }
    
    return opportunities.slice(0, 3);
  };

  const getSuggestedActions = () => {
    const actions = [];
    
    // Validação de segurança
    if (!scores || !scores.risk || !scores.financial || !scores.strategy) {
      return [{
        priority: 'Baixa',
        action: 'Configurar Análise',
        description: 'Preencha todos os critérios de avaliação para receber recomendações'
      }];
    }
    
    if (scores.risk.legal >= 6) {
      actions.push({
        priority: 'Alta',
        action: 'Due Diligence Jurídica',
        description: 'Conduzir análise completa de contratos, licenças e passivos'
      });
    }
    if (scores.financial.margin < 7) {
      actions.push({
        priority: 'Alta',
        action: 'Revisão Comercial',
        description: 'Renegociar termos contratuais para melhorar viabilidade financeira'
      });
    }
    if (scores.strategy.synergy < 5) {
      actions.push({
        priority: 'Média',
        action: 'Expansão de Rede',
        description: 'Qualificar e homologar parceiros técnicos na região do projeto'
      });
    }
    if (scores.strategy.recurrence < 5) {
      actions.push({
        priority: 'Média',
        action: 'Estratégia de Retenção',
        description: 'Desenvolver programa de fidelização e serviços pós-entrega'
      });
    }
    if (scores.risk.default >= 6) {
      actions.push({
        priority: 'Alta',
        action: 'Estrutura de Garantias',
        description: 'Definir modelo de pagamento com garantias e marcos de validação'
      });
    }
    if (scores.risk.operational >= 7) {
      actions.push({
        priority: 'Alta',
        action: 'Plano de Execução',
        description: 'Criar cronograma detalhado com gestão de complexidade técnica'
      });
    }
    
    if (actions.length === 0) {
      actions.push({
        priority: 'Baixa',
        action: 'Monitoramento Contínuo',
        description: 'Estabelecer KPIs e marcos de acompanhamento ao longo da parceria'
      });
      actions.push({
        priority: 'Baixa',
        action: 'Alinhamento Estratégico',
        description: 'Validar aderência aos objetivos do plano estratégico 2026-2028'
      });
    }
    
    return actions.slice(0, 4);
  };

  const criticalRisks = getCriticalRisks();
  const opportunities = getOpportunities();
  const suggestedActions = getSuggestedActions();

  return (
    <div className="glass-card rounded-lg shadow-md border border-white/20 p-6 backdrop-blur-md">
      <h2 className="text-xl text-gray-900 mb-6">Análise Estratégica</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Critical Risks */}
        <div>
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200">
            <AlertOctagon className="size-5 text-red-600" />
            <h3 className="text-sm text-gray-900">Riscos Críticos</h3>
          </div>
          <div className="space-y-4">
            {criticalRisks.map((risk, index) => (
              <div key={index} className="bg-red-50 border border-red-100 rounded-lg p-3">
                <h4 className="text-sm text-gray-900 mb-1">{risk.title}</h4>
                <p className="text-xs text-gray-600 leading-relaxed">{risk.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Opportunities */}
        <div>
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200">
            <TrendingUp className="size-5 text-[#00834c]" />
            <h3 className="text-sm text-gray-900">Oportunidades</h3>
          </div>
          <div className="space-y-4">
            {opportunities.map((opp, index) => (
              <div key={index} className="bg-[#00834c]/5 border border-[#00834c]/10 rounded-lg p-3">
                <h4 className="text-sm text-gray-900 mb-1">{opp.title}</h4>
                <p className="text-xs text-gray-600 leading-relaxed">{opp.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Suggested Actions */}
        <div>
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200">
            <CheckSquare className="size-5 text-blue-600" />
            <h3 className="text-sm text-gray-900">Ações Sugeridas</h3>
          </div>
          <div className="space-y-3">
            {suggestedActions.map((action, index) => (
              <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm text-gray-900">{action.action}</h4>
                  <span 
                    className={`text-xs px-2 py-0.5 rounded ${
                      action.priority === 'Alta' 
                        ? 'bg-red-100 text-red-700' 
                        : action.priority === 'Média'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {action.priority}
                  </span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">{action.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
