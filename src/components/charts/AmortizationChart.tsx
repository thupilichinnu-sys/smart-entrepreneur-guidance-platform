import React, { useState } from 'react';
import { RepaymentPlan } from '../../types/financial';
import { formatCurrencyINR } from '../../utils/formatting';

export const AmortizationChart: React.FC<{
  plan: RepaymentPlan;
  className?: string;
}> = ({ plan, className = '' }) => {
  const [activeView, setActiveView] = useState<'yearly' | 'monthly'>('yearly');

  const { effectiveSchedule, principalLoan, totalRepayment, moratoriumMonths } = plan;

  // Aggregate by year for clean visualization
  const yearlyData = React.useMemo(() => {
    const yearsMap: Record<number, { year: number; principal: number; interest: number; closingBalance: number }> = {};
    
    effectiveSchedule.forEach((item) => {
      if (!yearsMap[item.year]) {
        yearsMap[item.year] = { year: item.year, principal: 0, interest: 0, closingBalance: item.closingBalance };
      }
      yearsMap[item.year].principal += item.principal;
      yearsMap[item.year].interest += item.interest;
      yearsMap[item.year].closingBalance = item.closingBalance;
    });

    return Object.values(yearsMap);
  }, [effectiveSchedule]);

  const maxYearlyOutflow = Math.max(...yearlyData.map(y => y.principal + y.interest), 1);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Top Controls & Moratorium Callout */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-xs font-bold text-slate-700">Repayment Trajectory (Principal vs. Interest)</span>
          <p className="text-[11px] text-slate-500">
            Initial {moratoriumMonths} months moratorium included with interest-servicing grace.
          </p>
        </div>
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveView('yearly')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              activeView === 'yearly' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Yearly View
          </button>
          <button
            onClick={() => setActiveView('monthly')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              activeView === 'monthly' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Monthly Schedule
          </button>
        </div>
      </div>

      {activeView === 'yearly' ? (
        <div className="space-y-3 pt-2">
          {yearlyData.map((y) => {
            const principalPct = Math.round((y.principal / maxYearlyOutflow) * 100);
            const interestPct = Math.round((y.interest / maxYearlyOutflow) * 100);

            return (
              <div key={y.year} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">Year {y.year}</span>
                  <div className="flex items-center gap-3 text-[11px]">
                    <span className="text-emerald-700 font-semibold">P: {formatCurrencyINR(y.principal)}</span>
                    <span className="text-amber-700 font-semibold">I: {formatCurrencyINR(y.interest)}</span>
                    <span className="text-slate-400 font-normal">Bal: {formatCurrencyINR(y.closingBalance, true)}</span>
                  </div>
                </div>

                {/* Stacked Amortization Bar */}
                <div className="w-full h-4 bg-slate-100 rounded-lg overflow-hidden flex shadow-inner">
                  <div
                    style={{ width: `${principalPct}%` }}
                    className="h-full bg-emerald-600 transition-all duration-300"
                    title={`Principal: ${formatCurrencyINR(y.principal)}`}
                  />
                  <div
                    style={{ width: `${interestPct}%` }}
                    className="h-full bg-amber-500 transition-all duration-300"
                    title={`Interest: ${formatCurrencyINR(y.interest)}`}
                  />
                </div>
              </div>
            );
          })}

          <div className="flex items-center justify-center gap-6 pt-3 text-xs">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-emerald-600 inline-block" />
              Principal Loan Paid
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-amber-500 inline-block" />
              Concessional Interest Paid
            </span>
          </div>
        </div>
      ) : (
        /* Monthly Amortization Table */
        <div className="max-h-64 overflow-y-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold sticky top-0 border-b border-slate-200">
              <tr>
                <th className="p-2.5">Month</th>
                <th className="p-2.5">Opening</th>
                <th className="p-2.5">EMI Paid</th>
                <th className="p-2.5">Principal</th>
                <th className="p-2.5">Interest</th>
                <th className="p-2.5">Closing</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {effectiveSchedule.map((item) => (
                <tr key={item.month} className={item.isMoratorium ? 'bg-amber-50/40 text-amber-900 font-medium' : 'hover:bg-slate-50'}>
                  <td className="p-2 font-semibold">
                    M{item.month} {item.isMoratorium && <span className="text-[10px] bg-amber-200/80 px-1 rounded">Grace</span>}
                  </td>
                  <td className="p-2">{formatCurrencyINR(item.openingBalance)}</td>
                  <td className="p-2 font-bold text-slate-900">{formatCurrencyINR(item.emi)}</td>
                  <td className="p-2 text-emerald-700">{formatCurrencyINR(item.principal)}</td>
                  <td className="p-2 text-amber-700">{formatCurrencyINR(item.interest)}</td>
                  <td className="p-2 text-slate-600">{formatCurrencyINR(item.closingBalance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
