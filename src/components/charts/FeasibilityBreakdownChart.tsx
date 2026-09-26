import React from 'react';
import { ProgressBar } from '../ui/ProgressBar';

export const FeasibilityBreakdownChart: React.FC<{
  metrics: {
    localDemand: number;
    competition: number;
    capitalFit: number;
    marketReach: number;
    supplyAvailability: number;
    riskScore: number;
  };
  overallScore: number;
}> = ({ metrics, overallScore }) => {
  const pillars = [
    { label: 'Local Market Demand', val: metrics.localDemand, color: 'emerald' as const, desc: 'High daily essential consumption within 5-10km' },
    { label: 'Capital & Scheme Fit', val: metrics.capitalFit, color: 'blue' as const, desc: '90% loan eligibility under MoSJE guidelines' },
    { label: 'Market Reach & Logistics', val: metrics.marketReach, color: 'emerald' as const, desc: 'Access to bus stops, mandis, and retail shops' },
    { label: 'Supply Availability', val: metrics.supplyAvailability, color: 'blue' as const, desc: 'Reliable local feed and raw material sourcing' },
    { label: 'Competitor Defenseability', val: metrics.competition, color: 'amber' as const, desc: 'Hygiene and quality gap in existing informal sellers' }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div>
          <span className="text-xs font-bold text-slate-800">Feasibility Breakdown by Pillar</span>
          <p className="text-[11px] text-slate-500">Multifactorial score based on capital, local demand, and logistics.</p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-black text-emerald-700">{overallScore}</span>
          <span className="text-xs text-slate-400">/100</span>
        </div>
      </div>

      <div className="space-y-3">
        {pillars.map((p) => (
          <div key={p.label} className="space-y-1">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-800">{p.label}</span>
              <span className="font-bold text-slate-900">{p.val}%</span>
            </div>
            <ProgressBar progress={p.val} showPercent={false} color={p.color} height="sm" />
            <p className="text-[10px] text-slate-400">{p.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
