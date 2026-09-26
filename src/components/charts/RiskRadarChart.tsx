import React from 'react';
import { RiskRadarItem } from '../../types/business';
import { Badge } from '../ui/Badge';
import { ShieldCheck, AlertTriangle } from 'lucide-react';

export const RiskRadarChart: React.FC<{
  risks: RiskRadarItem[];
}> = ({ risks }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {risks.map((r) => {
          const badgeVariant = r.severity === 'Low' ? 'success' : r.severity === 'Medium' ? 'warning' : 'danger';

          return (
            <div
              key={r.category}
              className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all shadow-xs space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">{r.category} Risk</span>
                <Badge variant={badgeVariant}>{r.severity} Severity</Badge>
              </div>

              {/* Severity meter bar */}
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    r.severity === 'Low' ? 'bg-emerald-500' : r.severity === 'Medium' ? 'bg-amber-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${r.score}%` }}
                />
              </div>

              {/* Mitigation note */}
              <div className="pt-1 flex items-start gap-1.5 text-xs text-slate-600 bg-slate-50 p-2 rounded-lg">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                <span><b>Mitigation:</b> {r.mitigation}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
