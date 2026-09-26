import React from 'react';
import { MapPin, Users, Store, TrendingUp, AlertTriangle, ArrowRight, Layers, Eye } from 'lucide-react';
import { MarketMap } from '../components/maps/MarketMap';
import { DEMO_LOCATION_GEO, DEMO_COMPETITORS } from '../data/marketGeoData';
import { useLanguage } from '../context/LanguageContext';

export const MarketIntelligencePage: React.FC<{ navigate: (r: string) => void }> = ({ navigate }) => {
  const { t } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
          <MapPin className="w-3.5 h-3.5 text-emerald-600" />
          <span>Hyper-Local GIS Market Analysis</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display">
          HYPER-LOCAL MARKET INTELLIGENCE
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
          Visualizing the 5 km direct consumer cluster and 10 km regional mandi perimeter around {DEMO_LOCATION_GEO.name}.
        </p>
      </div>

      {/* Demographics Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-slate-500">Surrounding Population</span>
          <p className="text-xl font-bold text-slate-900">{DEMO_LOCATION_GEO.population.toLocaleString('en-IN')}</p>
          <span className="text-[10px] text-slate-400">Within 5km radius</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-slate-500">Estimated Households</span>
          <p className="text-xl font-bold text-emerald-700">{DEMO_LOCATION_GEO.households.toLocaleString('en-IN')}</p>
          <span className="text-[10px] text-slate-400">Potential daily buyers</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-slate-500">Avg. Monthly Income</span>
          <p className="text-xl font-bold text-slate-900">₹{DEMO_LOCATION_GEO.avgMonthlyIncome.toLocaleString('en-IN')}</p>
          <span className="text-[10px] text-slate-400">Agricultural & trade base</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-slate-500">Daily Milk Consumption</span>
          <p className="text-xl font-bold text-blue-700">{DEMO_LOCATION_GEO.dairyDemandLitersDay} L/day</p>
          <span className="text-[10px] text-slate-400">Estimated local demand</span>
        </div>
      </div>

      {/* Interactive Leaflet Map */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Interactive GIS Radius Map (5 km & 10 km Zones)
          </span>
          <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
            DEMO DATA MODE
          </span>
        </div>
        <MarketMap centerLat={DEMO_LOCATION_GEO.lat} centerLng={DEMO_LOCATION_GEO.lng} className="h-[450px]" />
      </div>

      {/* Competitor Mapping & Identified Gaps */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900 font-display">
          Local Competitor Mapping & Identified Market Gaps
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {DEMO_COMPETITORS.map((comp) => (
            <div key={comp.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{comp.name}</h4>
                  <p className="text-xs text-slate-500">{comp.category} • {comp.distanceKm} km away</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  {comp.priceLevel}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-red-50/60 border border-red-100 text-xs text-red-950 space-y-1">
                <span className="font-bold text-red-800 block flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                  Market Gap Opportunity:
                </span>
                <p>{comp.keyGaps}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3 Specific Market Opportunities */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900 font-display">
          Grassroots Market Opportunities Generated by AI
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              title: "Doorstep Morning Delivery",
              audience: "Working households & young families",
              growth: "₹42,000 / mo potential",
              desc: "Unadulterated fresh milk delivery before 6:30 AM directly bypassing commercial chilling delays."
            },
            {
              title: "Local Sweet Stall Bulk Supply",
              audience: "4 highway dhabas & tea stalls",
              growth: "35% higher margin",
              desc: "Supply bulk high-fat milk for evening paneer, curd and sweets at predictable contract rates."
            },
            {
              title: "Organic Slurry & Manure",
              audience: "Mango and fruit orchard farmers",
              growth: "Zero added cost",
              desc: "Package organic cattle dung as vermicompost for local horticulture farmers."
            }
          ].map((opp) => (
            <div key={opp.title} className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">{opp.audience}</span>
              <h4 className="font-bold text-sm text-slate-900">{opp.title}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{opp.desc}</p>
              <div className="pt-2 text-xs font-bold text-emerald-700">{opp.growth}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Navigation CTA */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-sm">Ready to structure your business finances?</h4>
          <p className="text-xs text-slate-400">See your loan calculations, MoSJE scheme match, and EMI breakdown.</p>
        </div>
        <button
          onClick={() => navigate('/financial-planner')}
          className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2"
        >
          <span>Open Financial Planner</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
