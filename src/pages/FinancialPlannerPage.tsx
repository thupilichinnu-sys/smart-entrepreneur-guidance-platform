import React, { useState, useEffect } from 'react';
import { 
  Calculator, ArrowRight, Coins, Landmark, ShieldCheck, 
  Sparkles, AlertCircle, HelpCircle, Layers, Calendar
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { businessService } from '../services/businessService';
import { activityService } from '../services/activityService';
import { 
  calculateProjectCost, 
  selectScheme, 
  calculateEMI, 
  calculateWorkingCapital 
} from '../utils/financialEngine';
import { formatCurrencyINR } from '../utils/formatting';
import { CurrencyInput } from '../components/ui/CurrencyInput';
import { OperatingCostBreakdown } from '../types/financial';

export const FinancialPlannerPage: React.FC<{ navigate: (r: string) => void }> = ({ navigate }) => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [marginCapital, setMarginCapital] = useState(100000);
  const [operatingCosts, setOperatingCosts] = useState<OperatingCostBreakdown>({
    rawMaterials: 18000,
    labour: 6000,
    electricityFuel: 2500,
    rent: 2000,
    transportLogistics: 2200,
    packaging: 1200,
    marketingSales: 800,
    maintenanceRepairs: 1000,
    emergencyReserve: 3500
  });
  const [projectedMonthlyRevenue, setProjectedMonthlyRevenue] = useState(52000);

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
  const applicableLoan = schemeResult.applicableLoan;
  const interestRate = schemeResult.scheme?.interestRate || 8.0;
  const tenureMonths = (schemeResult.scheme?.tenureYears || 7) * 12;
  const emi = calculateEMI(applicableLoan, interestRate, tenureMonths);

  const workingCapital = calculateWorkingCapital(operatingCosts, projectedMonthlyRevenue);

  const handleCostChange = (field: keyof OperatingCostBreakdown, val: number) => {
    setOperatingCosts(prev => ({ ...prev, [field]: Math.max(0, val) }));
  };

  const handleSavePlan = () => {
    if (user) {
      activityService.logActivity(user.id, {
        type: 'FINANCIAL_PLAN_CREATED',
        title: 'Financial Structure Updated',
        description: `Project Outlay: ₹${(projectCost / 100000).toFixed(1)}L with ₹${(applicableLoan / 100000).toFixed(1)}L loan.`,
        actionUrl: '/repayment',
        actionLabel: 'View Schedule →'
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-semibold border border-amber-200">
          <Calculator className="w-3.5 h-3.5 text-amber-600" />
          <span>Deterministic Financial Structuring</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display">
          FINANCIAL PLANNER & WORKING CAPITAL
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
          10% beneficiary margin rule, scheme cap calculations, monthly operating cost budgets, and estimated break-even timelines.
        </p>
      </div>

      {/* Margin Input & Scheme Match Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900">Capital Sizing</h3>
            <CurrencyInput
              value={marginCapital}
              onChange={setMarginCapital}
              label="Beneficiary Margin Capital (10%)"
              helperText="Enter your available equity capital. Calculations update automatically."
            />
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/70 border border-slate-200 space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Deterministic Output Summary
            </span>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-white border border-slate-200">
                <span className="text-[10px] text-slate-400 block">Total Project Outlay</span>
                <span className="text-base font-black text-slate-900">{formatCurrencyINR(projectCost)}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Margin ÷ 0.10</span>
              </div>

              <div className="p-3 rounded-xl bg-white border border-slate-200">
                <span className="text-[10px] text-slate-400 block">Applicable 90% Loan</span>
                <span className="text-base font-black text-emerald-700">{formatCurrencyINR(applicableLoan)}</span>
                <span className="text-[10px] text-emerald-600 block mt-0.5">
                  {schemeResult.cappedNotice ? 'Capped at Max' : 'Full 90%'}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block">Matched Scheme</span>
                <span className="font-bold text-purple-700">{schemeResult.scheme?.name || 'Exceeds Limit'}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block">Interest Rate</span>
                <span className="font-bold text-slate-800">{interestRate}% p.a.</span>
              </div>
            </div>

            {schemeResult.cappedNotice && (
              <p className="text-[11px] text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200 font-medium">
                {schemeResult.cappedNotice}
              </p>
            )}
            {schemeResult.exceedsNotice && (
              <p className="text-[11px] text-red-800 bg-red-50 p-2 rounded-lg border border-red-200 font-medium">
                {schemeResult.exceedsNotice}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Working Capital Planner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
        <div>
          <h3 className="text-base font-bold text-slate-900 font-display">
            Monthly Operating Cost & Working Capital Reserve
          </h3>
          <p className="text-xs text-slate-500">
            Estimate monthly expenses to determine your required 3-month operating capital cushion before launch.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { key: 'rawMaterials', label: 'Raw Materials & Inputs', icon: '🌾' },
            { key: 'labour', label: 'Hired Wages & Labour', icon: '👥' },
            { key: 'electricityFuel', label: 'Electricity & Fuel', icon: '⚡' },
            { key: 'rent', label: 'Facility Rent / Lease', icon: '🏠' },
            { key: 'transportLogistics', label: 'Transport & Delivery', icon: '🚚' },
            { key: 'packaging', label: 'Packaging & Labels', icon: '📦' },
            { key: 'marketingSales', label: 'Marketing & Samples', icon: '📢' },
            { key: 'maintenanceRepairs', label: 'Machine Servicing', icon: '🔧' },
            { key: 'emergencyReserve', label: 'Emergency Veterinary/Buffer', icon: '🛡️' }
          ].map((item) => (
            <div key={item.key} className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">
                {item.icon} {item.label}
              </label>
              <div className="relative rounded-xl shadow-xs">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-xs text-slate-400 font-bold">₹</span>
                <input
                  type="number"
                  min={0}
                  step={500}
                  value={operatingCosts[item.key as keyof OperatingCostBreakdown] || ''}
                  onChange={(e) => handleCostChange(item.key as keyof OperatingCostBreakdown, Number(e.target.value))}
                  className="w-full pl-7 pr-3 py-2 text-xs font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Working Capital Results */}
        <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3 bg-white rounded-xl border border-emerald-100 shadow-xs">
            <span className="text-[10px] text-slate-400 block">Monthly Operating Cost</span>
            <span className="text-lg font-black text-slate-900">{formatCurrencyINR(workingCapital.monthlyOperatingCost)}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Recurring Monthly Need</span>
          </div>

          <div className="p-3 bg-white rounded-xl border border-emerald-100 shadow-xs">
            <span className="text-[10px] text-slate-400 block">Recommended Working Capital</span>
            <span className="text-lg font-black text-emerald-700">{formatCurrencyINR(workingCapital.recommendedWorkingCapital)}</span>
            <span className="text-[10px] text-emerald-600 block mt-0.5">3-Month Operating Buffer</span>
          </div>

          <div className="p-3 bg-white rounded-xl border border-emerald-100 shadow-xs">
            <span className="text-[10px] text-slate-400 block">Estimated Break-Even</span>
            <span className="text-lg font-black text-purple-700">{workingCapital.estimatedBreakEvenMonths} Months</span>
            <span className="text-[10px] text-purple-600 block mt-0.5">To positive unit cashflow</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <p className="text-[11px] text-slate-400 italic">
            Working capital requirements are indicative and should be tailored based on local vendor payment cycles.
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                handleSavePlan();
                navigate('/repayment');
              }}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2"
            >
              <span>View Repayment Schedule</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
