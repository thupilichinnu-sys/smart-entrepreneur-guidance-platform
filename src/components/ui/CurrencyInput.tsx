import React from 'react';

export const CurrencyInput: React.FC<{
  value: number;
  onChange: (val: number) => void;
  label?: string;
  quickAmounts?: { label: string; value: number }[];
  helperText?: string;
  error?: string;
  min?: number;
  max?: number;
}> = ({
  value,
  onChange,
  label = "Available Margin Capital",
  quickAmounts = [
    { label: "₹25K", value: 25000 },
    { label: "₹50K", value: 50000 },
    { label: "₹1L", value: 100000 },
    { label: "₹2L", value: 200000 },
    { label: "₹5L", value: 500000 },
    { label: "₹10L", value: 1000000 }
  ],
  helperText,
  error,
  min = 5000,
  max = 50000000
}) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-semibold text-slate-800">
          {label} <span className="text-emerald-600">*</span>
        </label>
      )}

      <div className="relative rounded-xl shadow-sm">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 font-semibold text-base">
          ₹
        </div>
        <input
          type="number"
          min={min}
          max={max}
          step={5000}
          value={value || ''}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
          className={`w-full pl-8 pr-4 py-2.5 text-base sm:text-lg font-bold text-slate-900 bg-white rounded-xl border ${
            error ? 'border-red-400 focus:ring-red-400' : 'border-slate-300 focus:ring-emerald-500 focus:border-emerald-500'
          } focus:outline-none focus:ring-2`}
          placeholder="e.g. 100000"
        />
      </div>

      {quickAmounts && quickAmounts.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {quickAmounts.map((q) => (
            <button
              key={q.value}
              type="button"
              onClick={() => onChange(q.value)}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg border transition-all ${
                value === q.value
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
              }`}
            >
              {q.label}
            </button>
          ))}
        </div>
      )}

      {error ? (
        <p className="text-xs text-red-600 font-medium">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-slate-500">{helperText}</p>
      ) : null}
    </div>
  );
};
