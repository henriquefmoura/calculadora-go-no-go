import React, { useState } from 'react';
import { Info } from 'lucide-react';

interface InfoTooltipProps {
  content: string;
}

export function InfoTooltip({ content }: InfoTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="ml-1 text-gray-400 hover:text-[#00834c] transition-colors"
        type="button"
      >
        <Info className="size-3.5" />
      </button>
      
      {isVisible && (
        <div className="absolute left-0 top-6 z-50 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="absolute -top-1 left-4 w-2 h-2 bg-gray-900 transform rotate-45"></div>
          {content}
        </div>
      )}
    </div>
  );
}
