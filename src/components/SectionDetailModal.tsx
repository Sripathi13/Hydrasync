import React from 'react';
import { NetworkSection } from '../types/hydrasync.ts';
import { StatusBadge } from './StatusBadge.tsx';
import { X, Activity, Gauge, Droplets, Thermometer, ShieldAlert, Cpu, CheckCircle2 } from 'lucide-react';

interface SectionDetailModalProps {
  section: NetworkSection | null;
  onClose: () => void;
}

export const SectionDetailModal: React.FC<SectionDetailModalProps> = ({ section, onClose }) => {
  if (!section) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div
        id="section-detail-modal"
        className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-md bg-sky-100 text-sky-800 text-xs font-bold font-mono">
              SECTION {section.code}
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-900">{section.name}</h2>
              <p className="text-xs text-slate-500 font-mono">Zone: {section.productionZone}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={section.status} size="md" showPulse />
            <button
              id="close-section-modal-btn"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Key Readings Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                <Gauge className="w-3.5 h-3.5 text-sky-600" />
                <span>Pressure</span>
              </div>
              <div className="text-xl font-bold font-mono text-slate-900">
                {section.pressure.toFixed(2)}{' '}
                <span className="text-xs font-normal text-slate-400">bar</span>
              </div>
              <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                Target: {section.expectedPressure.toFixed(1)} bar
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                <Droplets className="w-3.5 h-3.5 text-sky-600" />
                <span>Active Flow</span>
              </div>
              <div className="text-xl font-bold font-mono text-slate-900">
                {section.flow.toFixed(1)}{' '}
                <span className="text-xs font-normal text-slate-400">m³/h</span>
              </div>
              <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                Expected: {section.expectedFlow.toFixed(1)} m³/h
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                <Thermometer className="w-3.5 h-3.5 text-amber-600" />
                <span>Temperature</span>
              </div>
              <div className="text-xl font-bold font-mono text-slate-900">
                {section.temperature.toFixed(1)}{' '}
                <span className="text-xs font-normal text-slate-400">°C</span>
              </div>
              <div className="text-[11px] font-mono text-emerald-600 mt-0.5">Thermal Nominal</div>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                <ShieldAlert
                  className={`w-3.5 h-3.5 ${
                    section.leakProbability > 30 ? 'text-rose-600' : 'text-emerald-600'
                  }`}
                />
                <span>Leak Prob.</span>
              </div>
              <div
                className={`text-xl font-bold font-mono ${
                  section.leakProbability > 40
                    ? 'text-rose-600'
                    : section.leakProbability > 15
                    ? 'text-amber-600'
                    : 'text-emerald-700'
                }`}
              >
                {section.leakProbability}%
              </div>
              <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                Discharge: {section.leakRate} m³/h
              </div>
            </div>
          </div>

          {/* Anomaly & AI/ML Diagnosis */}
          <div className="p-4 rounded-xl border border-sky-100 bg-sky-50/40">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-sky-700" />
                <span className="text-xs font-bold uppercase tracking-wider text-sky-900">
                  AI/ML Simulation & Anomaly Score
                </span>
              </div>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-sky-100 text-sky-800">
                Score: {section.anomalyScore}/100
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 mb-3">
              <div
                className={`h-2 rounded-full transition-all ${
                  section.anomalyScore > 65
                    ? 'bg-rose-500'
                    : section.anomalyScore > 35
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(100, Math.max(5, section.anomalyScore))}%` }}
              />
            </div>
            <div className="text-xs text-slate-700 font-medium leading-relaxed">
              <span className="font-semibold text-slate-900">Recommended Operational Action:</span>{' '}
              {section.recommendedAction}
            </div>
          </div>

          {/* Instrumentation Status */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Hardware Transducers & Valve Topology
            </h4>
            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 rounded-lg border border-slate-200 bg-white flex justify-between items-center">
                <span className="text-slate-600">Active Sensors Online</span>
                <span className="font-bold text-slate-900">
                  {section.activeSensors} / {section.sensorsCount}
                </span>
              </div>
              <div className="p-3 rounded-lg border border-slate-200 bg-white flex justify-between items-center">
                <span className="text-slate-600">Isolation Valves Position</span>
                <span className="font-bold text-slate-900">
                  {section.valvesOpen} / {section.valvesTotal} Open
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-slate-500">
          <span>Last Telemetry Sync: {section.lastUpdated}</span>
          <button
            id="dismiss-section-detail-btn"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-900 text-white font-sans font-medium transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
