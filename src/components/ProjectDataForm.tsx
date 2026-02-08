import React from "react";
import { Building2 } from "lucide-react";
import { ProjectData } from "../App";

interface ProjectDataFormProps {
  data: ProjectData;
  onChange: (data: ProjectData) => void;
}

export function ProjectDataForm({ data, onChange }: ProjectDataFormProps) {
  const updateField = (field: keyof ProjectData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  React.useEffect(() => {
    if (data.units) {
      const event = new CustomEvent("unitsChanged", { detail: data.units });
      window.dispatchEvent(event);
    }
  }, [data.units]);

  return (
    <div className="glass-card rounded-lg shadow-md border border-white/20 p-6 backdrop-blur-md">
      <div className="flex items-center gap-2 mb-5">
        <Building2 className="size-5 text-gray-700" />
        <h2 className="text-lg text-gray-900">Dados do Empreendimento</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-2">
          <label className="block text-sm text-gray-700 mb-1.5">
            Nome do Empreendimento
          </label>
          <input
            type="text"
            value={data.name}
            onChange={(e) => updateField("name", e.target.value)}
            placeholder="Ex: Residencial Vista Mar"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00834c] focus:border-[#00834c] outline-none"
          />
        </div>

        <div className="lg:col-span-2">
          <label className="block text-sm text-gray-700 mb-1.5">
            Incorporadora
          </label>
          <input
            type="text"
            value={data.incorporadora}
            onChange={(e) => updateField("incorporadora", e.target.value)}
            placeholder="Ex: Construtora ABC"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00834c] focus:border-[#00834c] outline-none"
          />
        </div>

        <div className="lg:col-span-2">
          <label className="block text-sm text-gray-700 mb-1.5">
            Nome da Loja
          </label>
          <input
            type="text"
            value={data.storeName || ""}
            onChange={(e) => updateField("storeName", e.target.value)}
            placeholder="Ex: Leroy Merlin Morumbi"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00834c] focus:border-[#00834c] outline-none"
          />
        </div>

        <div className="lg:col-span-1">
          <label className="block text-sm text-gray-700 mb-1.5">
            Meses para entrega da chave
          </label>
          <input
            type="number"
            min={0}
            value={data.monthsToKey || ""}
            onChange={(e) => updateField("monthsToKey", e.target.value)}
            placeholder="Ex: 12"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00834c] focus:border-[#00834c] outline-none"
          />
        </div>

        <div className="lg:col-span-1">
          <label className="block text-sm text-gray-700 mb-1.5">
            Padrão do apartamento
          </label>
          <select
            value={data.apartmentStandard || "medio"}
            onChange={(e) => updateField("apartmentStandard", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00834c] focus:border-[#00834c] outline-none"
          >
            <option value="baixo">Baixo padrão</option>
            <option value="medio">Médio padrão</option>
            <option value="alto">Alto padrão</option>
          </select>
        </div>

        <div className="lg:col-span-1">
          <label className="block text-sm text-gray-700 mb-1.5">Cidade</label>
          <input
            type="text"
            value={data.city}
            onChange={(e) => updateField("city", e.target.value)}
            placeholder="Ex: São Paulo"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00834c] focus:border-[#00834c] outline-none"
          />
        </div>

        <div className="lg:col-span-1">
          <label className="block text-sm text-gray-700 mb-1.5">UF</label>
          <input
            type="text"
            value={data.uf}
            onChange={(e) => updateField("uf", e.target.value)}
            placeholder="Ex: SP"
            maxLength={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00834c] focus:border-[#00834c] outline-none uppercase"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1.5">
            Tipologia
          </label>
          <select
            value={data.typology}
            onChange={(e) => updateField("typology", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00834c] focus:border-[#00834c] outline-none"
          >
            <option value="Residencial">Residencial</option>
            <option value="Misto">Misto</option>
            <option value="Alto Padrão">Alto Padrão</option>
            <option value="Econômico">Econômico</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1.5">
            Fase do Projeto
          </label>
          <select
            value={data.phase}
            onChange={(e) => updateField("phase", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00834c] focus:border-[#00834c] outline-none"
          >
            <option value="Pré-lançamento">Pré-lançamento</option>
            <option value="Lançamento">Lançamento</option>
            <option value="Obra">Obra</option>
            <option value="Pós-obra">Pós-obra</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1.5">
            VGV Estimado (R$)
          </label>
          <input
            type="text"
            value={data.vgv}
            onChange={(e) => updateField("vgv", e.target.value)}
            placeholder="Ex: 50.000.000"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00834c] focus:border-[#00834c] outline-none"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1.5">
            Número de Unidades
          </label>
          <input
            type="text"
            value={data.units}
            onChange={(e) => updateField("units", e.target.value)}
            placeholder="Ex: 120"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00834c] focus:border-[#00834c] outline-none"
          />
        </div>
      </div>
    </div>
  );
}
