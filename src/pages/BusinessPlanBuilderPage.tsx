import React, { useState, useEffect } from 'react';
import { 
  FileText, ArrowRight, Printer, Save, CheckCircle2, Sparkles, Building2, Coins, Landmark
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { businessService } from '../services/businessService';
import { activityService } from '../services/activityService';
import { selectScheme, calculateProjectCost } from '../utils/financialEngine';
import { formatCurrencyINR } from '../utils/formatting';

export const BusinessPlanBuilderPage: React.FC<{ navigate: (r: string) => void }> = ({ navigate }) => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [businessName, setBusinessName] = useState('Dairy & Milk Products Enterprise');
  const [location, setLocation] = useState('Penukonda GP, Andhra Pradesh');
  const [marginCapital, setMarginCapital] = useState(100000);
  const [overview, setOverview] = useState('Setting up a 4-milch animal dairy unit supplying 45L fresh buffalo milk daily to 30 neighborhood households and local tea stalls.');
  const [targetMarket, setTargetMarket] = useState('Door-to-door residential clusters within 2km, and tea stalls near the local bus stand.');
  const [operations, setOperations] = useState('Daily morning milking at 5:30 AM, immediate insulated delivery by 6:45 AM. Afternoon fodder cutting from 0.5 acre plot.');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      const asm = businessService.getAssessment(user.id);
      if (asm) {
        setBusinessName(`${asm.category} Enterprise`);
        setLocation(`${asm.location.village || asm.location.gramPanchayat || 'Village'}, ${asm.location.district}`);
        setMarginCapital(asm.marginCapital || 100000);
      }
    }
  }, [user]);

  const schemeResult = selectScheme(marginCapital);
  const projectCost = schemeResult.calculatedProjectCost;
  const loanAmount = schemeResult.applicableLoan;

  const handleSave = () => {
    if (!user) return;
    businessService.savePlan(user.id, {
      businessName,
      category: 'Agriculture & FoodTech',
      location,
      marginCapital,
      projectCost,
      loanAmount,
      schemeName: schemeResult.scheme?.name || 'MoSJE Concessional Credit',
      feasibilityScore: 82,
      status: 'Ready',
      notes: overview
    });

    activityService.logActivity(user.id, {
      type: 'SAVED_PLAN_CREATED',
      title: 'Detailed Business Plan Saved',
      description: `${businessName} (Outlay: ₹${(projectCost / 100000).toFixed(1)}L)`
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 no-print">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
            <FileText className="w-3.5 h-3.5 text-emerald-600" />
            <span>Structured DPR Dossier</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display">
            BUSINESS PLAN BUILDER
          </h1>
          <p className="text-xs text-slate-500">
            Generate and export a bank-grade Detailed Project Report (DPR) profile for MoSJE scheme presentation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl border border-slate-300 shadow-xs flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print Dossier</span>
          </button>

          <button
            onClick={handleSave}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{savedSuccess ? 'Saved to Profile!' : 'Save Business Plan'}</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2 font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Business plan successfully updated and saved in your Profile.</span>
        </div>
      )}

      {/* Document Canvas */}
      <div className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-8 text-slate-900">
        
        {/* Title Block */}
        <div className="space-y-2 border-b border-slate-200 pb-6">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Confidential Enterprise Project Profile
          </span>
          <input
            type="text"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            className="w-full text-2xl sm:text-3xl font-black font-display text-slate-900 focus:outline-none bg-transparent hover:bg-slate-50 rounded-lg p-1"
          />
          <p className="text-xs text-slate-500">Location: {location}</p>
        </div>

        {/* Financial Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs">
          <div>
            <span className="text-[10px] text-slate-400 block">Total Project Outlay</span>
            <span className="font-bold text-slate-900">{formatCurrencyINR(projectCost)}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">Beneficiary Margin (10%)</span>
            <span className="font-bold text-slate-900">{formatCurrencyINR(marginCapital)}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">Requested Loan (90%)</span>
            <span className="font-bold text-emerald-700">{formatCurrencyINR(loanAmount)}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">MoSJE Scheme</span>
            <span className="font-bold text-purple-700 truncate block">{schemeResult.scheme?.name || 'Term Loan'}</span>
          </div>
        </div>

        {/* Section 1: Executive Overview */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">1. Executive Overview & Problem Statement</h3>
          <textarea
            rows={3}
            value={overview}
            onChange={(e) => setOverview(e.target.value)}
            className="w-full text-xs text-slate-700 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Section 2: Target Market */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">2. Target Market & Distribution Channels</h3>
          <textarea
            rows={3}
            value={targetMarket}
            onChange={(e) => setTargetMarket(e.target.value)}
            className="w-full text-xs text-slate-700 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Section 3: Operations & Logistics */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">3. Daily Operations, Machinery & Family Labor</h3>
          <textarea
            rows={3}
            value={operations}
            onChange={(e) => setOperations(e.target.value)}
            className="w-full text-xs text-slate-700 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Section 4: Statutory MoSJE Note */}
        <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 text-[11px] text-amber-900 leading-relaxed">
          <b>Applicant Undertaking:</b> The beneficiary certifies that the information submitted in this business profile is prepared for financial planning purposes under the concessional credit guidelines of the Ministry of Social Justice and Empowerment (MoSJE).
        </div>

      </div>
    </div>
  );
};
