import React, { useState, useEffect } from 'react';
import { FileCheck, Printer, Trash2, ArrowRight, Eye, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { reportService } from '../services/reportService';
import { FeasibilityReport } from '../types/business';
import { formatDateTime } from '../utils/formatting';

export const ReportsPage: React.FC<{ navigate: (r: string) => void }> = ({ navigate }) => {
  const { user } = useAuth();
  const [reports, setReports] = useState<FeasibilityReport[]>([]);

  const loadReports = () => {
    if (!user) return;
    setReports(reportService.getReports(user.id));
  };

  useEffect(() => {
    loadReports();
  }, [user]);

  const handleDelete = (id: string) => {
    if (!user) return;
    reportService.deleteReport(user.id, id);
    loadReports();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display">MY REPORTS</h1>
          <p className="text-xs text-slate-500">Access and print generated feasibility dossiers.</p>
        </div>
        <button
          onClick={() => navigate('/assessment')}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs"
        >
          New Feasibility Study
        </button>
      </div>

      {reports.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-200 space-y-3">
          <FileCheck className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-700">No Reports Generated Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Complete a business assessment to generate your first bank-ready feasibility dossier.
          </p>
          <button
            onClick={() => navigate('/assessment')}
            className="px-5 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl"
          >
            Start Business Assessment →
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reports.map((rep) => (
            <div
              key={rep.id}
              className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {rep.status}
                  </span>
                  <span className="text-xs text-slate-400">{formatDateTime(rep.dateGenerated)}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900">{rep.businessName}</h3>
                <p className="text-xs text-slate-500 line-clamp-2">{rep.aiExecutiveSummary.verdict}</p>

                <div className="pt-2 flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Feasibility Score</span>
                    <span className="text-base font-black text-emerald-700">{rep.overallScore}/100</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Category</span>
                    <span className="font-bold text-slate-800">{rep.category}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => navigate('/feasibility')}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Full Report</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl"
                    title="Print / PDF"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(rep.id)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl"
                    title="Delete Report"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
