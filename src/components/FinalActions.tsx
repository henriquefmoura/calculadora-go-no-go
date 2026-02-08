import React from 'react';
import { FileDown, Share2, Shield } from 'lucide-react';
import { Scores, ProjectData } from '../App';

interface FinalActionsProps {
  scores: Scores;
  projectData: ProjectData;
}

export function FinalActions({ scores, projectData }: FinalActionsProps) {
  const handleExportPDF = () => {
    alert('Funcionalidade de exportação em PDF será implementada.');
  };

  const handleShare = () => {
    alert('Relatório compartilhado com o comitê executivo.');
  };

  const handleMitigationPlan = () => {
    alert('Criando plano de mitigação de riscos...');
  };

  return (
    <div className="glass-card rounded-lg shadow-md border border-white/20 p-6 backdrop-blur-md">
      <h2 className="text-lg text-gray-900 mb-5">Próximos Passos</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={handleExportPDF}
          className="flex items-center justify-center gap-3 px-6 py-4 bg-gray-50 hover:bg-gray-100 border border-gray-300 rounded-lg transition-colors text-gray-700"
        >
          <FileDown className="size-5" />
          <span>Exportar PDF</span>
        </button>

        <button
          onClick={handleShare}
          className="flex items-center justify-center gap-3 px-6 py-4 bg-[#00834c] hover:bg-[#006b3f] border border-[#00834c] rounded-lg transition-colors text-white"
        >
          <Share2 className="size-5" />
          <span>Compartilhar com Comitê</span>
        </button>

        <button
          onClick={handleMitigationPlan}
          className="flex items-center justify-center gap-3 px-6 py-4 bg-[#ff6900] hover:bg-[#e55f00] border border-[#ff6900] rounded-lg transition-colors text-white"
        >
          <Shield className="size-5" />
          <span>Criar Plano de Mitigação</span>
        </button>
      </div>
    </div>
  );
}