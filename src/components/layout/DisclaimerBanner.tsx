import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const DisclaimerBanner: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="bg-amber-50/90 border-b border-amber-200/80 px-4 py-2 text-xs text-amber-900 no-print">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-700 flex-shrink-0" />
          <span className="font-semibold text-amber-950">MoSJE Guidance Notice:</span>
          <span className="hidden md:inline text-amber-800 line-clamp-1">{t.governmentDisclaimer}</span>
          <span className="md:hidden text-amber-800 line-clamp-1">Indicative planning platform. Subject to official guidelines.</span>
        </div>
      </div>
    </div>
  );
};
