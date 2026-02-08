import React from 'react';
import { Megaphone, Check } from 'lucide-react';

type PackageType = 'basic' | 'standard' | 'premium' | null;

interface CommunicationPackagesProps {
  selectedPackage: PackageType;
  onChange: (packageType: PackageType) => void;
}

export function CommunicationPackages({ selectedPackage, onChange }: CommunicationPackagesProps) {
  const packages = [
    {
      id: 'basic' as PackageType,
      name: 'Basic',
      value: 20000,
      description: 'Comunicação essencial',
      features: [
        'Material de ponto de venda',
        'Folhetos informativos',
        'Sinalização básica',
        'Suporte por email'
      ]
    },
    {
      id: 'standard' as PackageType,
      name: 'Standard',
      value: 45000,
      description: 'Comunicação completa',
      features: [
        'Tudo do Basic',
        'Stand customizado',
        'Material digital',
        'Campanha de email marketing',
        'Gerente de conta dedicado'
      ],
      popular: true
    },
    {
      id: 'premium' as PackageType,
      name: 'Premium',
      value: 85000,
      description: 'Solução 360º',
      features: [
        'Tudo do Standard',
        'Evento de lançamento',
        'Campanha em redes sociais',
        'Vídeo institucional',
        'App personalizado',
        'Assessoria estratégica'
      ]
    }
  ];

  const selectedPackageData = packages.find(p => p.id === selectedPackage);

  return (
    <div className="glass-card rounded-lg shadow-md border border-white/20 p-6 backdrop-blur-md">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Megaphone className="size-5 text-[#00834c]" />
          <h2 className="text-lg text-gray-900">Pacotes de Comunicação</h2>
        </div>
        {selectedPackageData && (
          <div className="text-right">
            <div className="text-xs text-gray-600">Receita Adicional</div>
            <div className="text-lg text-[#00834c]">
              R$ {selectedPackageData.value.toLocaleString('pt-BR')}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            onClick={() => onChange(selectedPackage === pkg.id ? null : pkg.id)}
            className={`
              relative border-2 rounded-lg p-5 cursor-pointer transition-all duration-300
              glass-card backdrop-blur-sm
              ${selectedPackage === pkg.id 
                ? 'border-[#00834c] bg-[#00834c]/5 shadow-lg scale-105' 
                : 'border-gray-200 hover:border-gray-300 hover:shadow-md hover:scale-102'
              }
            `}
          >
            {pkg.popular && (
              <div className="absolute -top-3 right-4 bg-[#ff6900] text-white text-xs px-3 py-1 rounded-full">
                Mais Popular
              </div>
            )}
            
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-lg text-gray-900">{pkg.name}</h3>
                <p className="text-xs text-gray-600">{pkg.description}</p>
              </div>
              {selectedPackage === pkg.id && (
                <div className="bg-[#00834c] rounded-full p-1">
                  <Check className="size-4 text-white" />
                </div>
              )}
            </div>

            <div className="mb-4">
              <div className="text-2xl text-gray-900">
                R$ {(pkg.value / 1000).toFixed(0)}k
              </div>
              <div className="text-xs text-gray-500">por empreendimento</div>
            </div>

            <ul className="space-y-2">
              {pkg.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2 text-xs text-gray-700">
                  <Check className="size-3.5 text-[#00834c] mt-0.5 shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {!selectedPackage && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-900">
            Selecione um pacote de comunicação para adicionar receita estratégica ao projeto
          </p>
        </div>
      )}

      {selectedPackage && (
        <div className="bg-[#00834c]/10 border border-[#00834c]/20 rounded-lg p-3">
          <p className="text-sm text-gray-900">
            <strong>Pacote {selectedPackageData?.name}</strong> selecionado • Receita adicional de R$ {selectedPackageData?.value.toLocaleString('pt-BR')} será incluída no cálculo do score final
          </p>
        </div>
      )}
    </div>
  );
}