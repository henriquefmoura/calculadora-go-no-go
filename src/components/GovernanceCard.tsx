import React from 'react';
import { Shield, Scale, FileCheck } from 'lucide-react';

export function GovernanceCard() {
  return (
    <div className="glass-card rounded-lg shadow-sm border border-white/20 p-6 backdrop-blur-md">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="size-5 text-gray-700" />
        <h2 className="text-lg text-gray-900">Governança e Metodologia</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex gap-3">
          <div className="shrink-0">
            <Scale className="size-5 text-[#00834c] mt-0.5" />
          </div>
          <div>
            <h3 className="text-sm text-gray-900 mb-1">Modelo de Ponderação</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Financeiro (25%), Operacional (30%), Riscos (20%), Estratégia (15%), Receita de Pacotes (5%), Comunicação (5%). Score final normalizado em escala 0-100.
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="shrink-0">
            <FileCheck className="size-5 text-[#00834c] mt-0.5" />
          </div>
          <div>
            <h3 className="text-sm text-gray-900 mb-1">Critérios de Aprovação</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              GO: Score ≥70 | GO com Ressalvas: 50-69 com plano de mitigação | NO-GO: Score &lt;50
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="shrink-0">
            <Shield className="size-5 text-[#00834c] mt-0.5" />
          </div>
          <div>
            <h3 className="text-sm text-gray-900 mb-1">Alçada de Decisão</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              GO com Ressalvas requer aprovação do comitê executivo. NO-GO pode ser reconsiderado após mitigações.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}