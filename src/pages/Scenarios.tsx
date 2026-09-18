import React, { useState } from 'react';
import { useHydrasync } from '../context/HydrasyncContext.tsx';
import { StatusBadge } from '../components/StatusBadge.tsx';
import { SimulationScenario } from '../types/hydrasync.ts';
import {
  Activity,
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  Droplets,
  Flame,
  Gauge,
  Play,
  Radio,
  RefreshCw,
  RotateCcw,
  Sliders,
  TrendingDown,
  TrendingUp,
  Zap,
} from 'lucide-react';

export const Scenarios: React.FC = () => {
  const {
    scenarios,
    activeScenarioId,
    applyScenario,
    resetScenario,
    anomaly,
    systemHealth,
  } = useHydrasync();

  const [loadingScenarioId, setLoadingScenarioId] = useState<string | null>(null);

  const handleApply = async (id: string) => {
    setLoadingScenarioId(id);
    await applyScenario(id);
    setTimeout(() => setLoadingScenarioId(null), 300);
  };

  const handleReset = async () => {
    setLoadingScenarioId('reset');
    await resetScenario();
    setTimeout(() => setLoadingScenarioId(null), 300);
  };

  const activeScenario = scenarios.find((s) => s.id === activeScenarioId);

  return (
    <div id="scenarios-page" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-100 text-sky-700">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
                Digital Twin Operational Scenario Simulator
              </h1>
              <p className="text-xs text-slate-500 font-mono">
                Real-Time Synthetic Fault Injection & Multi-Section Stress Testing
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="reset-scenario-master-btn"
            onClick={handleReset}
            disabled={loadingScenarioId === 'reset'}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs active:scale-98"
          >
            <RotateCcw
              className={`w-3.5 h-3.5 ${loadingScenarioId === 'reset' ? 'animate-spin' : ''}`}
            />
            <span>Reset to Normal Baseline</span>
          </button>
        </div>
      </div>

      {/* Active Incident Simulator Status Banner */}
      <div
        className={`p-5 rounded-2xl border transition-all ${
          activeScenarioId
            ? 'bg-amber-50/70 border-amber-300 shadow-xs'
            : 'bg-white border-slate-200 shadow-2xs'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`p-2.5 rounded-xl ${
                activeScenarioId ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              {activeScenarioId ? (
                <AlertTriangle className="w-6 h-6 animate-bounce" />
              ) : (
                <CheckCircle2 className="w-6 h-6" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase text-slate-500">
                  Simulation Status:
                </span>
                <StatusBadge
                  status={activeScenarioId ? 'SIMULATION ACTIVE' : 'NORMAL CALIBRATION'}
                  size="sm"
                  showPulse={!!activeScenarioId}
                />
              </div>
              <h2 className="text-base font-bold text-slate-900 mt-1">
                {activeScenario ? activeScenario.name : 'Nominal Operational State (Calibrated)'}
              </h2>
              <p className="text-xs text-slate-600 font-mono mt-0.5">
                {activeScenario
                  ? activeScenario.description
                  : 'Telemetry is streaming at baseline parameters (530 m³/h, nominal pressures).'}
              </p>
            </div>
          </div>

          {activeScenarioId && (
            <button
              id="clear-active-sim-btn"
              onClick={handleReset}
              className="px-4 py-2 rounded-xl bg-white border border-amber-300 hover:bg-amber-100/50 text-amber-900 text-xs font-bold transition-all shadow-2xs shrink-0 flex items-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Terminate Active Injection</span>
            </button>
          )}
        </div>
      </div>

      {/* Scenarios Grid */}
      <div className="space-y-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Available Fault Injection Scenarios
          </h2>
          <p className="text-xs text-slate-500 font-mono">
            Select an operational scenario to test the real-time anomaly engine, SCADA gauges, and financial calculations
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {scenarios.map((scen) => {
            const isActive = scen.id === activeScenarioId;
            const isLoading = loadingScenarioId === scen.id;
            const flowDelta = scen.flowDelta ?? 0;
            const pressureDelta = scen.pressureDelta ?? 0;
            const anomalyPattern = scen.anomalyPattern || scen.expectedEffect || 'Hydraulic transient';
            const severity = scen.severity || 'warning';

            return (
              <div
                key={scen.id}
                id={`scenario-card-${scen.id}`}
                className={`bg-white rounded-2xl border p-5 flex flex-col justify-between transition-all shadow-xs ${
                  isActive
                    ? 'ring-2 ring-sky-500 border-sky-400 bg-sky-50/20'
                    : 'border-slate-200 hover:border-sky-300 hover:shadow-md'
                }`}
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {scen.targetSection ? `Section ${scen.targetSection}` : 'System Wide'}
                    </span>
                    <StatusBadge status={severity} size="sm" showPulse={isActive} />
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 mb-2">{scen.name}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">{scen.description}</p>

                  {/* Impact Matrix */}
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 font-mono text-xs space-y-1.5 mb-4">
                    <div className="flex justify-between items-center text-slate-600">
                      <span>Flow Impact:</span>
                      <span
                        className={`font-bold ${
                          flowDelta > 0
                            ? 'text-rose-600'
                            : flowDelta < 0
                            ? 'text-blue-600'
                            : 'text-slate-800'
                        }`}
                      >
                        {flowDelta > 0 ? `+${flowDelta}` : flowDelta} m³/h
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-slate-600">
                      <span>Pressure Impact:</span>
                      <span
                        className={`font-bold ${
                          pressureDelta < 0 ? 'text-amber-700' : 'text-slate-800'
                        }`}
                      >
                        {pressureDelta} bar
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-slate-600">
                      <span>Telemetry Pattern:</span>
                      <span className="font-semibold text-slate-800 text-[11px] truncate max-w-[140px]">
                        {anomalyPattern}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Trigger Action */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-400">
                    {isActive ? '● Running live' : 'Ready to inject'}
                  </span>

                  <button
                    id={`apply-scenario-${scen.id}`}
                    onClick={() => handleApply(scen.id)}
                    disabled={isLoading || isActive}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-emerald-100 text-emerald-800 cursor-default'
                        : 'bg-sky-600 hover:bg-sky-700 text-white shadow-xs active:scale-98'
                    }`}
                  >
                    {isLoading ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : isActive ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : (
                      <Play className="w-3.5 h-3.5 fill-white" />
                    )}
                    <span>{isActive ? 'Active in Simulation' : 'Inject Scenario'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
