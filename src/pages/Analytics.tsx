import React, { useState } from 'react';
import { useHydrasync } from '../context/HydrasyncContext.tsx';
import { FlowChart } from '../components/charts/FlowChart.tsx';
import { PressureChart } from '../components/charts/PressureChart.tsx';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import {
  Activity,
  BarChart3,
  Calendar,
  CheckCircle2,
  Cpu,
  Download,
  Droplets,
  Gauge,
  TrendingDown,
  TrendingUp,
  Zap,
} from 'lucide-react';

export const Analytics: React.FC = () => {
  const { history, currentReading } = useHydrasync();
  const [timeRange, setTimeRange] = useState<'hourly' | 'daily' | 'weekly' | 'monthly'>('daily');

  // Synthetic diurnal consumption bars
  const consumptionDays = [
    { day: 'Mon', volume: 12450, baseline: 12100, variance: 350 },
    { day: 'Tue', volume: 12890, baseline: 12100, variance: 790 },
    { day: 'Wed', volume: 13950, baseline: 12200, variance: 1750 },
    { day: 'Thu', volume: 14600, baseline: 12200, variance: 2400 },
    { day: 'Fri', volume: 13800, baseline: 12300, variance: 1500 },
    { day: 'Sat', volume: 9800, baseline: 9500, variance: 300 },
    { day: 'Sun', volume: 9200, baseline: 9100, variance: 100 },
  ];

  // Correlation scatter / area: Anomaly Probability vs Flow Deviation
  const correlationData = history.map((item, idx) => ({
    time: item.timestamp,
    deviation: Math.round(item.flowDeviation),
    anomalyScore: Math.min(100, Math.round(Math.abs(item.flowDeviation) * 1.6 + 12)),
    pressureDrop: Number((5.2 - item.pressureB).toFixed(2)),
  }));

  // Calculations
  const meanFlow = (
    history.reduce((sum, h) => sum + h.flow, 0) / Math.max(history.length, 1)
  ).toFixed(1);
  const peakPressure = Math.max(...history.map((h) => h.pressureA), 6.2).toFixed(2);
  const totalLeakVolume = history
    .reduce((sum, h) => sum + Math.max(0, h.flowDeviation) * 0.1, 0)
    .toFixed(0);

  return (
    <div id="analytics-page" className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-100 text-sky-700">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
                Hydraulic Analytics & Anomaly Correlation
              </h1>
              <p className="text-xs text-slate-500 font-mono">
                Long-Term Diurnal Variance, Statistical Baselines & Predictive Machine Learning
              </p>
            </div>
          </div>
        </div>

        {/* Time range selector */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          {(['hourly', 'daily', 'weekly', 'monthly'] as const).map((range) => (
            <button
              key={range}
              id={`analytics-range-${range}`}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize font-mono transition-all ${
                timeRange === range
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* 4 Statistical Metric KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-mono mb-2">
            <span className="uppercase font-bold">Mean Flow Rate</span>
            <Droplets className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900">
            {meanFlow} <span className="text-xs font-normal text-slate-500">m³/h</span>
          </div>
          <div className="text-[11px] text-slate-500 font-mono mt-1">
            Nominal standard delivery: 530 m³/h
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-mono mb-2">
            <span className="uppercase font-bold">Peak Header Pressure</span>
            <Gauge className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900">
            {peakPressure} <span className="text-xs font-normal text-slate-500">bar</span>
          </div>
          <div className="text-[11px] text-slate-500 font-mono mt-1">Safety max rating: 8.0 bar</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-mono mb-2">
            <span className="uppercase font-bold">Total Unaccounted Loss</span>
            <TrendingDown className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-rose-600">
            {totalLeakVolume} <span className="text-xs font-normal text-slate-500">m³</span>
          </div>
          <div className="text-[11px] text-slate-500 font-mono mt-1">7-day cumulative non-revenue</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-mono mb-2">
            <span className="uppercase font-bold">Efficiency Index</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-700">91.4%</div>
          <div className="text-[11px] text-slate-500 font-mono mt-1">
            Target benchmark: &gt; 95.0%
          </div>
        </div>
      </div>

      {/* Visualizations 1 & 2: Diurnal Bar Chart + Multi-Trace Pressure */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Weekly Diurnal Consumption Comparison */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-tight">
                7-Day Diurnal Consumption vs Baseline
              </h2>
              <p className="text-xs text-slate-500 font-mono">
                Total daily throughput compared to seasonal setpoint (m³)
              </p>
            </div>
          </div>

          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={consumptionDays} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="day" stroke="#94a3b8" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis stroke="#94a3b8" tick={{ fontSize: 11, fill: '#64748b' }} unit=" m³" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#cbd5e1',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontFamily: 'monospace',
                  }}
                />
                <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="baseline" name="Expected Baseline" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="volume" name="Actual Billed Intake" fill="#0284c7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Anomaly Score vs Volumetric Deviation */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-tight">
                AI Anomaly Confidence Correlation
              </h2>
              <p className="text-xs text-slate-500 font-mono">
                Mathematical correlation between pipe flow deviation & AI leak score
              </p>
            </div>
          </div>

          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={correlationData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="anomalyGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="time" stroke="#94a3b8" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis stroke="#94a3b8" tick={{ fontSize: 11, fill: '#64748b' }} unit=" %" domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#cbd5e1',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontFamily: 'monospace',
                  }}
                />
                <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: '12px' }} />
                <Area
                  type="monotone"
                  dataKey="anomalyScore"
                  name="AI Anomaly Score (%)"
                  stroke="#f43f5e"
                  strokeWidth={2}
                  fill="url(#anomalyGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Multi-Parameter Live Trace */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-tight">
              Synchronized Hydraulic Waveform
            </h2>
            <p className="text-xs text-slate-500 font-mono">
              Temporal correlation: Intake volume vs multi-point distribution pressure
            </p>
          </div>
        </div>
        <FlowChart data={history} height={260} />
      </div>
    </div>
  );
};
