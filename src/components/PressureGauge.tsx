import React from 'react';

interface PressureGaugeProps {
  id: string;
  value: number;
  expected: number;
  min?: number;
  max?: number;
  label: string;
  unit?: string;
  sectionCode?: string;
  onClick?: () => void;
}

export const PressureGauge: React.FC<PressureGaugeProps> = ({
  id,
  value,
  expected,
  min = 0,
  max = 8,
  label,
  unit = 'bar',
  sectionCode,
  onClick,
}) => {
  const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
  // 180 degree semi-circle gauge from -90 to +90 deg
  const angle = (percentage / 100) * 180 - 90;
  const expectedPercentage = Math.min(100, Math.max(0, ((expected - min) / (max - min)) * 100));
  const expectedAngle = (expectedPercentage / 100) * 180 - 90;

  // Determine zone
  const diff = Math.abs(value - expected);
  let statusColor = 'text-emerald-600';
  let badgeBg = 'bg-emerald-50 border-emerald-200 text-emerald-700';
  let arcStroke = '#10b981';

  if (diff > 1.2 || value < 3.0) {
    statusColor = 'text-rose-600';
    badgeBg = 'bg-rose-50 border-rose-200 text-rose-700';
    arcStroke = '#f43f5e';
  } else if (diff > 0.5) {
    statusColor = 'text-amber-600';
    badgeBg = 'bg-amber-50 border-amber-200 text-amber-700';
    arcStroke = '#f59e0b';
  }

  return (
    <div
      id={id}
      onClick={onClick}
      className={`bg-white border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-between text-center transition-all ${
        onClick ? 'cursor-pointer hover:border-sky-300 hover:shadow-sm' : ''
      }`}
    >
      <div className="w-full flex items-center justify-between mb-1">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          {label}
        </span>
        {sectionCode && (
          <span className={`text-xs px-2 py-0.5 rounded-md border font-mono font-bold ${badgeBg}`}>
            SEC {sectionCode}
          </span>
        )}
      </div>

      <div className="relative w-36 h-20 my-2 flex items-end justify-center">
        {/* SVG Arc Gauge */}
        <svg viewBox="0 0 100 55" className="w-36 h-20 overflow-visible">
          {/* Background Track */}
          <path
            d="M 10 50 A 40 40 0 0 1 90 50"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="8"
            strokeLinecap="round"
          />
          {/* Value Arc */}
          <path
            d="M 10 50 A 40 40 0 0 1 90 50"
            fill="none"
            stroke={arcStroke}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray="125.66"
            strokeDashoffset={125.66 * (1 - percentage / 100)}
            className="transition-all duration-700 ease-out"
          />

          {/* Expected Reference Needle Tick */}
          <g transform={`rotate(${expectedAngle} 50 50)`}>
            <line x1="50" y1="10" x2="50" y2="4" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" />
          </g>

          {/* Center Pivot Point */}
          <circle cx="50" cy="50" r="4.5" fill="#1e293b" />
          <circle cx="50" cy="50" r="2" fill="#ffffff" />

          {/* Indicator Needle */}
          <g
            transform={`rotate(${angle} 50 50)`}
            className="transition-transform duration-500 ease-out"
          >
            <polygon points="48,50 50,14 52,50" fill="#0f172a" />
          </g>
        </svg>
      </div>

      <div className="flex items-baseline gap-1 mt-1">
        <span className={`text-2xl font-bold font-mono tracking-tight ${statusColor}`}>
          {value.toFixed(2)}
        </span>
        <span className="text-xs text-slate-400 font-mono">{unit}</span>
      </div>

      <div className="flex items-center justify-between w-full text-xs text-slate-400 font-mono mt-2 pt-2 border-t border-slate-100">
        <span>Min: {min}</span>
        <span className="text-slate-600 font-semibold">Tgt: {expected.toFixed(1)}</span>
        <span>Max: {max}</span>
      </div>
    </div>
  );
};
