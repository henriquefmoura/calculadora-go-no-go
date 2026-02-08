import React, { useState } from "react";
import { ProjectDataForm } from "./components/ProjectDataForm";

// ✅ Este tipo é usado pelo ProjectDataForm
export interface ProjectData {
  name: string;
  incorporadora: string;
  storeName?: string;
  monthsToKey?: string; // manter string p/ input controlar fácil
  apartmentStandard?: "baixo" | "medio" | "alto";
  city: string;
  uf: string;
  typology: string;
  phase: string;
  vgv: string;
  units: string;
}

export default function App() {
  const [projectData, setProjectData] = useState<ProjectData>({
    name: "",
    incorporadora: "",
    storeName: "",
    monthsToKey: "",
    apartmentStandard: "medio",
    city: "",
    uf: "",
    typology: "Residencial",
    phase: "Pré-lançamento",
    vgv: "",
    units: "",
  });

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">
          Calculadora Go/No-Go
        </h1>
        <p className="text-gray-600 mb-6">
          Análise de Parcerias com Incorporadoras - Leroy Merlin Instalações e
          Reformas
        </p>

        <ProjectDataForm data={projectData} onChange={setProjectData} />
      </div>
    </div>
  );
}

