import React from 'react';

interface StatusBadgeProps {
  status: 'normal' | 'warning' | 'critical' | 'offline' | 'NORMAL' | 'WARNING' | 'CRITICAL' | 'OFFLINE' | 'active' | 'resolved' | string;
  size?: 'sm' | 'md' | 'lg';
  showPulse?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md', showPulse = false }) => {
  const norm = status?.toLowerCase() || 'normal';

  let bg = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  let dot = 'bg-emerald-500';
  let label = 'NORMAL';

  if (norm === 'warning') {
    bg = 'bg-amber-50 text-amber-700 border-amber-200';
    dot = 'bg-amber-500';
    label = 'WARNING';
  } else if (norm === 'critical' || norm === 'error') {
    bg = 'bg-rose-50 text-rose-700 border-rose-200';
    dot = 'bg-rose-600';
    label = 'CRITICAL';
  } else if (norm === 'offline' || norm === 'standby') {
    bg = 'bg-slate-100 text-slate-600 border-slate-200';
    dot = 'bg-slate-400';
    label = norm.toUpperCase();
  } else if (norm === 'active') {
    bg = 'bg-rose-50 text-rose-700 border-rose-200';
    dot = 'bg-rose-600';
    label = 'ACTIVE';
  } else if (norm === 'resolved') {
    bg = 'bg-blue-50 text-blue-700 border-blue-200';
    dot = 'bg-blue-500';
    label = 'RESOLVED';
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1.5',
    md: 'text-xs font-semibold px-2.5 py-1 gap-1.5',
    lg: 'text-sm font-semibold px-3 py-1.5 gap-2',
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-full border ${bg} ${sizeClasses} tracking-wide font-mono uppercase transition-colors`}
    >
      <span className="relative flex h-2 w-2">
        {showPulse && (norm === 'critical' || norm === 'warning') && (
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full ${dot} opacity-75`}
          />
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${dot}`} />
      </span>
      {label}
    </span>
  );
};
