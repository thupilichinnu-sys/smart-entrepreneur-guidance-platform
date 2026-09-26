import React, { useState, useEffect } from 'react';
import { 
  CalendarCheck, ArrowRight, Landmark, Clock, Coins, 
  HelpCircle, ShieldAlert, CheckCircle2, ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { businessService } from '../services/businessService';
import { selectScheme, generateRepaymentPlan } from '../utils/financialEngine';
import { formatCurrencyINR } from '../utils/formatting';
import { AmortizationChart } from '../components/charts/AmortizationChart';
import { RepaymentPlan } from '../types/financial';

export const RepaymentPage: React.FC<{ navigate: (r: string) => void }> = ({ navigate }) => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [marginCapital, setMarginCapital] = useState(100000);

  useEffect(() => {
    if (user) {
      const asm = businessService.getAssessment(user.id);
      if (asm && asm.marginCapital) {
        setMarginCapital(asm.marginCapital);
      }
    }
  }, [user]);

  const schemeResult = selectScheme(marginCapital);
  const applicableLoan = schemeResult.applicableLoan;
  const interestRate = schemeResult.scheme?.interestRate || 8.0;
  const tenureYears = schemeResult.scheme?.tenureYears || 7;
  const moratoriumMonths = schemeResult.scheme?.moratoriumMonths || 6;

  const plan: RepaymentPlan = generateRepaymentPlan(
    applicableLoan,
    interestRate,
    tenureYears,
    moratoriumMonths
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-semibold border border-amber-200">
          <CalendarCheck className="w-3.5 h-3.5 text-amber-600" />
          <span>Debt Servicing Lifecycle</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display">
          REPAYMENT & EMI ROADMAP
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
          Lifecycle progression from application approval, through moratorium grace, to debt completion.
        </p>
      </div>

      {/* Lifecycle Progression Bar */}
      <div className="p-4 sm:p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Loan Repayment Lifecycle
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-center text-xs font-bold text-slate-800">
          {[
            { step: '1', title: 'Application', desc: 'DPR & Documents' },
            { step: '2', title: 'Sanction', desc: 'Loan Disbursement' },
            { step: '3', title: 'Moratorium', desc: `${moratoriumMonths} Mo Grace` },
            { step: '4', title: 'Repayment Start', desc: 'Regular EMI' },
            { step: '5', title: 'Monthly EMI', desc: formatCurrencyINR(plan.monthlyEMI) },
            { step: '6', title: 'Completion', desc: 'NOC Issued' }
          ].map((item, idx) => (
            <div key={item.title} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center gap-1">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center font-black">
                {item.step}
              </span>
              <span className="text-xs font-bold mt-1 text-slate-900">{item.title}</span>
              <span className="text-[10px] text-slate-500 font-normal">{item.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-slate-500 font-semibold">Monthly EMI Post-Grace</span>
          <p className="text-2xl font-black text-amber-700">{formatCurrencyINR(plan.monthlyEMI)}</p>
          <span className="text-[10px] text-slate-400 block">{tenureYears * 12 - moratoriumMonths} Months Active</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-slate-500 font-semibold">Total Interest Paid</span>
          <p className="text-2xl font-black text-slate-800">{formatCurrencyINR(plan.totalInterest)}</p>
          <span className="text-[10px] text-purple-700 font-semibold">At Concessional {interestRate}%</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-slate-500 font-semibold">Total Debt Repayment</span>
          <p className="text-2xl font-black text-slate-900">{formatCurrencyINR(plan.totalRepayment)}</p>
          <span className="text-[10px] text-slate-400 block">Principal + Interest</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-slate-500 font-semibold">Moratorium Period</span>
          <p className="text-2xl font-black text-emerald-700">{moratoriumMonths} Months</p>
          <span className="text-[10px] text-emerald-600 block">Only simple interest</span>
        </div>
      </div>

      {/* Interactive Amortization Chart */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
        <AmortizationChart plan={plan} />
      </div>

      {/* Mandatory Moratorium Notice */}
      <div className="p-5 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950 space-y-2">
        <div className="flex items-center gap-2 font-bold text-amber-900">
          <ShieldAlert className="w-4 h-4 text-amber-700" />
          <span>Moratorium & Interest Treatment Disclaimer</span>
        </div>
        <p className="leading-relaxed text-amber-800">
          <b>Important:</b> Moratorium treatment is illustrative. During the initial {moratoriumMonths}-month setup moratorium, only simple interest accrues or is serviced, allowing the enterprise to establish machinery and customer channels before full EMI principal payments begin. Actual repayment structure depends on bank sanction terms and applicable scheme rules.
        </p>
      </div>

      {/* Next Step CTA */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-sm">Next: Generate 30-Day Business Action Plan</h4>
          <p className="text-xs text-slate-400">Step-by-step launch tasks for market testing, quotations, and bank filing.</p>
        </div>
        <button
          onClick={() => navigate('/action-plan')}
          className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2"
        >
          <span>Open 30-Day Plan</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
