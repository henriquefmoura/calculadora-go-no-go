import React from 'react';
import { Home, TrendingUp } from 'lucide-react';

interface ReformPackage {
  name: string;
  value: number;
  adhesion: number;
  packageType: 'completo' | 'parcial' | 'unitario';
}

interface ReformPackagesProps {
  packages: {
    bathroom: ReformPackage;
    kitchen: ReformPackage;
    livingRoom: ReformPackage;
    bedroom: ReformPackage;
  };
  totalUnits: number;
  onChange: (packages: any) => void;
}

export function ReformPackages({ packages, totalUnits, onChange }: ReformPackagesProps) {
  const updatePackage = (key: string, field: string, value: number | string) => {
    onChange({
      ...packages,
      [key]: {
        ...packages[key as keyof typeof packages],
        [field]: value
      }
    });
  };

  const MAX_REVENUE_PER_UNIT = 80000; // Limite máximo de receita por unidade
  const MAX_TOTAL_ADHESION = 100; // Limite de adesão total entre ambientes

  const calculateRevenue = () => {
    const units = totalUnits || 0;
    let totalRevenue = 0;
    
    // Calcular receita por ambiente
    const bathroomRevenue = (packages.bathroom.value * packages.bathroom.adhesion / 100) * units;
    const kitchenRevenue = (packages.kitchen.value * packages.kitchen.adhesion / 100) * units;
    const livingRoomRevenue = (packages.livingRoom.value * packages.livingRoom.adhesion / 100) * units;
    const bedroomRevenue = (packages.bedroom.value * packages.bedroom.adhesion / 100) * units;
    
    totalRevenue = bathroomRevenue + kitchenRevenue + livingRoomRevenue + bedroomRevenue;
    
    // Aplicar limite de receita por unidade
    const revenuePerUnit = totalRevenue / (units || 1);
    if (revenuePerUnit > MAX_REVENUE_PER_UNIT) {
      totalRevenue = MAX_REVENUE_PER_UNIT * units;
    }
    
    return totalRevenue;
  };

  const getTotalAdhesion = () => {
    return packages.bathroom.adhesion + packages.kitchen.adhesion + 
           packages.livingRoom.adhesion + packages.bedroom.adhesion;
  };

  const totalRevenue = calculateRevenue();
  const totalAdhesion = getTotalAdhesion();
  const revenuePerUnit = totalRevenue / (totalUnits || 1);
  const isOverLimit = revenuePerUnit > MAX_REVENUE_PER_UNIT;
  const isAdhesionOverLimit = totalAdhesion > MAX_TOTAL_ADHESION;

  const PackageCard = ({ 
    title, 
    packageKey, 
    packageData 
  }: { 
    title: string; 
    packageKey: string; 
    packageData: ReformPackage;
  }) => {
    const revenue = (packageData.value * packageData.adhesion / 100) * (totalUnits || 0);
    const hasImpact = packageData.adhesion > 0;

    return (
      <div className="glass-card rounded-lg p-4 hover:shadow-lg transition-shadow duration-300">
        <h4 className="text-sm text-gray-900 mb-3">{title}</h4>
        
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Tipo de Pacote</label>
            <select
              value={packageData.packageType}
              onChange={(e) => updatePackage(packageKey, 'packageType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#00834c] focus:border-[#00834c] outline-none bg-white/50 backdrop-blur-sm"
            >
              <option value="completo">Reforma Completa</option>
              <option value="parcial">Reforma Parcial</option>
              <option value="unitario">Serviço Unitário</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">Valor Médio do Pacote</label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-sm text-gray-500">R$</span>
              <input
                type="number"
                value={packageData.value}
                onChange={(e) => updatePackage(packageKey, 'value', Number(e.target.value))}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#00834c] focus:border-[#00834c] outline-none bg-white/50 backdrop-blur-sm"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-xs text-gray-600 mb-1">Adesão Estimada (%)</label>
            <div className="relative">
              <input
                type="number"
                min="0"
                max="100"
                value={packageData.adhesion}
                onChange={(e) => updatePackage(packageKey, 'adhesion', Number(e.target.value))}
                className={`w-full pr-8 pl-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#00834c] focus:border-[#00834c] outline-none bg-white/50 backdrop-blur-sm ${
                  isAdhesionOverLimit ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              <span className="absolute right-3 top-2 text-sm text-gray-500">%</span>
            </div>
          </div>
          
          <div className="pt-2 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">Receita Estimada:</span>
              <span 
                className={`text-sm text-[#00834c] font-medium transition-all duration-500 ${
                  hasImpact ? 'glow-positive scale-105' : ''
                }`}
              >
                R$ {revenue.toLocaleString('pt-BR')}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="glass-card rounded-lg shadow-md border border-white/20 p-6 backdrop-blur-md">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Home className="size-5 text-[#ff6900]" />
          <h2 className="text-lg text-gray-900">Pacotes de Reforma</h2>
        </div>
        <div className="flex items-center gap-2">
          <TrendingUp className="size-4 text-[#00834c]" />
          <span className="text-xs text-gray-600">Receita Adicional Estimada</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <PackageCard 
          title="Banheiro" 
          packageKey="bathroom" 
          packageData={packages.bathroom}
        />
        <PackageCard 
          title="Cozinha" 
          packageKey="kitchen" 
          packageData={packages.kitchen}
        />
        <PackageCard 
          title="Sala" 
          packageKey="livingRoom" 
          packageData={packages.livingRoom}
        />
        <PackageCard 
          title="Quarto" 
          packageKey="bedroom" 
          packageData={packages.bedroom}
        />
      </div>

      <div className="bg-gradient-to-r from-[#00834c]/10 to-[#00834c]/5 border-l-4 border-[#00834c] rounded-r-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-900 mb-1">Receita Potencial Total do Empreendimento</p>
            <p className="text-xs text-gray-600">
              Baseado em {totalUnits || 0} unidades • Adesão total: {totalAdhesion}%
            </p>
            {isAdhesionOverLimit && (
              <p className="text-xs text-red-600 mt-1">
                ⚠️ Adesão total excede 100% - valores serão limitados
              </p>
            )}
          </div>
          <div className="text-right">
            <div className="text-3xl text-[#00834c]">
              R$ {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </div>
            <div className="text-xs text-gray-600 mt-1">
              Receita/unidade: R$ {revenuePerUnit.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              {isOverLimit && <span className="text-red-600 ml-1">(limitado)</span>}
            </div>
            <div className="text-xs text-gray-500 mt-0.5">
              Limite: R$ {MAX_REVENUE_PER_UNIT.toLocaleString('pt-BR')}/unidade
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}