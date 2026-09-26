import React from 'react';

export const ProgressBar: React.FC<{
  progress: number;
  label?: string;
  showPercent?: boolean;
  color?: 'emerald' | 'blue' | 'amber';
  height?: 'sm' | 'md';
  className?: string;
}> = ({
  progress,
  label,
  showPercent = true,
  color = 'emerald',
  height = 'md',
  className = ''
}) => {
  const clamped = Math.max(0, Math.min(100, progress));

  const colorStyles = {
    emerald: 'bg-emerald-500',
    blue: 'bg-blue-600',
    amber: 'bg-amber-500'
  };

  const heightStyles = {
    sm: 'h-1.5',
    md: 'h-2.5'
  };

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercent) && (
        <div className="flex justify-between items-center text-xs font-medium text-slate-600 mb-1.5">
          {label && <span>{label}</span>}
          {showPercent && <span className="font-semibold text-slate-900">{clamped}%</span>}
        </div>
      )}
      <div className={`w-full bg-slate-100 rounded-full overflow-hidden ${heightStyles[height]}`}>
        <div
          className={`h-full transition-all duration-300 rounded-full ${colorStyles[color]}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};
