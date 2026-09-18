import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  id: string;
  label: string;
  value: string | number;
  unit?: string;
  delta?: {
    value: string;
    isPositiveGood?: boolean;
    isPositive?: boolean;
  };
  icon?: LucideIcon;
  description?: string;
  statusBadge?: React.ReactNode;
  variant?: 'default' | 'critical' | 'warning' | 'accent';
  onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  id,
  label,
  value,
  unit,
  delta,
  icon: Icon,
  description,
  statusBadge,
  variant = 'default',
  onClick,
}) => {
  let borderClass = 'border-slate-200 hover:border-sky-300';
  let bgClass = 'bg-white';
  let iconBg = 'bg-sky-50 text-sky-600';

  if (variant === 'critical') {
    borderClass = 'border-rose-300 bg-rose-50/30';
    iconBg = 'bg-rose-100 text-rose-600';
  } else if (variant === 'warning') {
    borderClass = 'border-amber-300 bg-amber-50/20';
    iconBg = 'bg-amber-100 text-amber-700';
  } else if (variant === 'accent') {
    borderClass = 'border-blue-200 bg-blue-50/30';
    iconBg = 'bg-blue-100 text-blue-700';
  }

  return (
    <div
      id={id}
      onClick={onClick}
      className={`rounded-xl border p-5 ${bgClass} ${borderClass} shadow-xs transition-all ${
        onClick ? 'cursor-pointer hover:shadow-md hover:-translate-y-0.5' : ''
      }`}
    >
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-xs font-semibold text-slate-500 tracking-wider uppercase">
          {label}
        </span>
        <div className="flex items-center gap-2">
          {statusBadge}
          {Icon && (
            <div className={`p-2 rounded-lg ${iconBg}`}>
              <Icon className="w-4 h-4" />
            </div>
          )}
        </div>
      </div>

      <div className="flex items-baseline gap-2 mb-2">
        <span className="text-3xl font-bold font-mono tracking-tight text-slate-900">
          {value}
        </span>
        {unit && <span className="text-sm font-medium text-slate-500 font-mono">{unit}</span>}
      </div>

      <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
        {description && <span className="text-slate-500 truncate">{description}</span>}
        {delta && (
          <span
            className={`font-mono font-medium ml-auto pl-2 shrink-0 ${
              delta.isPositive
                ? delta.isPositiveGood
                  ? 'text-emerald-600'
                  : 'text-rose-600'
                : delta.isPositiveGood
                ? 'text-rose-600'
                : 'text-emerald-600'
            }`}
          >
            {delta.isPositive ? '▲' : '▼'} {delta.value}
          </span>
        )}
      </div>
    </div>
  );
};
