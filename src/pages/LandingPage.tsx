import React from 'react';
import { 
  Building2, ArrowRight, MapPin, Bot, Calculator, Landmark, FileCheck, 
  CalendarCheck, ShieldCheck, Sparkles, Compass
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export const LandingPage: React.FC<{ navigate: (r: string) => void }> = ({ navigate }) => {
  const { isAuthenticated, loadDemo } = useAuth();
  const { t } = useLanguage();

  return (
    <div className="space-y-16 py-6 sm:py-10">
      
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        
        {/* Ministry Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-900 text-xs font-semibold shadow-xs">
          <Building2 className="w-3.5 h-3.5 text-blue-700" />
          <span>Ministry of Social Justice and Empowerment (MoSJE)</span>
        </div>

        {/* Hero Headings */}
        <div className="max-w-4xl mx-auto space-y-4">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight font-display">
            SMART ENTREPRENEUR <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-700">
              GUIDANCE PLATFORM
            </span>
          </h1>
          <p className="text-lg sm:text-2xl font-bold text-slate-700">
            “{t.tagline}”
          </p>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Understand your local market, plan your finances, discover suitable government schemes and build a practical, bank-ready path toward rural entrepreneurship.
          </p>
        </div>

        {/* Hero CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => navigate(isAuthenticated ? '/assessment' : '/register')}
            className="px-6 py-3 rounded-xl font-bold text-sm sm:text-base text-white bg-emerald-600 hover:bg-emerald-700 shadow-md hover:shadow-lg transition-all flex items-center gap-2 group active:scale-95"
          >
            <span>Start Business Assessment</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button
            onClick={() => navigate('/market-intelligence')}
            className="px-5 py-3 rounded-xl font-semibold text-sm sm:text-base text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 shadow-xs transition-all active:scale-95"
          >
            Explore Local Market GIS
          </button>

          <button
            onClick={() => {
              loadDemo();
              navigate('/dashboard');
            }}
            className="px-5 py-3 rounded-xl font-bold text-sm sm:text-base text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-300 shadow-xs transition-all flex items-center gap-2 active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Load Demo Entrepreneur (Andhra Dairy)</span>
          </button>
        </div>

        {/* Visual Workflow Diagram */}
        <div className="pt-8 max-w-5xl mx-auto">
          <div className="p-4 sm:p-6 bg-white rounded-2xl border border-slate-200/90 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-4">
              Integrated Grassroots Entrepreneurship Pipeline
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-3 text-xs font-bold text-slate-700">
              {[
                { label: 'Local Area', icon: MapPin, color: 'text-emerald-600 bg-emerald-50' },
                { label: 'Market Intel', icon: Compass, color: 'text-teal-600 bg-teal-50' },
                { label: 'AI Analysis', icon: Bot, color: 'text-indigo-600 bg-indigo-50' },
                { label: 'Feasibility', icon: FileCheck, color: 'text-blue-600 bg-blue-50' },
                { label: 'Financial Plan', icon: Calculator, color: 'text-amber-600 bg-amber-50' },
                { label: 'MoSJE Scheme', icon: Landmark, color: 'text-purple-600 bg-purple-50' },
                { label: 'Action Roadmap', icon: CalendarCheck, color: 'text-emerald-700 bg-emerald-100' },
              ].map((step) => {
                const Icon = step.icon;
                return (
                  <div key={step.label} className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/50 flex flex-col items-center text-center gap-2">
                    <div className={`p-2 rounded-lg ${step.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="leading-tight">{step.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            Platform Capabilities
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display">
            Built for Real Rural & Semi-Urban Conditions
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
            Everything needed to eliminate guesswork and structure a sustainable enterprise.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: "Hyper-Local Market Intelligence",
              desc: "Evaluate 5 km and 10 km customer clusters, household demographics, nearby mandis, and mapped competitor gaps.",
              icon: MapPin,
              color: "border-emerald-200 bg-emerald-50/30 text-emerald-700",
              route: "/market-intelligence"
            },
            {
              title: "Context-Aware SmartGuide AI",
              desc: "Ask business viability questions in English, Telugu, or Hindi grounded in your location, margin, and scheme parameters.",
              icon: Bot,
              color: "border-indigo-200 bg-indigo-50/30 text-indigo-700",
              route: "/ai-advisor"
            },
            {
              title: "Deterministic Financial Engine",
              desc: "Accurate 10% margin / 90% loan calculations, monthly working capital buffers, and unit break-even forecasting.",
              icon: Calculator,
              color: "border-amber-200 bg-amber-50/30 text-amber-700",
              route: "/financial-planner"
            },
            {
              title: "Smart MoSJE Scheme Router",
              desc: "Automated routing between Micro Finance Scheme (≤ ₹1.40L at 6.5%) and Term Loan Scheme (> ₹1.40L at 8.0%) with cap enforcement.",
              icon: Landmark,
              color: "border-purple-200 bg-purple-50/30 text-purple-700",
              route: "/scheme-router"
            },
            {
              title: "Multidimensional Feasibility Scoring",
              desc: "80+ metric benchmark covering local demand, supply access, pricing tiers, and complete 2x2 SWOT + Risk Radar.",
              icon: FileCheck,
              color: "border-blue-200 bg-blue-50/30 text-blue-700",
              route: "/feasibility"
            },
            {
              title: "30-Day Launch Action Plan",
              desc: "Week-by-week step checklist (market validation, quotes, loan application) with live activity history logging.",
              icon: CalendarCheck,
              color: "border-emerald-200 bg-emerald-50/30 text-emerald-700",
              route: "/action-plan"
            }
          ].map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                onClick={() => navigate(f.route)}
                className="p-6 rounded-2xl border border-slate-200/90 bg-white hover:border-slate-300 hover:shadow-md transition-all cursor-pointer group space-y-3"
              >
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${f.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  {f.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {f.desc}
                </p>
                <div className="pt-2 flex items-center gap-1 text-xs font-semibold text-emerald-600 group-hover:text-emerald-700">
                  <span>Explore Feature</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Trust & Ethics Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-950 text-white space-y-8">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950 border border-emerald-800 px-3 py-1 rounded-full">
              Trust & Responsibility
            </span>
            <h2 className="text-2xl sm:text-4xl font-black font-display tracking-tight">
              BUILT FOR GRASSROOTS ENTREPRENEURSHIP
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              We never fabricate government approvals or loan guarantees. We provide practical guidance so beneficiaries borrow responsibly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">LOCAL</span>
              <h4 className="text-base font-bold">Village-Focused Insights</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Ground-level understanding of rural demand, weekly mandis, and local supply chains tailored to your Gram Panchayat.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">SMART</span>
              <h4 className="text-base font-bold">AI-Assisted Recommendations</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Grounded advice that takes into account available family workforce, land assets, and local competition.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">RESPONSIBLE</span>
              <h4 className="text-base font-bold">Financial Planning First</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Clear visibility into moratorium periods, monthly EMI debt burdens, and working capital buffers before borrowing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Statutory Disclaimer Box */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-950 text-xs space-y-2">
          <div className="flex items-center gap-2 font-bold text-sm text-amber-900">
            <ShieldCheck className="w-4 h-4 text-amber-700" />
            <span>Statutory Planning Disclaimer</span>
          </div>
          <p className="leading-relaxed text-amber-800">
            {t.governmentDisclaimer}
          </p>
        </div>
      </section>
    </div>
  );
};
