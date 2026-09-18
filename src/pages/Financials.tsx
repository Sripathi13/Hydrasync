import React, { useState } from 'react';
import { useHydrasync } from '../context/HydrasyncContext.tsx';
import { MetricCard } from '../components/MetricCard.tsx';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import {
  DollarSign,
  TrendingDown,
  TrendingUp,
  Percent,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  FileSpreadsheet,
} from 'lucide-react';

export const Financials: React.FC = () => {
  const { financials, sections, updateSettings, settings } = useHydrasync();
  const [unitCostInput, setUnitCostInput] = useState<number>(
    financials?.waterCostPerUnit || 3.85
  );
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  // Derived calculations using local input for instantaneous responsiveness
  const totalLeakRate = sections.reduce((sum, s) => sum + s.leakRate, 0);
  const hourlyCost = Number((totalLeakRate * unitCostInput).toFixed(2));
  const dailyCost = Number((hourlyCost * 24).toFixed(0));
  const monthlyCost = Number((dailyCost * 30).toFixed(0));
  const annualizedCost = Number((dailyCost * 365).toFixed(0));
  const potentialAvoidableLoss = Number((annualizedCost * 0.88).toFixed(0));

  // Section cost breakdown
  const sectionCosts = sections.map((s) => {
    const secHourly = Number((s.leakRate * unitCostInput).toFixed(2));
    const secDaily = Number((secHourly * 24).toFixed(0));
    const secAnnual = Number((secDaily * 365).toFixed(0));
    return {
      id: s.id,
      code: s.code,
      name: s.name,
      leakRate: s.leakRate,
      hourlyCost: secHourly,
      dailyCost: secDaily,
      annualCost: secAnnual,
      pctOfTotal: totalLeakRate > 0 ? ((s.leakRate / totalLeakRate) * 100).toFixed(1) : '0',
    };
  });

  // Cumulative Loss Over 30-Day Inaction
  const cumulativeLossCurve = Array.from({ length: 30 }, (_, i) => {
    const day = i + 1;
    return {
      day: `Day ${day}`,
      unmitigatedLoss: Math.round(dailyCost * day),
      withHydrasync: Math.round(dailyCost * Math.min(day, 2) + dailyCost * 0.1 * Math.max(0, day - 2)),
    };
  });

  const handleApplyTariff = async (tariff: number) => {
    setUnitCostInput(tariff);
    setIsUpdating(true);
    await updateSettings({ waterCostPerUnit: tariff });
    setIsUpdating(false);
  };

  return (
    <div id="financials-page" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
                Financial Loss Modeling & Fiscal ROI Analysis
              </h1>
              <p className="text-xs text-slate-500 font-mono">
                Real-Time Volumetric Loss Monetization & Avoidable Cost Accounting
              </p>
            </div>
          </div>
        </div>

        {/* Current Tariff Badge */}
        <div className="flex items-center gap-2 font-mono text-xs bg-slate-50 border border-slate-200 px-3.5 py-1.5 rounded-xl">
          <span className="text-slate-500">Active Base Tariff:</span>
          <span className="font-bold text-slate-900">${unitCostInput.toFixed(2)} / m³</span>
        </div>
      </div>

      {/* 4 TOP FINANCIAL KPI CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <MetricCard
          id="fin-kpi-hourly"
          label="Hourly Bleed Rate"
          value={`$${hourlyCost}`}
          unit="/ hr"
          icon={DollarSign}
          variant="warning"
          description={`Volume: ${totalLeakRate.toFixed(1)} m³/hr lost`}
        />
        <MetricCard
          id="fin-kpi-daily"
          label="Daily Financial Burden"
          value={`$${dailyCost.toLocaleString()}`}
          unit="/ day"
          icon={TrendingDown}
          variant="critical"
          description="24-hour unmitigated liability"
        />
        <MetricCard
          id="fin-kpi-monthly"
          label="Monthly Inaction Cost"
          value={`$${monthlyCost.toLocaleString()}`}
          unit="/ mo"
          icon={AlertTriangle}
          variant="critical"
          description="Projected 30-day utility bill drift"
        />
        <MetricCard
          id="fin-kpi-annualized"
          label="Annualized Exposure"
          value={`$${annualizedCost.toLocaleString()}`}
          unit="/ yr"
          icon={TrendingDown}
          variant="critical"
          description="Cumulative fiscal burden"
        />
      </div>

      {/* Interactive Tariff Tuning Sandbox */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-tight flex items-center gap-2">
              <Sliders className="w-4 h-4 text-sky-600" />
              <span>Interactive Utility Tariff Sandbox</span>
            </h2>
            <p className="text-xs text-slate-500 font-mono">
              Adjust your facility's contracted water & wastewater unit tariff to immediately recalibrate all financial calculations
            </p>
          </div>

          {/* Quick Tariff Presets */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400">Presets:</span>
            {[2.5, 3.85, 5.2, 7.0].map((rate) => (
              <button
                key={rate}
                id={`preset-tariff-${rate}`}
                onClick={() => handleApplyTariff(rate)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold border transition-all ${
                  unitCostInput === rate
                    ? 'bg-sky-600 text-white border-sky-600 shadow-2xs'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                ${rate.toFixed(2)}
              </button>
            ))}
          </div>
        </div>

        {/* Range Slider & Manual Input */}
        <div className="mt-5 grid sm:grid-cols-3 gap-6 items-center">
          <div className="sm:col-span-2 space-y-2">
            <div className="flex justify-between text-xs font-mono text-slate-600">
              <span>$1.00 / m³ (Low Municipal)</span>
              <span className="font-bold text-sky-700">Contracted Rate: ${unitCostInput.toFixed(2)} / m³</span>
              <span>$10.00 / m³ (High Industrial)</span>
            </div>
            <input
              id="tariff-range-slider"
              type="range"
              min="1.0"
              max="10.0"
              step="0.05"
              value={unitCostInput}
              onChange={(e) => setUnitCostInput(parseFloat(e.target.value))}
              onMouseUp={() => handleApplyTariff(unitCostInput)}
              className="w-full accent-sky-600 h-2 bg-slate-100 rounded-lg cursor-pointer"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <span className="absolute left-3 top-2 text-xs font-mono text-slate-400">$</span>
              <input
                id="tariff-direct-input"
                type="number"
                step="0.05"
                value={unitCostInput}
                onChange={(e) => setUnitCostInput(parseFloat(e.target.value) || 0)}
                className="w-full pl-6 pr-3 py-1.5 text-xs font-mono rounded-lg border border-slate-200 focus:border-sky-500 outline-hidden font-bold"
              />
            </div>
            <button
              id="save-tariff-btn"
              onClick={() => handleApplyTariff(unitCostInput)}
              className="px-4 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition-all shadow-2xs shrink-0"
            >
              {isUpdating ? 'Saving...' : 'Apply Tariff'}
            </button>
          </div>
        </div>
      </div>

      {/* Cumulative Financial Inaction Projection Curve */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-tight">
              30-Day Cumulative Cost of Inaction Projection
            </h2>
            <p className="text-xs text-slate-500 font-mono">
              Unmitigated Bleed vs Rapid HydraSync Automated Valve Isolation
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="flex items-center gap-1 text-rose-600 font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              Unmitigated Inaction
            </span>
            <span className="flex items-center gap-1 text-emerald-600 font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              With HydraSync
            </span>
          </div>
        </div>

        <div className="w-full h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={cumulativeLossCurve} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="unmitigatedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="hydrasyncGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="day" stroke="#94a3b8" tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis
                stroke="#94a3b8"
                tick={{ fontSize: 11, fill: '#64748b' }}
                unit=" $"
                tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
              />
              <Tooltip
                formatter={(val: any) => [`$${Number(val).toLocaleString()}`, 'Cumulative Cost']}
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderColor: '#cbd5e1',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontFamily: 'monospace',
                }}
              />
              <Area
                type="monotone"
                dataKey="unmitigatedLoss"
                name="Unmitigated Inaction"
                stroke="#f43f5e"
                strokeWidth={2.5}
                fill="url(#unmitigatedGrad)"
              />
              <Area
                type="monotone"
                dataKey="withHydrasync"
                name="With HydraSync Platform"
                stroke="#10b981"
                strokeWidth={2.5}
                fill="url(#hydrasyncGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Breakdown by Section Table & ROI Value Proposition Card */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Breakdown by Section Table (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-tight mb-4">
            Volumetric Financial Loss by Distribution Section
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-50 text-[10px] text-slate-500 uppercase border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Section</th>
                  <th className="py-2.5 px-3">Leak Discharge</th>
                  <th className="py-2.5 px-3">Hourly Cost</th>
                  <th className="py-2.5 px-3">Daily Burden</th>
                  <th className="py-2.5 px-3">Annualized</th>
                  <th className="py-2.5 px-3 text-right">% of Exposure</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sectionCosts.map((sec) => (
                  <tr key={sec.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3 font-bold font-sans text-slate-900">
                      Section {sec.code} - {sec.name}
                    </td>
                    <td className="py-3 px-3">{sec.leakRate} m³/h</td>
                    <td className="py-3 px-3 font-bold text-slate-900">${sec.hourlyCost}</td>
                    <td className="py-3 px-3">${sec.dailyCost.toLocaleString()}</td>
                    <td className="py-3 px-3 font-bold text-rose-600">
                      ${sec.annualCost.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-slate-700">
                      {sec.pctOfTotal}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ROI Business Case Box (1 col) */}
        <div className="bg-linear-to-br from-emerald-50 to-teal-50/50 rounded-2xl border border-emerald-200 p-6 flex flex-col justify-between shadow-xs">
          <div>
            <div className="inline-flex p-2 rounded-xl bg-emerald-100 text-emerald-800 mb-3">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-emerald-950">
              Recoverable Savings Opportunity
            </h3>
            <p className="text-xs text-emerald-800/80 mt-1 leading-relaxed">
              By detecting underground pipeline ruptures in under 15 minutes instead of weeks, HydraSync delivers direct utility bill savings.
            </p>

            <div className="my-6 p-4 rounded-xl bg-white/90 border border-emerald-200 text-center font-mono">
              <span className="text-[10px] text-emerald-700 uppercase tracking-wider block">
                Net Annual Avoidable Loss
              </span>
              <span className="text-3xl font-bold text-emerald-700 block mt-1">
                ${potentialAvoidableLoss.toLocaleString()}
              </span>
              <span className="text-[11px] text-slate-500 block mt-0.5">
                88% reduction in non-revenue water
              </span>
            </div>

            <ul className="space-y-2 text-xs text-emerald-900 font-medium">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                Payback period: <strong>1.8 months</strong>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                Water saved: <strong>~33,200 m³/year</strong>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                Carbon offset: <strong>14.2 tons CO2e</strong>
              </li>
            </ul>
          </div>

          <div className="mt-6 pt-4 border-t border-emerald-200/60 text-xs font-mono text-emerald-700">
            Certified ISO 50001 Water Efficiency
          </div>
        </div>
      </div>
    </div>
  );
};
