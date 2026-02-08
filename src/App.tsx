import React, { useEffect } from 'react';
import { Building2 } from 'lucide-react';
import { ProjectData } from '../App';

interface ProjectDataFormProps {
  data: ProjectData;
  onChange: (data: ProjectData) => void;
}

export function ProjectDataForm({ data, onChange }: ProjectDataFormProps) {
  const updateField = (field: keyof ProjectData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  useEffect(() => {
    if (data.units) {
      const event = new CustomEvent('unitsChanged', { detail: data.units });
      window.dispatchEvent(event);
    }
  }, [data.units]);

  const inputClasses = `
    w-full px-3 py-2 border border-gray-300 rounded-lg 
    focus:ring-2 focus:ring-[#00834c] focus:border-[#00834c] 
    outline-none transition-colors duration-200
  `;

  const labelClasses = 'block text-sm text-gray-700 mb-1.5 font-medium';

  return (
    <div className="glass-card rounded-lg shadow-md border border-white/20 p-6 backdrop-blur-md">
      <div className="flex items-center gap-2 mb-6">
        <Building2 className="size-5 text-gray-700" />
        <h2 className="text-lg font-semibold text-gray-900">
          Dados do Empreendimento
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Nome do Empreendimento */}
        <div className="lg:col-span-2">
          <label className={labelClasses}>
            Nome do Empreendimento
          </label>
          <input
            type="text"
            value={data.name}
            onChange={(e) => updateField('name', e.target.value)}
            placeholder="Ex: Residencial Vista Mar"
            className={inputClasses}
          />
        </div>

        {/* Incorporadora */}
        <div className="lg:col-span-2">
          <label className={labelClasses}>
            Incorporadora
          </label>
          <input
            type="text"
            value={data.incorporadora}
            onChange={(e) => updateField('incorporadora', e.target.value)}
            placeholder="Ex: Construtora ABC"
            className={inputClasses}
          />
        </div>

        {/* Nome da Loja */}
        <div className="lg:col-span-2">
          <label className={labelClasses}>
            Nome da Loja
          </label>
          <input
            type="text"
            value={data.storeName || ''}
            onChange={(e) => updateField('storeName', e.target.value)}
            placeholder="Ex: Leroy Merlin Morumbi"
            className={inputClasses}
          />
        </div>

        {/* Meses para entrega da chave */}
        <div className="lg:col-span-1">
          <label className={labelClasses}>
            Meses para entrega da chave
          </label>
          <input
            type="number"
            min={0}
            value={data.monthsToKey || ''}
            onChange={(e) => updateField('monthsToKey', e.target.value)}
            placeholder="Ex: 12"
            className={inputClasses}
          />
        </div>

        {/* Padrão do apartamento */}
        <div className="lg:col-span-1">
          <label className={labelClasses}>
            Padrão do apartamento
          </label>
          <select
            value={data.apartmentStandard || 'medio'}
            onChange={(e) => updateField('apartmentStandard', e.target.value)}
            className={inputClasses}
          >
            <option value="baixo">Baixo padrão</option>
            <option value="medio">Médio padrão</option>
            <option value="alto">Alto padrão</option>
          </select>
        </div>

        {/* Cidade */}
        <div className="lg:col-span-1">
          <label className={labelClasses}>
            Cidade
          </label>
          <input
            type="text"
            value={data.city}
            onChange={(e) => updateField('city', e.target.value)}
            placeholder="Ex: São Paulo"
            className={inputClasses}
          />
        </div>

        {/* UF */}
        <div className="lg:col-span-1">
          <label className={labelClasses}>
            UF
          </label>
          <input
            type="text"
            value={data.uf}
            onChange={(e) => updateField('uf', e.target.value)}
            placeholder="Ex: SP"
            maxLength={2}
            className={`${inputClasses} uppercase`}
          />
        </div>

        {/* Tipologia */}
        <div>
          <label className={labelClasses}>
            Tipologia
          </label>
          <select
            value={data.typology}
            onChange={(e) => updateField('typology', e.target.value)}
            className={inputClasses}
          >
            <option value="Residencial">Residencial</option>
            <option value="Misto">Misto</option>
            <option value="Alto Padrão">Alto Padrão</option>
            <option value="Econômico">Econômico</option>
          </select>
        </div>

        {/* Fase do Projeto */}
        <div>
          <label className={labelClasses}>
            Fase do Projeto
          </label>
          <select
            value={data.phase}
            onChange={(e) => updateField('phase', e.target.value)}
            className={inputClasses}
          >
            <option value="Pré-lançamento">Pré-lançamento</option>
            <option value="Lançamento">Lançamento</option>
            <option value="Obra">Obra</option>
            <option value="Pós-obra">Pós-obra</option>
          </select>
        </div>

        {/* VGV Estimado */}
        <div>
          <label className={labelClasses}>
            VGV Estimado (R$)
          </label>
          <input
            type="text"
            value={data.vgv}
            onChange={(e) => updateField('vgv', e.target.value)}
            placeholder="Ex: 50.000.000"
            className={inputClasses}
          />
        </div>

        {/* Número de Unidades */}
        <div>
          <label className={labelClasses}>
            Número de Unidades
          </label>
          <input
            type="text"
            value={data.units}
            onChange={(e) => updateField('units', e.target.value)}
            placeholder="Ex: 120"
            className={inputClasses}
          />
        </div>
      </div>
    </div>
  );
}
}
