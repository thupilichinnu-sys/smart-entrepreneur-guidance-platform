import React from 'react';
import { Compass, ArrowRight, TrendingUp, ShieldAlert, Sparkles, Filter } from 'lucide-react';
import { BUSINESS_CATEGORIES } from '../data/businessCatalog';
import { useAuth } from '../context/AuthContext';
import { businessService } from '../services/businessService';

export const BusinessDiscoveryPage: React.FC<{ navigate: (r: string) => void }> = ({ navigate }) => {
  const { user } = useAuth();
  const assessment = user ? businessService.getAssessment(user.id) : null;

  // Ranked recommendation generator based on user's location & capital
  const rankedBusinesses = [
    {
      name: 'Dairy & Milk Products',
      score: 88,
      category: 'Agriculture & FoodTech',
      margin: '₹50K - ₹2L',
      demand: 'High',
      risk: 'Low-Medium',
      reason: 'Stable non-cyclical daily cashflow, milk cooperative tie-ups, high rural resilience.'
    },
    {
      name: 'Food Processing & Flour Mill',
      score: 82,
      category: 'FoodTech',
      margin: '₹75K - ₹3L',
      demand: 'High',
      risk: 'Medium',
      reason: 'Retains agricultural produce value locally; high demand for de-husked pulses and spices.'
    },
    {
      name: 'Tailoring & Garment Boutique',
      score: 77,
      category: 'Textiles & Crafts',
      margin: '₹25K - ₹1L',
      demand: 'Medium',
      risk: 'Low',
      reason: 'Ideal for women micro-entrepreneurs; strong school uniform and festive wear orders.'
    },
    {
      name: 'Poultry & Egg Broiler Unit',
      score: 75,
      category: 'Livestock & Agriculture',
      margin: '₹50K - ₹2.5L',
      demand: 'Rapidly Growing',
      risk: 'Medium-High',
      reason: 'Fast 45-day turnaround cycle; local hotel and weekly mandi protein demand.'
    },
    {
      name: 'Modern Rural Kirana & General Store',
      score: 73,
      category: 'Retail & Commerce',
      margin: '₹40K - ₹1.5L',
      demand: 'High',
      risk: 'Low',
      reason: 'Anchors village center commerce; steady daily consumer cashflow.'
    }
  ];

  const handleSelectBusiness = (busName: string) => {
    if (user) {
      const existing = businessService.getAssessment(user.id);
      if (existing) {
        businessService.saveAssessment(user.id, { ...existing, category: busName });
      }
    }
    navigate('/assessment');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Page Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
          <Compass className="w-3.5 h-3.5 text-emerald-600" />
          <span>AI-Assisted Business Discovery</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display">
          FIND THE RIGHT BUSINESS
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
          Ranked recommendations tailored to your local area, available capital, skills, and market demand gaps.
        </p>
      </div>

      {/* Ranked List */}
      <div className="space-y-4">
        {rankedBusinesses.map((item, idx) => (
          <div
            key={item.name}
            className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 font-black text-base flex items-center justify-center flex-shrink-0">
                #{idx + 1}
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-bold text-base text-slate-900">{item.name}</h3>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    {item.category}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                  {item.reason}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                  <span>Margin: <b className="text-slate-800">{item.margin}</b></span>
                  <span>Demand: <b className="text-emerald-700">{item.demand}</b></span>
                  <span>Risk: <b className="text-slate-800">{item.risk}</b></span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 flex-shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
              <div className="text-right">
                <div className="text-2xl font-black text-emerald-700">{item.score}<span className="text-xs text-slate-400">/100</span></div>
                <span className="text-[10px] text-slate-400 block">AI Indicative Score</span>
              </div>

              <button
                onClick={() => handleSelectBusiness(item.name)}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all"
              >
                <span>Select & Assess</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 rounded-2xl bg-slate-100 text-slate-600 text-xs text-center">
        Indicative scores are computed using regional economic datasets and capital adequacy models.
      </div>
    </div>
  );
};
