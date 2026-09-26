import React, { useState, useEffect } from 'react';
import { 
  FileCheck, ArrowRight, Printer, Download, Share2, Sparkles, 
  ShieldAlert, TrendingUp, CheckCircle2, AlertTriangle, Coins, Landmark
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { businessService } from '../services/businessService';
import { reportService } from '../services/reportService';
import { activityService } from '../services/activityService';
import { DEMO_FEASIBILITY_REPORT } from '../data/demoData';
import { FeasibilityReport } from '../types/business';
import { FeasibilityBreakdownChart } from '../components/charts/FeasibilityBreakdownChart';
import { RiskRadarChart } from '../components/charts/RiskRadarChart';
import { AudioSpeakerButton } from '../components/common/AudioSpeakerButton';
import { formatCurrencyINR, formatDateTime } from '../utils/formatting';

export const FeasibilityPage: React.FC<{ navigate: (r: string) => void }> = ({ navigate }) => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [report, setReport] = useState<FeasibilityReport>(DEMO_FEASIBILITY_REPORT);

  useEffect(() => {
    if (user) {
      const reports = reportService.getReports(user.id);
      if (reports.length > 0) {
        setReport(reports[0]);
      } else {
        const assessment = businessService.getAssessment(user.id);
        if (assessment) {
          const generated = businessService.generateFeasibilityReport(assessment);
          reportService.saveReport(user.id, generated);
          setReport(generated);
        }
      }
    }
  }, [user]);

  const handlePrint = () => {
    if (user) {
      activityService.logActivity(user.id, {
        type: 'REPORT_DOWNLOADED',
        title: 'Feasibility Report Printed/Downloaded',
        description: `${report.businessName} (Score: ${report.overallScore}/100)`
      });
    }
    window.print();
  };

  const fullSpeechText = `${report.businessName}. Overall Feasibility Score is ${report.overallScore} out of 100. Status: ${report.status}. ${report.aiExecutiveSummary.verdict}. Suggested Starting Scale: ${report.aiExecutiveSummary.startingScale}. Target Customers: ${report.aiExecutiveSummary.targetCustomers}.`;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Header with Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 no-print">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
            <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>AI-Assisted Feasibility Analysis</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display">
            BUSINESS FEASIBILITY REPORT
          </h1>
          <p className="text-xs text-slate-500">
            Generated for {report.businessName} • {formatDateTime(report.dateGenerated)}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <AudioSpeakerButton textToSpeak={fullSpeechText} />
          
          <button
            onClick={handlePrint}
            className="px-3.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl border border-slate-300 shadow-xs flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print / Save PDF</span>
          </button>

          <button
            onClick={() => navigate('/financial-planner')}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5"
          >
            <span>Structure Finances →</span>
          </button>
        </div>
      </div>

      {/* Main Score & Status Hero Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-700 text-emerald-200">
            {report.status}
          </span>
          <h2 className="text-xl sm:text-2xl font-bold font-display">{report.businessName}</h2>
          <p className="text-xs text-emerald-100/80 leading-relaxed">
            {report.aiExecutiveSummary.verdict}
          </p>
          <div className="pt-1 flex flex-wrap items-center gap-4 text-xs text-emerald-200">
            <span>Target Market: <b>{report.aiExecutiveSummary.targetCustomers}</b></span>
            <span>Starting Scale: <b>{report.aiExecutiveSummary.startingScale}</b></span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white/10 backdrop-blur border border-white/20 text-center flex-shrink-0">
          <span className="text-xs text-emerald-200 block font-semibold">Overall Feasibility</span>
          <div className="text-4xl sm:text-5xl font-black text-white my-1">{report.overallScore}</div>
          <span className="text-[11px] text-emerald-300 font-semibold">out of 100 Points</span>
        </div>
      </div>

      {/* Pillars Breakdown Chart & Pricing Intelligence */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Pillars Breakdown */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <FeasibilityBreakdownChart metrics={report.metrics} overallScore={report.overallScore} />
        </div>

        {/* Right 1 Col: Pricing Intelligence */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              Indicative Local Pricing
            </span>
            <p className="text-[11px] text-slate-500">
              Benchmarked against local rural and semi-urban transactions.
            </p>

            <div className="space-y-2 pt-1">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-600">Entry Level:</span>
                <span className="font-bold text-slate-900">{report.pricing.entryPrice}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-between text-xs">
                <span className="text-emerald-900 font-medium">Competitive Market:</span>
                <span className="font-bold text-emerald-950">{report.pricing.competitivePrice}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-between text-xs">
                <span className="text-purple-900 font-medium">Value-Added / Premium:</span>
                <span className="font-bold text-purple-950">{report.pricing.premiumPrice}</span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/80 text-[10px] text-amber-900 leading-relaxed">
            <b>Pricing Note:</b> Pricing is indicative and should be validated against current local market conditions.
          </div>
        </div>
      </div>

      {/* 2x2 SWOT Grid */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-slate-900 font-display">SWOT Analysis Matrix</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Strengths */}
          <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
            <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Strengths
            </h4>
            <ul className="space-y-1.5 text-xs text-emerald-950">
              {report.swot.strengths.map((s, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Weaknesses */}
          <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
            <h4 className="font-bold text-xs uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              Weaknesses
            </h4>
            <ul className="space-y-1.5 text-xs text-amber-950">
              {report.swot.weaknesses.map((w, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Opportunities */}
          <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-2">
            <h4 className="font-bold text-xs uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              Opportunities
            </h4>
            <ul className="space-y-1.5 text-xs text-blue-950">
              {report.swot.opportunities.map((o, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>{o}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Threats */}
          <div className="p-5 rounded-2xl bg-red-50/70 border border-red-200 space-y-2">
            <h4 className="font-bold text-xs uppercase tracking-wider text-red-900 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-red-600" />
              Threats & Headwinds
            </h4>
            <ul className="space-y-1.5 text-xs text-red-950">
              {report.swot.threats.map((t, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-red-600 font-bold">•</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Business Risk Radar & Mitigation */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 font-display">Business Risk Radar & Actionable Mitigations</h3>
          <p className="text-xs text-slate-500">Categorized evaluation across operational and market risk dimensions.</p>
        </div>
        <RiskRadarChart risks={report.riskRadar} />
      </div>

      {/* Immediate Next Steps CTA */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 no-print">
        <div className="space-y-2">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Next Step in Pipeline</span>
          <h3 className="text-lg font-bold">Structure Project Financing & Scheme Routing</h3>
          <p className="text-xs text-slate-300 max-w-xl">
            Confirm your 10% margin capital, inspect calculated 90% loan eligibility, verify moratorium interest, and view your monthly amortization schedule.
          </p>
        </div>

        <button
          onClick={() => navigate('/financial-planner')}
          className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-sm shadow-md transition-all flex items-center gap-2 group whitespace-nowrap"
        >
          <span>Open Financial Planner</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

    </div>
  );
};
