import React from 'react';
import { Building2, ShieldCheck, Heart } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const Footer: React.FC<{ navigate: (r: string) => void }> = ({ navigate }) => {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-24 md:pb-12 border-t border-slate-800 no-print mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-800">
          
          {/* Brand & Mandate */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2 text-white font-bold text-base font-display">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                <Building2 className="w-4 h-4" />
              </div>
              <span>SMART ENTREPRENEUR</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t.tagline}
            </p>
            <div className="pt-2">
              <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-1 rounded-md">
                Agriculture, FoodTech & Rural Dev
              </span>
            </div>
          </div>

          {/* Core Modules */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Core Modules</h4>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => navigate('/assessment')} className="hover:text-emerald-400 transition-colors">Business Assessment</button></li>
              <li><button onClick={() => navigate('/market-intelligence')} className="hover:text-emerald-400 transition-colors">Market Intelligence & GIS</button></li>
              <li><button onClick={() => navigate('/feasibility')} className="hover:text-emerald-400 transition-colors">Feasibility Scoring</button></li>
              <li><button onClick={() => navigate('/financial-planner')} className="hover:text-emerald-400 transition-colors">Financial Structuring</button></li>
              <li><button onClick={() => navigate('/scheme-router')} className="hover:text-emerald-400 transition-colors">Scheme Router</button></li>
            </ul>
          </div>

          {/* Scheme Information */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">MoSJE Concessional Credit</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>Micro Finance Scheme (≤ ₹1.40L at 6.5% p.a.)</li>
              <li>Term Loan Scheme (&gt; ₹1.40L to ₹50L at 8.0% p.a.)</li>
              <li>10% Beneficiary Margin Equity Rule</li>
              <li>Moratorium Period (3 to 6 Months)</li>
              <li>SC / OBC / EBC / DNT Concessions</li>
            </ul>
          </div>

          {/* Disclaimers & Ethics */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Transparency & Ethics</span>
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              This platform provides deterministic financial modeling, verified market indicators, and AI advisory to empower grassroots decision-makers before debt exposure.
            </p>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 Smart Entrepreneur Guidance Platform. MoSJE Initiative.</p>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/settings')} className="hover:text-slate-300">Privacy Policy</button>
            <button onClick={() => navigate('/settings')} className="hover:text-slate-300">Data Protection</button>
            <span className="flex items-center gap-1 text-slate-400">
              Built with <Heart className="w-3 h-3 text-red-500 inline fill-red-500" /> for Rural India
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
