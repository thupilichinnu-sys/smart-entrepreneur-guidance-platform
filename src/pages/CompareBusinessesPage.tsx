import React, { useState } from 'react';
import { Layers, ArrowRight, CheckCircle2, TrendingUp, ShieldAlert, Coins } from 'lucide-react';
import { BUSINESS_CATEGORIES } from '../data/businessCatalog';
import { formatCurrencyINR } from '../utils/formatting';

export const CompareBusinessesPage: React.FC<{ navigate: (r: string) => void }> = ({ navigate }) => {
  const [optionA, setOptionA] = useState('dairy');
  const [optionB, setOptionB] = useState('food_processing');

  const bizData: Record<string, {
    name: string;
    demand: number;
    competition: number;
    capitalFit: number;
    risk: 'Low' | 'Medium' | 'High';
    riskScore: number;
    feasibility: number;
    typicalMargin: string;
    cashflowCycle: string;
    pros: string;
  }> = {
    dairy: {
      name: 'Dairy & Milk Products',
      demand: 88,
      competition: 65,
      capitalFit: 91,
      risk: 'Medium',
      riskScore: 35,
      feasibility: 82,
      typicalMargin: '₹1,00,000',
      cashflowCycle: 'Daily (Morning & Evening)',
      pros: 'Immediate non-cyclical daily cash sales and milk cooperative off-take.'
    },
    food_processing: {
      name: 'Food Processing Mill',
      demand: 81,
      competition: 58,
      capitalFit: 74,
      risk: 'Medium',
      riskScore: 42,
      feasibility: 79,
      typicalMargin: '₹1,50,000',
      cashflowCycle: 'Weekly / Bi-weekly',
      pros: 'High value addition for local pulse and spice crops.'
    },
    tailoring_textiles: {
      name: 'Tailoring & Garments',
      demand: 76,
      competition: 70,
      capitalFit: 88,
      risk: 'Low',
      riskScore: 28,
      feasibility: 78,
      typicalMargin: '₹50,000',
      cashflowCycle: 'On-demand & Seasonal',
      pros: 'Very low startup capital and high community repeat clientele.'
    },
    retail_kirana: {
      name: 'Modern Rural Kirana',
      demand: 85,
      competition: 78,
      capitalFit: 82,
      risk: 'Low',
      riskScore: 30,
      feasibility: 80,
      typicalMargin: '₹80,000',
      cashflowCycle: 'Daily Retail Cash',
      pros: 'Essential household items with steady footfall.'
    }
  };

  const a = bizData[optionA] || bizData.dairy;
  const b = bizData[optionB] || bizData.food_processing;

  const winner = a.feasibility >= b.feasibility ? a : b;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-semibold border border-blue-200">
          <Layers className="w-3.5 h-3.5 text-blue-600" />
          <span>Decision Support Matrix</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display">
          COMPARE BUSINESSES
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
          Side-by-side comparative scoring to evaluate capital fit, market demand, and operational risk.
        </p>
      </div>

      {/* Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <label className="block text-xs font-bold text-slate-700">Option A</label>
          <select
            value={optionA}
            onChange={(e) => setOptionA(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-slate-50 border rounded-xl"
          >
            <option value="dairy">Dairy & Milk Products</option>
            <option value="food_processing">Food Processing Mill</option>
            <option value="tailoring_textiles">Tailoring & Garments</option>
            <option value="retail_kirana">Modern Rural Kirana</option>
          </select>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <label className="block text-xs font-bold text-slate-700">Option B</label>
          <select
            value={optionB}
            onChange={(e) => setOptionB(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-slate-50 border rounded-xl"
          >
            <option value="food_processing">Food Processing Mill</option>
            <option value="dairy">Dairy & Milk Products</option>
            <option value="tailoring_textiles">Tailoring & Garments</option>
            <option value="retail_kirana">Modern Rural Kirana</option>
          </select>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
            <tr>
              <th className="p-4">Key Metric</th>
              <th className="p-4 text-emerald-800">{a.name}</th>
              <th className="p-4 text-blue-800">{b.name}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr>
              <td className="p-4 font-semibold text-slate-800">Feasibility Score</td>
              <td className="p-4 font-black text-lg text-emerald-700">{a.feasibility}/100</td>
              <td className="p-4 font-black text-lg text-blue-700">{b.feasibility}/100</td>
            </tr>
            <tr>
              <td className="p-4 font-semibold text-slate-800">Local Market Demand</td>
              <td className="p-4 font-bold">{a.demand}/100</td>
              <td className="p-4 font-bold">{b.demand}/100</td>
            </tr>
            <tr>
              <td className="p-4 font-semibold text-slate-800">Competitor Density</td>
              <td className="p-4">{a.competition}/100</td>
              <td className="p-4">{b.competition}/100</td>
            </tr>
            <tr>
              <td className="p-4 font-semibold text-slate-800">Capital Adequacy Fit</td>
              <td className="p-4 font-bold text-emerald-700">{a.capitalFit}/100</td>
              <td className="p-4 font-bold text-blue-700">{b.capitalFit}/100</td>
            </tr>
            <tr>
              <td className="p-4 font-semibold text-slate-800">Risk Severity</td>
              <td className="p-4 font-bold">{a.risk}</td>
              <td className="p-4 font-bold">{b.risk}</td>
            </tr>
            <tr>
              <td className="p-4 font-semibold text-slate-800">Typical Margin Capital</td>
              <td className="p-4 font-medium">{a.typicalMargin}</td>
              <td className="p-4 font-medium">{b.typicalMargin}</td>
            </tr>
            <tr>
              <td className="p-4 font-semibold text-slate-800">Cashflow Velocity</td>
              <td className="p-4">{a.cashflowCycle}</td>
              <td className="p-4">{b.cashflowCycle}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Winner Recommendation Banner */}
      <div className="p-6 rounded-3xl bg-emerald-50 border border-emerald-300 space-y-2">
        <div className="flex items-center gap-2 font-bold text-emerald-950 text-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>Recommended Choice: {winner.name}</span>
        </div>
        <p className="text-xs text-emerald-900 leading-relaxed">
          {winner.name} exhibits superior capital fit ({winner.capitalFit}/100) and immediate cashflow certainty for rural village clusters. {winner.pros}
        </p>
      </div>

      <div className="text-center pt-2">
        <button
          onClick={() => navigate('/assessment')}
          className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm"
        >
          Proceed with {winner.name} Assessment →
        </button>
      </div>

    </div>
  );
};
