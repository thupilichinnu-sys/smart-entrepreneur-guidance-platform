import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  ArrowRight, 
  TrendingUp, 
  Coins, 
  Landmark, 
  Clock, 
  ShieldAlert, 
  Sparkles, 
  CheckCircle2, 
  Plus, 
  MoreVertical, 
  FileText, 
  Bot, 
  MapPin, 
  Calculator, 
  Compass, 
  Calendar,
  Layers,
  Copy,
  Trash2,
  Edit2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { businessService } from '../services/businessService';
import { activityService } from '../services/activityService';
import { selectScheme, calculateEMI } from '../utils/financialEngine';
import { formatCurrencyINR, formatDateTime } from '../utils/formatting';
import { SavedBusinessPlan } from '../types/user';
import { ActivityItem } from '../types/activity';
import { AssessmentData } from '../types/assessment';
import { Modal } from '../components/ui/Modal';
import { ProgressBar } from '../components/ui/ProgressBar';

export const DashboardPage: React.FC<{ navigate: (r: string) => void }> = ({ navigate }) => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [assessment, setAssessment] = useState<AssessmentData | null>(null);
  const [savedPlans, setSavedPlans] = useState<SavedBusinessPlan[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  
  // Modals
  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [targetPlan, setTargetPlan] = useState<SavedBusinessPlan | null>(null);
  const [newPlanName, setNewPlanName] = useState('');

  const loadData = () => {
    if (!user) return;
    const currentAsm = businessService.getAssessment(user.id);
    setAssessment(currentAsm);
    setSavedPlans(businessService.getSavedPlans(user.id));
    setActivities(activityService.getActivities(user.id).slice(0, 5));
  };

  useEffect(() => {
    loadData();
  }, [user]);

  // Determine Greeting based on local hour
  const currentHour = new Date().getHours();
  const timeGreeting = currentHour < 12 ? 'Good Morning' : currentHour < 17 ? 'Good Afternoon' : 'Good Evening';

  // Compute live metrics
  const margin = assessment?.marginCapital || user?.marginCapital || 100000;
  const schemeResult = selectScheme(margin);
  const applicableLoan = schemeResult.applicableLoan;
  const projectCost = schemeResult.calculatedProjectCost;
  const schemeName = schemeResult.scheme?.name || 'Term Loan Scheme';
  const interestRate = schemeResult.scheme?.interestRate || 8.0;
  const tenureMonths = (schemeResult.scheme?.tenureYears || 7) * 12;
  const monthlyEMI = calculateEMI(applicableLoan, interestRate, tenureMonths);

  const businessFit = 82; // Score indicator
  const riskLevel = 'Medium';

  const handleDuplicate = (planId: string) => {
    if (!user) return;
    businessService.duplicatePlan(user.id, planId);
    activityService.logActivity(user.id, {
      type: 'SAVED_PLAN_CREATED',
      title: 'Business Plan Duplicated',
      description: 'Created a working copy of saved business plan.'
    });
    loadData();
  };

  const handleDeletePlan = (planId: string) => {
    if (!user) return;
    businessService.deletePlan(user.id, planId);
    loadData();
  };

  const handleRename = () => {
    if (!user || !targetPlan || !newPlanName.trim()) return;
    businessService.updatePlan(user.id, targetPlan.id, { businessName: newPlanName.trim() });
    setRenameModalOpen(false);
    setTargetPlan(null);
    setNewPlanName('');
    loadData();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Welcome Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-700/60 text-emerald-200 text-xs font-semibold">
            <Sparkles className="w-3 h-3 text-emerald-300" />
            <span>MoSJE Grassroots Enterprise Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight">
            {timeGreeting}, {user?.fullName || 'Entrepreneur'} 👋
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/80 max-w-xl">
            {t.dashboardSubtitle}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => navigate('/assessment')}
            className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs sm:text-sm shadow-sm transition-all flex items-center gap-2 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>New Assessment</span>
          </button>
          <button
            onClick={() => navigate('/ai-advisor')}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold rounded-xl text-xs sm:text-sm transition-all flex items-center gap-2"
          >
            <Bot className="w-4 h-4 text-emerald-300" />
            <span>Consult SmartGuide AI</span>
          </button>
        </div>
      </div>

      {/* 6 Key Financial & Fit Indicator Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Card 1: Business Fit */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1.5 hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">{t.businessFit}</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-emerald-700">{businessFit}<span className="text-xs font-medium text-slate-400">/100</span></p>
          <p className="text-[10px] text-slate-500 line-clamp-1">Based on local demand</p>
        </div>

        {/* Card 2: Project Capacity */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1.5 hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">{t.projectCapacity}</span>
            <Coins className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{formatCurrencyINR(projectCost, true)}</p>
          <p className="text-[10px] text-slate-500 line-clamp-1">Margin: {formatCurrencyINR(margin, true)}</p>
        </div>

        {/* Card 3: Potential Loan */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1.5 hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">{t.potentialLoan}</span>
            <Landmark className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-black text-indigo-700">{formatCurrencyINR(applicableLoan, true)}</p>
          <p className="text-[10px] text-slate-500 line-clamp-1">90% of Project Cost</p>
        </div>

        {/* Card 4: Recommended Scheme */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1.5 hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Scheme</span>
            <Building2 className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-base font-bold text-slate-900 leading-tight truncate" title={schemeName}>
            {schemeName.replace(' Scheme', '')}
          </p>
          <p className="text-[10px] text-purple-700 font-semibold">{interestRate}% Concessional</p>
        </div>

        {/* Card 5: Monthly EMI */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1.5 hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">{t.monthlyEMI}</span>
            <Calculator className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-black text-amber-700">{formatCurrencyINR(monthlyEMI)}</p>
          <p className="text-[10px] text-slate-500 line-clamp-1">Post 6-mo grace</p>
        </div>

        {/* Card 6: Risk Level */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1.5 hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">{t.riskLevel}</span>
            <ShieldAlert className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-emerald-700">{riskLevel}</p>
          <p className="text-[10px] text-slate-500 line-clamp-1">High mitigation fit</p>
        </div>
      </div>

      {/* Continue Where You Left Off Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-50 via-teal-50 to-white border border-emerald-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
              {t.continuePlan}
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">
              {assessment ? `${assessment.category} Enterprise Assessment` : 'Start Your First Business Assessment'}
            </h3>
            <p className="text-xs text-slate-600 max-w-xl">
              {assessment 
                ? `Location: ${assessment.location.village || assessment.location.district || 'Rural Cluster'} • Progress: ${assessment.progressPercent || 72}% complete.`
                : 'Evaluate local demand, discover recommended businesses, calculate loans, and structure a 30-day launch roadmap.'}
            </p>
            {assessment && (
              <div className="w-full max-w-xs pt-1">
                <ProgressBar progress={assessment.progressPercent || 72} color="emerald" height="sm" />
              </div>
            )}
          </div>

          <div>
            <button
              onClick={() => navigate('/assessment')}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-sm transition-all flex items-center gap-2 group active:scale-95 whitespace-nowrap"
            >
              <span>{assessment ? 'Continue Assessment' : 'Start Assessment'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Saved Business Plans & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Saved Business Plans */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">{t.savedPlans}</h2>
              <p className="text-xs text-slate-500">Manage and export your structured enterprise roadmaps.</p>
            </div>
            <button
              onClick={() => navigate('/assessment')}
              className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Plan</span>
            </button>
          </div>

          {savedPlans.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-slate-200 space-y-3">
              <FileText className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-700">No Saved Plans Yet</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Complete a business assessment to automatically generate and save your plan.
              </p>
              <button
                onClick={() => navigate('/assessment')}
                className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl"
              >
                Create Your First Plan →
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {savedPlans.map((plan) => (
                <div
                  key={plan.id}
                  className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {plan.status}
                      </span>
                      <span className="text-[10px] text-slate-400">{formatDateTime(plan.updatedAt)}</span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-sm line-clamp-1">{plan.businessName}</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span className="truncate">{plan.location}</span>
                    </p>

                    <div className="pt-2 grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-xl">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Project Cost</span>
                        <span className="font-bold text-slate-800">{formatCurrencyINR(plan.projectCost, true)}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Loan Amount</span>
                        <span className="font-bold text-emerald-700">{formatCurrencyINR(plan.loanAmount, true)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => navigate('/feasibility')}
                      className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                    >
                      <span>Open Plan</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setTargetPlan(plan);
                          setNewPlanName(plan.businessName);
                          setRenameModalOpen(true);
                        }}
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
                        title="Rename Plan"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDuplicate(plan.id)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
                        title="Duplicate Plan"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeletePlan(plan.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                        title="Delete Plan"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right 1 Col: Recent Activity */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">{t.recentActivities}</h2>
            <button
              onClick={() => navigate('/activities')}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
            >
              {t.viewAll}
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs divide-y divide-slate-100">
            {activities.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">Your activity history will appear here.</p>
            ) : (
              activities.map((act) => (
                <div key={act.id} className="py-3 first:pt-0 last:pb-0 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs font-bold text-slate-900">{act.title}</h4>
                    <span className="text-[10px] text-slate-400 whitespace-nowrap">
                      {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-2">{act.description}</p>
                  {act.actionUrl && (
                    <button
                      onClick={() => navigate(act.actionUrl!)}
                      className="text-[11px] font-semibold text-emerald-700 hover:underline pt-0.5 inline-block"
                    >
                      {act.actionLabel || 'View →'}
                    </button>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Quick Tool Navigation Box */}
          <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Quick Access Tools</span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => navigate('/market-intelligence')}
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-left font-semibold flex items-center gap-2"
              >
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>Market GIS</span>
              </button>
              <button
                onClick={() => navigate('/scheme-router')}
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-left font-semibold flex items-center gap-2"
              >
                <Landmark className="w-3.5 h-3.5 text-purple-400" />
                <span>Scheme Router</span>
              </button>
              <button
                onClick={() => navigate('/repayment')}
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-left font-semibold flex items-center gap-2"
              >
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>Repayment EMI</span>
              </button>
              <button
                onClick={() => navigate('/compare')}
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-left font-semibold flex items-center gap-2"
              >
                <Layers className="w-3.5 h-3.5 text-blue-400" />
                <span>Compare</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Rename Plan Modal */}
      <Modal
        isOpen={renameModalOpen}
        onClose={() => setRenameModalOpen(false)}
        title="Rename Business Plan"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Business Plan Title</label>
            <input
              type="text"
              value={newPlanName}
              onChange={(e) => setNewPlanName(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setRenameModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleRename}
              className="px-4 py-2 text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 rounded-xl"
            >
              Save Changes
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
