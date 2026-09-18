import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useHydrasync } from '../context/HydrasyncContext.tsx';
import { MetricCard } from '../components/MetricCard.tsx';
import { StatusBadge } from '../components/StatusBadge.tsx';
import { FlowChart } from '../components/charts/FlowChart.tsx';
import { PressureGauge } from '../components/PressureGauge.tsx';
import { NetworkMap } from '../components/NetworkMap.tsx';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  DollarSign,
  Droplets,
  Gauge,
  Layers,
  RefreshCw,
  ShieldAlert,
  Sliders,
  TrendingDown,
  TrendingUp,
  Zap,
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const {
    currentReading,
    anomaly,
    sections,
    financials,
    systemHealth,
    lastUpdated,
    history,
    alerts,
    setSelectedSection,
    setSelectedAlert,
    applyScenario,
    resetScenario,
  } = useHydrasync();

  const navigate = useNavigate();

  const activeAlerts = alerts.filter((a) => a.status === 'active');
  const activeLeakRate = sections.reduce(
    (sum, s) => sum + (s.status === 'critical' || s.status === 'warning' ? s.leakRate : 0),
    0
  );

  const flowDeviation = currentReading?.flowDeviation || 0;
  const flowDeviationPct = currentReading
    ? ((flowDeviation / Math.max(currentReading.expectedFlow, 1)) * 100).toFixed(1)
    : '0';

  // Section references
  const secA = sections.find((s) => s.code === 'A');
  const secB = sections.find((s) => s.code === 'B');
  const secC = sections.find((s) => s.code === 'C');
  const secD = sections.find((s) => s.code === 'D');

  return (
    <div id="dashboard-page" className="space-y-6">
      {/* Top Header & Operational Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
              Operational Command Center
            </h1>
            <StatusBadge status={systemHealth} size="md" showPulse />
          </div>
          <p className="text-xs text-slate-500 font-mono mt-1">
            Real-Time SCADA Telemetry Stream • Last updated: <span className="font-bold text-slate-800">{lastUpdated}</span>
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <NavLink
            to="/scenarios"
            id="dash-run-sim-btn"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-sky-200 bg-sky-50 text-sky-800 hover:bg-sky-100 text-xs font-bold transition-all shadow-2xs"
          >
            <Sliders className="w-3.5 h-3.5 text-sky-600" />
            <span>Scenario Simulator</span>
          </NavLink>
          <NavLink
            to="/network"
            id="dash-network-view-btn"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition-all shadow-xs"
          >
            <span>Network Map</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </NavLink>
        </div>
      </div>

      {/* Critical Alert Warning Bar if critical alert exists */}
      {systemHealth === 'CRITICAL' && (
        <div className="p-4 rounded-xl bg-rose-50 border-2 border-rose-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-rose-600 text-white">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-mono font-bold text-rose-800 uppercase">
                EMERGENCY HYDRAULIC ANOMALY DETECTED
              </div>
              <div className="text-xs text-rose-700 font-medium mt-0.5">
                {anomaly?.explanation || 'Severe pipe rupture in Section B. Flow surging +35%.'}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const crit = activeAlerts.find((a) => a.severity === 'critical');
                if (crit) setSelectedAlert(crit);
                else navigate('/alerts');
              }}
              className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors"
            >
              Inspect Incident
            </button>
            <button
              onClick={() => resetScenario()}
              className="px-3 py-1.5 rounded-lg bg-white border border-rose-300 hover:bg-rose-50 text-rose-800 text-xs font-bold transition-colors"
            >
              Reset Scenario
            </button>
          </div>
        </div>
      )}

      {/* 6 TOP KPI CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* 1. Current Flow */}
        <MetricCard
          id="kpi-current-flow"
          label="Current Flow"
          value={currentReading ? currentReading.flow.toFixed(1) : '530.0'}
          unit="m³/h"
          icon={Droplets}
          variant={currentReading && currentReading.flow > 600 ? 'critical' : 'default'}
          delta={{
            value: `${flowDeviationPct}%`,
            isPositive: Number(flowDeviationPct) > 0,
            isPositiveGood: false,
          }}
          description="Total intake delivery"
        />

        {/* 2. Expected Flow */}
        <MetricCard
          id="kpi-expected-flow"
          label="Expected Flow"
          value={currentReading ? currentReading.expectedFlow.toFixed(1) : '530.0'}
          unit="m³/h"
          icon={Gauge}
          description="Calibrated baseline"
        />

        {/* 3. Flow Variance */}
        <MetricCard
          id="kpi-flow-variance"
          label="Flow Variance"
          value={`${flowDeviation > 0 ? '+' : ''}${flowDeviation.toFixed(1)}`}
          unit="m³/h"
          icon={Activity}
          variant={Math.abs(flowDeviation) > 25 ? 'warning' : 'default'}
          description={`${Math.abs(Number(flowDeviationPct))}% vs target`}
        />

        {/* 4. Water Consumption */}
        <MetricCard
          id="kpi-consumption"
          label="24h Consumption"
          value={currentReading ? (currentReading.flow * 24).toFixed(0) : '12,720'}
          unit="m³"
          icon={BarChart3}
          description="Est. diurnal volume"
        />

        {/* 5. Active Leaks */}
        <MetricCard
          id="kpi-active-leaks"
          label="Active Leaks"
          value={activeAlerts.length}
          unit="events"
          icon={ShieldAlert}
          variant={activeAlerts.some((a) => a.severity === 'critical') ? 'critical' : activeAlerts.length > 0 ? 'warning' : 'default'}
          description={`Rate: ${activeLeakRate.toFixed(1)} m³/h`}
        />

        {/* 6. Daily Financial Loss */}
        <MetricCard
          id="kpi-daily-loss"
          label="Daily Loss"
          value={`$${financials ? financials.dailyCost : '351'}`}
          unit="/ day"
          icon={DollarSign}
          variant={financials && financials.dailyCost > 500 ? 'critical' : 'warning'}
          description={`$${financials ? financials.hourlyCost : '14.6'}/hr exposure`}
        />
      </div>

      {/* Main Visualizations 1 & 2: Live Flow Chart & Pressure Overview */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Live Flow Chart (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-tight">
                Live Volumetric Flow Telemetry
              </h2>
              <p className="text-xs text-slate-500 font-mono">
                Continuous Comparison: Measured Delivery vs. Calibrated Expected Baseline
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />
                Live 5s Telemetry
              </span>
            </div>
          </div>

          <div className="flex-1 w-full min-h-[280px]">
            <FlowChart data={history} height={280} />
          </div>
        </div>

        {/* Pressure Overview (Section A-D Gauges) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-tight">
                Pressure Overview
              </h2>
              <p className="text-xs text-slate-500 font-mono">Multi-Point Zone Gauges</p>
            </div>
            <NavLink to="/monitoring" className="text-xs text-sky-600 hover:underline font-medium">
              View All →
            </NavLink>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <PressureGauge
              id="gauge-sec-a"
              label="Intake Zone A"
              sectionCode="A"
              value={secA?.pressure || 5.2}
              expected={secA?.expectedPressure || 5.3}
              onClick={() => secA && setSelectedSection(secA)}
            />
            <PressureGauge
              id="gauge-sec-b"
              label="Header Zone B"
              sectionCode="B"
              value={secB?.pressure || 3.9}
              expected={secB?.expectedPressure || 4.8}
              onClick={() => secB && setSelectedSection(secB)}
            />
            <PressureGauge
              id="gauge-sec-c"
              label="Cooling Zone C"
              sectionCode="C"
              value={secC?.pressure || 4.6}
              expected={secC?.expectedPressure || 4.7}
              onClick={() => secC && setSelectedSection(secC)}
            />
            <PressureGauge
              id="gauge-sec-d"
              label="Discharge Zone D"
              sectionCode="D"
              value={secD?.pressure || 4.1}
              expected={secD?.expectedPressure || 4.2}
              onClick={() => secD && setSelectedSection(secD)}
            />
          </div>
        </div>
      </div>

      {/* Main Visualizations 3 & 4: Network Map & Active Alerts */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Industrial Network Status (2 cols) */}
        <div className="lg:col-span-2">
          <NetworkMap
            sections={sections}
            onSelectSection={(s) => setSelectedSection(s)}
          />
        </div>

        {/* Active Alerts & Recent Incidents (1 col) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-tight flex items-center gap-2">
                <span>Active Incidents</span>
                <span className="px-2 py-0.2 rounded-full bg-rose-100 text-rose-700 text-xs font-mono">
                  {activeAlerts.length}
                </span>
              </h2>
              <p className="text-xs text-slate-500 font-mono">Real-time alert triage queue</p>
            </div>
            <NavLink to="/alerts" className="text-xs text-sky-600 hover:underline font-medium">
              Manage →
            </NavLink>
          </div>

          <div className="space-y-3 overflow-y-auto max-h-[380px] pr-1">
            {activeAlerts.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <div className="text-xs font-bold text-slate-700">Zero Active Anomalies</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  All distribution sections operating within baseline setpoints.
                </div>
              </div>
            ) : (
              activeAlerts.map((alert) => (
                <div
                  key={alert.id}
                  id={`alert-card-${alert.id}`}
                  onClick={() => setSelectedAlert(alert)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all hover:scale-[1.01] shadow-2xs ${
                    alert.severity === 'critical'
                      ? 'bg-rose-50/70 border-rose-200 hover:border-rose-400'
                      : 'bg-amber-50/50 border-amber-200 hover:border-amber-400'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-mono font-bold text-slate-600">{alert.id}</span>
                    <StatusBadge status={alert.severity} size="sm" showPulse />
                  </div>
                  <div className="text-xs font-bold text-slate-900 line-clamp-1">{alert.title}</div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 mt-2 pt-2 border-t border-slate-200/60">
                    <span>
                      Section <strong>{alert.section}</strong>
                    </span>
                    <span className="text-rose-600 font-bold">${alert.estimatedLoss}/hr</span>
                    <span>{alert.timestamp}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-slate-500">
            <span>AI/ML Simulation Active</span>
            <NavLink to="/alerts" className="text-sky-600 font-semibold hover:underline">
              Triage All Incidents →
            </NavLink>
          </div>
        </div>
      </div>

      {/* Section Health & Financial Impact Strip */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Section Health Table */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-tight">
              Section Operational Integrity
            </h2>
            <NavLink to="/network" className="text-xs text-sky-600 hover:underline font-medium">
              Topological Map →
            </NavLink>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="text-[10px] text-slate-400 uppercase border-b border-slate-100">
                <tr>
                  <th className="pb-2">Section</th>
                  <th className="pb-2">Pressure</th>
                  <th className="pb-2">Flow</th>
                  <th className="pb-2">Leak Prob</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sections.map((sec) => (
                  <tr
                    key={sec.id}
                    onClick={() => setSelectedSection(sec)}
                    className="hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <td className="py-2.5 font-bold text-slate-900 font-sans">{sec.name}</td>
                    <td className="py-2.5 text-slate-700">{sec.pressure.toFixed(2)} bar</td>
                    <td className="py-2.5 text-slate-700">{sec.flow.toFixed(1)} m³/h</td>
                    <td className="py-2.5">
                      <span
                        className={`font-bold ${
                          sec.leakProbability > 30 ? 'text-rose-600' : 'text-emerald-600'
                        }`}
                      >
                        {sec.leakProbability}%
                      </span>
                    </td>
                    <td className="py-2.5">
                      <StatusBadge status={sec.status} size="sm" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Financial Exposure Quick Summary */}
        <div className="bg-linear-to-br from-white to-sky-50/40 rounded-2xl border border-sky-200 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-tight">
                Fiscal Loss & ROI Modeling
              </h2>
              <p className="text-xs text-slate-500 font-mono">
                Tariff: ${financials ? financials.waterCostPerUnit : '3.85'} / m³
              </p>
            </div>
            <NavLink to="/financials" className="text-xs text-sky-600 hover:underline font-medium">
              Detailed Ledger →
            </NavLink>
          </div>

          <div className="grid grid-cols-2 gap-3 my-2 font-mono text-xs">
            <div className="p-3 bg-white rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 uppercase block">Hourly Burden</span>
              <span className="text-xl font-bold text-slate-900">
                ${financials ? financials.hourlyCost : '14.63'}
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">
                {financials ? financials.waterLostPerHour : '3.8'} m³/hr loss
              </span>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 uppercase block">Annual Exposure</span>
              <span className="text-xl font-bold text-rose-600">
                ${financials ? financials.annualizedCost.toLocaleString() : '128,158'}
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Unmitigated baseline</span>
            </div>
          </div>

          <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-200 text-xs flex items-center justify-between">
            <div>
              <div className="font-bold text-emerald-900 font-sans">
                Potential Recoverable Savings
              </div>
              <div className="text-[11px] text-emerald-700 font-mono">
                ${financials ? financials.potentialAvoidableLoss.toLocaleString() : '112,779'}/year
                with rapid intervention
              </div>
            </div>
            <NavLink
              to="/financials"
              className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors shrink-0"
            >
              Analyze ROI
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};
