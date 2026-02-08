import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ProjectDataForm } from './components/ProjectDataForm';
import { MixEmpreendimento, Tipologia } from './components/MixEmpreendimento';
import { MixInstalacoesSimples } from './components/MixInstalacoesSimples';
import { LTVDashboard } from './components/LTVDashboard';
import { EngineeringParameters } from './components/EngineeringParameters';
import { ReformPackages } from './components/ReformPackages';
import { CommercialModel } from './components/CommercialModel';
import { CommunicationPackages } from './components/CommunicationPackages';
import { OperationalViability } from './components/OperationalViability';
import { FinancialViability } from './components/FinancialViability';
import { RiskAssessment } from './components/RiskAssessment';
import { StrategySynergy } from './components/StrategySynergy';
import { GovernanceGates } from './components/GovernanceGates';
import { DecisionResult } from './components/DecisionResult';
import { Insights } from './components/Insights';

export interface ProjectData {
  projectName: string;
  incorporadora: string;
  storeName: string;
  city: string;
  vgv: string;
  units?: number;
  storeName: string;
monthsToKey: string;
apartmentStandard: 'baixo' | 'medio' | 'alto';
}

export interface ReformPackages {
  bathroom: { type: string; value: number; adhesion: number };
  kitchen: { type: string; value: number; adhesion: number };
  livingRoom: { type: string; value: number; adhesion: number };
  bedroom: { type: string; value: number; adhesion: number };
}

export interface OperationalData {
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

export interface CommunicationPackage {
  type: string;
  investment: number;
  expectedReach: number;
}

export interface CommercialModel {
  commissionType: 'percentage' | 'fixed';
  commissionValue: number;
  incentives: string;
  counterparties: string;
}

export interface Scores {
  financial: {
    margin: number;
    ticket: number;
    ltv: number;
    payback: number;
    cac: number;
  };
  risk: {
    legal: number;
    default: number;
    reputational: number;
    operational: number;
    litigationPercentage: number;
  };
  strategy: {
    adherence: number;
    synergy: number;
    recurrence: number;
    crossSell: number;
  };
}

export default function App() {
  const [projectData, setProjectData] = useState<ProjectData>({
    projectName: '',
    incorporadora: '',
    city: '',
    vgv: ''
  });

  const [tipologias, setTipologias] = useState<Tipologia[]>([]);
  const [showResult, setShowResult] = useState(false);
  
  const [reformPackages, setReformPackages] = useState<ReformPackages>({
    bathroom: { type: 'completo', value: 18000, adhesion: 35 },
    kitchen: { type: 'completo', value: 32000, adhesion: 25 },
    livingRoom: { type: 'parcial', value: 15000, adhesion: 30 },
    bedroom: { type: 'parcial', value: 14000, adhesion: 40 }
  });

  const [commercialModel, setCommercialModel] = useState<CommercialModel>({
    commissionType: 'percentage',
    commissionValue: 0,
    incentives: '',
    counterparties: ''
  });

  const [communicationPackage, setCommunicationPackage] = useState<CommunicationPackage>({
    type: 'básico',
    investment: 5000,
    expectedReach: 50
  });

  const [operationalData, setOperationalData] = useState<OperationalData>({
    totalUnits: 0,
    roomsPerUnit: 3,
    workDuration: 12,
    monthlyCapacityNeeded: 0,
    monthlyCapacityAvailable: 25,
    engineerCapacity: 2,
    technicalComplexity: 50,
    supplyDependency: 50,
    logisticalRisk: 50,
    standardization: 50,
    peakMonths: 3,
    peakMultiplier: 1.5
  });

  const [scores, setScores] = useState<Scores>({
    financial: {
      margin: 7.5,
      ticket: 20000,
      ltv: 50,
      payback: 12,
      cac: 500
    },
    risk: {
      legal: 50,
      default: 50,
      reputational: 50,
      operational: 50,
      litigationPercentage: 0
    },
    strategy: {
      adherence: 50,
      synergy: 50,
      recurrence: 50,
      crossSell: 50
    }
  });

  // Calcular receita de reforma
  const calculateReformRevenue = () => {
    const totalUnits = tipologias.reduce((sum, t) => sum + t.quantidade, 0);
    const bathroomRevenue = (reformPackages.bathroom.value * reformPackages.bathroom.adhesion / 100) * totalUnits;
    const kitchenRevenue = (reformPackages.kitchen.value * reformPackages.kitchen.adhesion / 100) * totalUnits;
    const livingRoomRevenue = (reformPackages.livingRoom.value * reformPackages.livingRoom.adhesion / 100) * totalUnits;
    const bedroomRevenue = (reformPackages.bedroom.value * reformPackages.bedroom.adhesion / 100) * totalUnits;
    return bathroomRevenue + kitchenRevenue + livingRoomRevenue + bedroomRevenue;
  };

  // Atualizar totalUnits quando tipologias mudarem
  useEffect(() => {
    const totalUnits = tipologias.reduce((sum, t) => sum + t.quantidade, 0);
    setOperationalData(prev => ({ ...prev, totalUnits }));
    setProjectData(prev => ({ ...prev, units: totalUnits }));
  }, [tipologias]);

  const handleCalculate = () => {
    setShowResult(true);
    // Scroll suave para o resultado
    setTimeout(() => {
      const resultSection = document.getElementById('result-section');
      if (resultSection) {
        resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleSave = () => {
    const data = {
      projectData,
      tipologias,
      reformPackages,
      commercialModel,
      communicationPackage,
      operationalData,
      scores,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analise-gonogo-${projectData.projectName || 'projeto'}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <Header 
          onCalculate={handleCalculate}
          onSave={handleSave}
        />

        <ProjectDataForm 
          data={projectData}
          onChange={setProjectData}
        />

        <MixEmpreendimento 
          tipologias={tipologias}
          onChange={setTipologias}
        />

        <LTVDashboard 
          tipologias={tipologias}
          margemServico={scores.financial.margin}
        />

        <EngineeringParameters 
          tipologias={tipologias}
        />

        {/* Novo Bloco: Mix de Instalações Simples e Margem */}
        <MixInstalacoesSimples />

        <ReformPackages 
          packages={reformPackages}
          onChange={setReformPackages}
          totalUnits={tipologias.reduce((sum, t) => sum + t.quantidade, 0)}
        />

        <CommercialModel 
          data={commercialModel}
          onChange={setCommercialModel}
          reformRevenue={calculateReformRevenue()}
        />

        <CommunicationPackages 
          data={communicationPackage}
          onChange={setCommunicationPackage}
        />

        <OperationalViability 
          data={operationalData}
          onChange={setOperationalData}
        />

        <FinancialViability 
          scores={scores.financial}
          onChange={(financial) => setScores({ ...scores, financial })}
        />

        <RiskAssessment 
          scores={scores.risk}
          onChange={(risk) => setScores({ ...scores, risk })}
        />

        <StrategySynergy 
          scores={scores.strategy}
          onChange={(strategy) => setScores({ ...scores, strategy })}
        />

        <GovernanceGates 
          scores={scores}
          operationalData={operationalData}
          reformPackages={reformPackages}
        />

        {showResult && (
          <div id="result-section">
            <DecisionResult 
              scores={scores}
              projectData={projectData}
              reformPackages={reformPackages}
              operationalData={operationalData}
              communicationPackage={communicationPackage}
              commercialModel={commercialModel}
            />
          </div>
        )}

        <Insights scores={scores} />
      </div>
    </div>
  );
}
