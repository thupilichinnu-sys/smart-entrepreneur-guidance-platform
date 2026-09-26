import React, { useState, useEffect } from 'react';
import { 
  Landmark, ArrowRight, CheckCircle2, AlertTriangle, ShieldCheck, 
  HelpCircle, FileText, Info
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { businessService } from '../services/businessService';
import { MICRO_FINANCE_SCHEME, TERM_LOAN_SCHEME } from '../data/schemeRules';
import { selectScheme, calculateProjectCost } from '../utils/financialEngine';
import { formatCurrencyINR } from '../utils/formatting';
import { CurrencyInput } from '../components/ui/CurrencyInput';

export const SchemeRouterPage: React.FC<{ navigate: (r: string) => void }> = ({ navigate }) => {
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
  const projectCost = schemeResult.calculatedProjectCost;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-800 text-xs font-semibold border border-purple-200">
          <Landmark className="w-3.5 h-3.5 text-purple-600" />
          <span>MoSJE Concessional Credit Guidance</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display">
          SMART SCHEME ROUTER
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
          Automated routing between MoSJE credit schemes with statutory maximum cap logic and documentation requirements.
        </p>
      </div>

      {/* Input Margin Capital */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900">Enter or Adjust Margin Capital</h3>
        <CurrencyInput
          value={marginCapital}
          onChange={setMarginCapital}
          label="Available Equity Margin (10%)"
          helperText="Select an amount to test boundary conditions (e.g. ₹14K, ₹1L, ₹5L, ₹5.5L)."
        />
      </div>

      {/* Scheme Recommendation Hero */}
      {schemeResult.isEligible && schemeResult.scheme ? (
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-900 text-white shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-purple-700 text-purple-200">
                Recommended Matching Scheme
              </span>
              <h2 className="text-2xl font-black font-display">{schemeResult.scheme.name}</h2>
              <p className="text-xs text-purple-200 max-w-xl leading-relaxed">
                {schemeResult.scheme.description}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur border border-white/20 text-center flex-shrink-0">
              <span className="text-[10px] text-purple-200 block">Eligible Concessional Loan</span>
              <div className="text-3xl font-black my-1 text-white">
                {formatCurrencyINR(schemeResult.applicableLoan)}
              </div>
              <span className="text-[10px] text-purple-300">
                at {schemeResult.scheme.interestRate}% Interest p.a.
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-2">
            <div className="p-3 bg-white/10 rounded-xl border border-white/10">
              <span className="text-purple-300 block text-[10px]">Project Cost Range</span>
              <span className="font-bold">
                ≤ {formatCurrencyINR(schemeResult.scheme.maxProjectCost, true)}
              </span>
            </div>
            <div className="p-3 bg-white/10 rounded-xl border border-white/10">
              <span className="text-purple-300 block text-[10px]">Max Scheme Ceiling</span>
              <span className="font-bold">
                {formatCurrencyINR(schemeResult.scheme.maxLoanAmount, true)}
              </span>
            </div>
            <div className="p-3 bg-white/10 rounded-xl border border-white/10">
              <span className="text-purple-300 block text-[10px]">Repayment Tenure</span>
              <span className="font-bold">{schemeResult.scheme.tenureYears} Years</span>
            </div>
            <div className="p-3 bg-white/10 rounded-xl border border-white/10">
              <span className="text-purple-300 block text-[10px]">Moratorium Period</span>
              <span className="font-bold">{schemeResult.scheme.moratoriumMonths} Months</span>
            </div>
          </div>

          {schemeResult.cappedNotice && (
            <div className="p-3 bg-amber-400/20 border border-amber-400/40 rounded-xl text-xs text-amber-200">
              <b>Important Cap Rule:</b> {schemeResult.cappedNotice}
            </div>
          )}
        </div>
      ) : (
        <div className="p-6 rounded-3xl bg-red-50 border border-red-200 text-red-900 space-y-3">
          <div className="flex items-center gap-2 font-bold text-base">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <span>PROJECT SIZE EXCEEDS SUPPORTED SCHEME LIMIT</span>
          </div>
          <p className="text-xs leading-relaxed text-red-800">
            {schemeResult.exceedsNotice || 'Project outlay exceeds the statutory ₹50.00 Lakh maximum ceiling under standard MoSJE credit schemes.'}
          </p>
          <p className="text-xs text-red-700 font-semibold">
            Recommendation: Reduce the margin capital to ₹5,00,000 or explore commercial bank / consortium financing options.
          </p>
        </div>
      )}

      {/* Side-by-Side Scheme Comparison Rules */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900 font-display">
          MoSJE Scheme Guidelines & Statutory Boundaries
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Micro Finance Scheme */}
          <div className={`p-6 rounded-3xl border transition-all space-y-4 ${
            schemeResult.scheme?.id === MICRO_FINANCE_SCHEME.id
              ? 'bg-purple-50/50 border-purple-400 shadow-md ring-2 ring-purple-400/20'
              : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                  Project Outlay ≤ ₹1.40 Lakh
                </span>
                <h4 className="text-base font-bold text-slate-900 mt-1">{MICRO_FINANCE_SCHEME.name}</h4>
                <p className="text-xs text-slate-500">{MICRO_FINANCE_SCHEME.code}</p>
              </div>
              <span className="text-lg font-black text-purple-700">6.5% p.a.</span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">{MICRO_FINANCE_SCHEME.description}</p>

            <div className="space-y-1.5 text-xs text-slate-700 pt-2 border-t border-slate-100">
              <p>• <b>Max Loan Limit:</b> ₹1.25 Lakh</p>
              <p>• <b>Tenure:</b> 3 Years (36 Monthly Installments)</p>
              <p>• <b>Moratorium:</b> 3 Months Grace Period</p>
              <p>• <b>Beneficiary Equity:</b> Min 10% Margin</p>
            </div>

            <div className="pt-2">
              <span className="text-[11px] font-bold text-slate-800 block mb-1.5">Required Documents:</span>
              <ul className="space-y-1 text-[11px] text-slate-600">
                {MICRO_FINANCE_SCHEME.documentsRequired.map(d => (
                  <li key={d} className="flex items-start gap-1.5">
                    <span className="text-purple-600 font-bold">✓</span>
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Term Loan Scheme */}
          <div className={`p-6 rounded-3xl border transition-all space-y-4 ${
            schemeResult.scheme?.id === TERM_LOAN_SCHEME.id
              ? 'bg-purple-50/50 border-purple-400 shadow-md ring-2 ring-purple-400/20'
              : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                  Project Outlay &gt; ₹1.40L to ₹50L
                </span>
                <h4 className="text-base font-bold text-slate-900 mt-1">{TERM_LOAN_SCHEME.name}</h4>
                <p className="text-xs text-slate-500">{TERM_LOAN_SCHEME.code}</p>
              </div>
              <span className="text-lg font-black text-blue-700">8.0% p.a.</span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">{TERM_LOAN_SCHEME.description}</p>

            <div className="space-y-1.5 text-xs text-slate-700 pt-2 border-t border-slate-100">
              <p>• <b>Max Loan Limit:</b> ₹45.00 Lakh</p>
              <p>• <b>Tenure:</b> 7 Years (84 Monthly Installments)</p>
              <p>• <b>Moratorium:</b> 6 Months Grace Period</p>
              <p>• <b>Beneficiary Equity:</b> Min 10% Margin</p>
            </div>

            <div className="pt-2">
              <span className="text-[11px] font-bold text-slate-800 block mb-1.5">Required Documents:</span>
              <ul className="space-y-1 text-[11px] text-slate-600">
                {TERM_LOAN_SCHEME.documentsRequired.map(d => (
                  <li key={d} className="flex items-start gap-1.5">
                    <span className="text-blue-600 font-bold">✓</span>
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Footer CTA to Repayment Planner */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-sm">Proceed to Repayment & EMI Schedule</h4>
          <p className="text-xs text-slate-400">View month-by-month principal and interest amortization.</p>
        </div>
        <button
          onClick={() => navigate('/repayment')}
          className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2"
        >
          <span>Open Repayment Planner</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
