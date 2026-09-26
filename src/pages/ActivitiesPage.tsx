import React, { useState, useEffect } from 'react';
import { History, Filter, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { activityService } from '../services/activityService';
import { ActivityItem, ActivityFilter } from '../types/activity';
import { formatDateTime } from '../utils/formatting';

export const ActivitiesPage: React.FC<{ navigate: (r: string) => void }> = ({ navigate }) => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [filter, setFilter] = useState<ActivityFilter>('all');

  useEffect(() => {
    if (user) {
      setActivities(activityService.getActivities(user.id));
    }
  }, [user]);

  const filtered = activities.filter((act) => {
    if (filter === 'all') return true;
    if (filter === 'assessments') return act.type === 'ASSESSMENT_COMPLETED';
    if (filter === 'financial') return act.type === 'FINANCIAL_PLAN_CREATED';
    if (filter === 'schemes') return act.type === 'SCHEME_CHECKED';
    if (filter === 'ai') return act.type === 'AI_ADVISOR_USED';
    if (filter === 'reports') return act.type === 'FEASIBILITY_GENERATED' || act.type === 'REPORT_DOWNLOADED';
    if (filter === 'profile') return act.type === 'PROFILE_UPDATED';
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-semibold border border-slate-200">
            <History className="w-3.5 h-3.5" />
            <span>Audit Trail & Activity Log</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display">ACTIVITY HISTORY</h1>
          <p className="text-xs text-slate-500">Chronological timeline of all enterprise planning milestones.</p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {[
            { id: 'all', label: 'All' },
            { id: 'assessments', label: 'Assessments' },
            { id: 'financial', label: 'Financial' },
            { id: 'schemes', label: 'Schemes' },
            { id: 'reports', label: 'Reports' },
            { id: 'ai', label: 'AI' }
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id as ActivityFilter)}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all whitespace-nowrap ${
                filter === f.id
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
        {filtered.length === 0 ? (
          <p className="text-xs text-slate-400 py-12 text-center">No activities recorded in this category.</p>
        ) : (
          <div className="relative border-l-2 border-slate-100 ml-4 space-y-6 pl-6">
            {filtered.map((act) => (
              <div key={act.id} className="relative group">
                <div className="absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full bg-emerald-600 border-2 border-white shadow-xs" />
                <div className="p-4 rounded-2xl bg-slate-50 hover:bg-emerald-50/40 border border-slate-100 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900">{act.title}</h4>
                      {act.relatedBusiness && (
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                          {act.relatedBusiness}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600">{act.description}</p>
                    <span className="text-[10px] text-slate-400 block pt-0.5">
                      {formatDateTime(act.timestamp)}
                    </span>
                  </div>

                  {act.actionUrl && (
                    <button
                      onClick={() => navigate(act.actionUrl!)}
                      className="self-start sm:self-auto px-3 py-1.5 bg-white hover:bg-emerald-600 hover:text-white text-emerald-700 font-bold text-xs rounded-xl border border-slate-200 shadow-2xs transition-all flex items-center gap-1"
                    >
                      <span>{act.actionLabel || 'View →'}</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
