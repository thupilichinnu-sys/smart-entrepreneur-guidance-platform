import React, { useState, useEffect } from 'react';
import { 
  CalendarCheck, CheckCircle2, Circle, ArrowRight, Sparkles, 
  ShieldCheck, HelpCircle, Layers, CheckSquare
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { activityService } from '../services/activityService';
import { storageService } from '../services/storageService';

interface ActionTask {
  id: string;
  week: number;
  title: string;
  desc: string;
  completed: boolean;
}

const DEFAULT_TASKS: ActionTask[] = [
  // Week 1
  { id: 'w1_1', week: 1, title: 'Survey 15 local residential households', desc: 'Confirm daily milk consumption, preferred timing, and willingness to pay ₹56-58/L.', completed: true },
  { id: 'w1_2', week: 1, title: 'Map informal competitor delivery routes', desc: 'Identify gaps in evening milk availability and adulteration concerns.', completed: true },
  { id: 'w1_3', week: 1, title: 'Inspect fodder land and water availability', desc: 'Verify borewell output and prepare 0.5 acre green fodder seed beds.', completed: false },

  // Week 2
  { id: 'w2_1', week: 2, title: 'Collect 2 signed vendor quotations for milch cattle', desc: 'Source quotes from certified district livestock haats with vaccination records.', completed: false },
  { id: 'w2_2', week: 2, title: 'Inquire with local Veterinary Officer', desc: 'Confirm subsidized cattle insurance and artificial insemination schedules.', completed: false },
  { id: 'w2_3', week: 2, title: 'Price automated chaff cutter & milk cans', desc: 'Obtain machinery specs eligible for MoSJE capital expenditure funding.', completed: false },

  // Week 3
  { id: 'w3_1', week: 3, title: 'Conduct trial milk distribution with 5 neighbors', desc: 'Gather direct feedback on taste, fat thickness, and morning delivery promptness.', completed: false },
  { id: 'w3_2', week: 3, title: 'Secure 2 bulk commercial tea stall contracts', desc: 'Agree on evening 15L delivery at guaranteed wholesale rate of ₹52/L.', completed: false },
  { id: 'w3_3', week: 3, title: 'Test basic bookkeeping app or diary', desc: 'Set up daily customer ledger for cash vs. UPI receipts.', completed: false },

  // Week 4
  { id: 'w4_1', week: 4, title: 'Finalize 10% margin deposit in bank account', desc: 'Deposit ₹1,00,000 equity in nationalized or Gramin cooperative bank.', completed: false },
  { id: 'w4_2', week: 4, title: 'Assemble MoSJE scheme application dossier', desc: 'Attach Aadhaar, Caste Certificate, Income Certificate, and Detailed Project Profile.', completed: false },
  { id: 'w4_3', week: 4, title: 'Submit DPR to District Social Welfare Officer / Bank Branch', desc: 'Obtain formal loan application acknowledgement receipt.', completed: false }
];

const READINESS_CHECKLIST = [
  'Business idea & category finalized',
  'Local 5 km market validated with customers',
  'Total project cost estimated accurately',
  '10% beneficiary margin capital available in bank',
  'Concessional loan requirement calculated',
  'MoSJE scheme identified with cap limits respected',
  'Moratorium interest and repayment EMI understood',
  'Equipment / livestock vendor quotations collected',
  'Basic business plan & cashflow estimate prepared',
  'Required KYC and community certificates verified'
];

export const ActionPlanPage: React.FC<{ navigate: (r: string) => void }> = ({ navigate }) => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [tasks, setTasks] = useState<ActionTask[]>(DEFAULT_TASKS);
  const [readiness, setReadiness] = useState<Record<number, boolean>>({ 0: true, 1: true, 2: true, 3: true, 4: true, 5: true });

  useEffect(() => {
    if (user) {
      const savedTasks = storageService.getItem<ActionTask[]>(user.id, 'action_tasks', DEFAULT_TASKS);
      setTasks(savedTasks);
      const savedReadiness = storageService.getItem<Record<number, boolean>>(user.id, 'readiness_checks', { 0: true, 1: true, 2: true, 3: true, 4: true, 5: true });
      setReadiness(savedReadiness);
    }
  }, [user]);

  const toggleTask = (taskId: string) => {
    if (!user) return;
    const updated = tasks.map(t => {
      if (t.id === taskId) {
        const nextState = !t.completed;
        if (nextState) {
          // Log automated activity event
          activityService.logActivity(user.id, {
            type: 'ACTION_ITEM_COMPLETED',
            title: 'Action Item Completed',
            description: `Finished: ${t.title}`
          });
          try { confetti({ particleCount: 40, spread: 50 }); } catch {}
        }
        return { ...t, completed: nextState };
      }
      return t;
    });

    setTasks(updated);
    storageService.setItem(user.id, 'action_tasks', updated);
  };

  const toggleReadiness = (index: number) => {
    if (!user) return;
    const updated = { ...readiness, [index]: !readiness[index] };
    setReadiness(updated);
    storageService.setItem(user.id, 'readiness_checks', updated);
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const progressPercent = Math.round((completedCount / tasks.length) * 100);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
          <CalendarCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Launch Readiness Roadmap</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display">
          30-DAY BUSINESS ACTION PLAN
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
          Actionable milestone checklist. Progress automatically synchronizes with your profile timeline.
        </p>
      </div>

      {/* Progress Bar Header */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-slate-900">Roadmap Progress:</span>
            <span className="text-base font-black text-emerald-700">{completedCount} of {tasks.length} Completed</span>
          </div>
          <p className="text-xs text-slate-500">Checking tasks automatically logs verification in your Activity Timeline.</p>
        </div>
        <div className="text-right">
          <span className="text-3xl font-black text-emerald-700">{progressPercent}%</span>
        </div>
      </div>

      {/* 4 Weeks Breakdown */}
      <div className="space-y-6">
        {[1, 2, 3, 4].map((wk) => {
          const weekTasks = tasks.filter(t => t.week === wk);
          const weekTitle = 
            wk === 1 ? 'WEEK 1 — Market & Customer Validation' :
            wk === 2 ? 'WEEK 2 — Supplier Identification & Quotations' :
            wk === 3 ? 'WEEK 3 — Customer Pilot & Operations Setup' :
            'WEEK 4 — Bank Application & Scheme Sanction Preparation';

          return (
            <div key={wk} className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 font-display flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 text-xs flex items-center justify-center font-black">
                    W{wk}
                  </span>
                  <span>{weekTitle}</span>
                </h3>
                <span className="text-xs font-semibold text-slate-400">
                  {weekTasks.filter(t => t.completed).length}/{weekTasks.length} Done
                </span>
              </div>

              <div className="space-y-3">
                {weekTasks.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => toggleTask(t.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                      t.completed 
                        ? 'bg-emerald-50/50 border-emerald-300 text-slate-600' 
                        : 'bg-slate-50/50 hover:bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  >
                    <div className="mt-0.5 flex-shrink-0">
                      {t.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-300 hover:text-slate-400" />
                      )}
                    </div>
                    <div className="space-y-0.5">
                      <h4 className={`text-xs font-bold ${t.completed ? 'line-through text-emerald-950 font-semibold' : 'text-slate-900'}`}>
                        {t.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        {t.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Financing Readiness Checklist */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-950 text-white space-y-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-900/80 text-emerald-300 text-xs font-bold border border-emerald-700">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Bank & Scheme Readiness Checklist</span>
          </div>
          <h3 className="text-lg font-bold font-display">FINANCING READINESS EVALUATION</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Ensure every preparatory milestone is fulfilled before submitting your formal file to the bank branch.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {READINESS_CHECKLIST.map((item, idx) => {
            const isChecked = !!readiness[idx];
            return (
              <div
                key={idx}
                onClick={() => toggleReadiness(idx)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 text-xs ${
                  isChecked 
                    ? 'bg-white/10 border-emerald-500 text-emerald-200 font-semibold' 
                    : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                }`}
              >
                <div className="flex-shrink-0">
                  {isChecked ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-500" />
                  )}
                </div>
                <span>{item}</span>
              </div>
            );
          })}
        </div>

        <p className="text-[11px] text-slate-400 pt-2 border-t border-white/10">
          * Note: Document checklist is advisory. Verified requirements are subject to final scrutiny by the sanctioning bank authority.
        </p>
      </div>

      {/* Bottom CTA to SmartGuide AI */}
      <div className="p-6 rounded-3xl bg-emerald-600 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-sm">Need help executing an action item?</h4>
          <p className="text-xs text-emerald-100">Ask SmartGuide AI for vendor contact scripts or quotation templates.</p>
        </div>
        <button
          onClick={() => navigate('/ai-advisor')}
          className="px-5 py-2.5 bg-white text-emerald-900 font-bold rounded-xl text-xs sm:text-sm shadow-md hover:bg-emerald-50 transition-all flex items-center gap-2"
        >
          <span>Ask SmartGuide AI</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
