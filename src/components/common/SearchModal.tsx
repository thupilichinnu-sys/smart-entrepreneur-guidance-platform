import React, { useState } from 'react';
import { Search, X, ArrowRight, Building2, Landmark, Calculator, FileCheck } from 'lucide-react';
import { BUSINESS_CATEGORIES } from '../../data/businessCatalog';
import { ALL_SCHEMES } from '../../data/schemeRules';
import { useAuth } from '../../context/AuthContext';
import { businessService } from '../../services/businessService';

export const SearchModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  navigate: (route: string) => void;
}> = ({ isOpen, onClose, navigate }) => {
  const [query, setQuery] = useState('');
  const { user } = useAuth();

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();
  const savedPlans = user ? businessService.getSavedPlans(user.id) : [];

  const filteredCategories = BUSINESS_CATEGORIES.filter(c => 
    c.name.toLowerCase().includes(q) || c.category.toLowerCase().includes(q) || c.tagline.toLowerCase().includes(q)
  );

  const filteredSchemes = ALL_SCHEMES.filter(s =>
    s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)
  );

  const filteredPlans = savedPlans.filter(p =>
    p.businessName.toLowerCase().includes(q) || p.location.toLowerCase().includes(q)
  );

  const handleSelect = (route: string) => {
    navigate(route);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-start justify-center p-4 pt-16 sm:pt-24 text-center">
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={onClose} />

        <div className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-2xl z-10 border border-slate-200">
          
          {/* Search Input Box */}
          <div className="relative p-4 border-b border-slate-100 flex items-center gap-3">
            <Search className="w-5 h-5 text-slate-400" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search businesses, schemes, saved plans, or tools..."
              className="w-full text-base font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
            <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Results */}
          <div className="p-4 max-h-96 overflow-y-auto space-y-4 divide-y divide-slate-100">
            {/* Quick Tools */}
            {!q && (
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Quick Navigation</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <button onClick={() => handleSelect('/assessment')} className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 font-semibold text-left">
                    Assessment
                  </button>
                  <button onClick={() => handleSelect('/financial-planner')} className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 font-semibold text-left">
                    Finance Planner
                  </button>
                  <button onClick={() => handleSelect('/scheme-router')} className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 font-semibold text-left">
                    Scheme Router
                  </button>
                  <button onClick={() => handleSelect('/ai-advisor')} className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 font-semibold text-left">
                    SmartGuide AI
                  </button>
                </div>
              </div>
            )}

            {/* Business Sectors */}
            {filteredCategories.length > 0 && (
              <div className="space-y-2 pt-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Business Sectors</span>
                <div className="space-y-1">
                  {filteredCategories.slice(0, 4).map(c => (
                    <button
                      key={c.id}
                      onClick={() => handleSelect(`/assessment`)}
                      className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 text-xs text-left group"
                    >
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-emerald-600" />
                        <div>
                          <p className="font-semibold text-slate-800">{c.name}</p>
                          <p className="text-[11px] text-slate-400">{c.category}</p>
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-emerald-600 transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Schemes */}
            {filteredSchemes.length > 0 && (
              <div className="space-y-2 pt-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Government Schemes</span>
                <div className="space-y-1">
                  {filteredSchemes.map(s => (
                    <button
                      key={s.id}
                      onClick={() => handleSelect('/scheme-router')}
                      className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 text-xs text-left group"
                    >
                      <div className="flex items-center gap-2">
                        <Landmark className="w-4 h-4 text-blue-600" />
                        <div>
                          <p className="font-semibold text-slate-800">{s.name}</p>
                          <p className="text-[11px] text-slate-400">Up to ₹{(s.maxLoanAmount / 100000).toFixed(2)} Lakh at {s.interestRate}%</p>
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-600 transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Saved Plans */}
            {filteredPlans.length > 0 && (
              <div className="space-y-2 pt-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Your Saved Business Plans</span>
                <div className="space-y-1">
                  {filteredPlans.map(p => (
                    <button
                      key={p.id}
                      onClick={() => handleSelect('/dashboard')}
                      className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 text-xs text-left group"
                    >
                      <div className="flex items-center gap-2">
                        <FileCheck className="w-4 h-4 text-emerald-600" />
                        <div>
                          <p className="font-semibold text-slate-800">{p.businessName}</p>
                          <p className="text-[11px] text-slate-400">{p.location} • ₹{(p.projectCost / 100000).toFixed(1)}L</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">{p.status}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
