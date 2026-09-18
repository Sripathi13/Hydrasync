import React from 'react';
import { NetworkSection } from '../types/hydrasync.ts';
import { StatusBadge } from './StatusBadge.tsx';
import { Activity, AlertTriangle, Droplets, Gauge, ShieldAlert, Zap } from 'lucide-react';

interface NetworkMapProps {
  sections: NetworkSection[];
  onSelectSection: (section: NetworkSection) => void;
  selectedSectionId?: string;
  isCompact?: boolean;
}

export const NetworkMap: React.FC<NetworkMapProps> = ({
  sections,
  onSelectSection,
  selectedSectionId,
  isCompact = false,
}) => {
  const secA = sections.find((s) => s.code === 'A') || sections[0];
  const secB = sections.find((s) => s.code === 'B') || sections[1];
  const secC = sections.find((s) => s.code === 'C') || sections[2];
  const secD = sections.find((s) => s.code === 'D') || sections[3];

  const getSectionColor = (status: string) => {
    switch (status) {
      case 'critical':
        return {
          stroke: '#f43f5e',
          bg: 'bg-rose-50 border-rose-300 hover:border-rose-400',
          text: 'text-rose-700',
          glow: 'rgba(244, 63, 94, 0.25)',
        };
      case 'warning':
        return {
          stroke: '#f59e0b',
          bg: 'bg-amber-50 border-amber-300 hover:border-amber-400',
          text: 'text-amber-800',
          glow: 'rgba(245, 158, 11, 0.2)',
        };
      case 'offline':
        return {
          stroke: '#94a3b8',
          bg: 'bg-slate-50 border-slate-300',
          text: 'text-slate-600',
          glow: 'none',
        };
      default:
        return {
          stroke: '#10b981',
          bg: 'bg-emerald-50/70 border-emerald-300 hover:border-emerald-400',
          text: 'text-emerald-800',
          glow: 'rgba(16, 185, 129, 0.15)',
        };
    }
  };

  return (
    <div
      id="industrial-water-network-map"
      className="w-full bg-slate-900/5 rounded-2xl border border-slate-200 p-4 lg:p-6 relative overflow-hidden bg-white shadow-xs"
    >
      {/* Background blueprint grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(#0284c7 1.5px, transparent 1.5px), radial-gradient(#0284c7 1.5px, #ffffff 1.5px)',
          backgroundSize: '24px 24px',
          backgroundPosition: '0 0, 12px 12px',
        }}
      />

      {/* Header bar of network schematic */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-sky-100 text-sky-700">
            <Droplets className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-tight text-slate-900 uppercase">
              Topological Water Distribution Schematic
            </h3>
            <p className="text-xs text-slate-500 font-mono">
              Live Hydraulic Telemetry & Active Pipeline Grid
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            Normal
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            Warning
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-pulse" />
            Critical
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
            Offline
          </span>
        </div>
      </div>

      {/* SVG Hydraulic Circuit Canvas */}
      <div className="relative w-full overflow-x-auto min-h-[460px] pb-4">
        <div className="min-w-[780px] relative">
          {/* SVG Pipe Backbone */}
          <svg
            className="w-full h-[440px] absolute inset-0 pointer-events-none"
            viewBox="0 0 960 440"
            fill="none"
          >
            {/* Reservoir to Pump Pipe */}
            <path
              d="M 120 180 L 220 180"
              stroke="#0284c7"
              strokeWidth="10"
              strokeLinecap="round"
            />
            {/* Flow animation line */}
            <path
              d="M 120 180 L 220 180"
              stroke="#bae6fd"
              strokeWidth="4"
              strokeDasharray="8 6"
              className="animate-flow"
            />

            {/* Pump to Main Pipe Header */}
            <path
              d="M 280 180 L 400 180"
              stroke="#0284c7"
              strokeWidth="12"
              strokeLinecap="round"
            />
            <path
              d="M 280 180 L 400 180"
              stroke="#bae6fd"
              strokeWidth="4"
              strokeDasharray="8 6"
              className="animate-flow"
            />

            {/* Vertical Main Manifold Distribution Bus */}
            <path
              d="M 400 60 L 400 380"
              stroke="#0369a1"
              strokeWidth="12"
              strokeLinecap="round"
            />

            {/* Branch 1: Main Bus -> Section A */}
            <path
              d="M 400 60 L 610 60"
              stroke={getSectionColor(secA?.status || 'normal').stroke}
              strokeWidth="8"
            />

            {/* Branch 2: Main Bus -> Section B */}
            <path
              d="M 400 160 L 610 160"
              stroke={getSectionColor(secB?.status || 'normal').stroke}
              strokeWidth="9"
            />

            {/* Branch 3: Main Bus -> Section C */}
            <path
              d="M 400 260 L 610 260"
              stroke={getSectionColor(secC?.status || 'normal').stroke}
              strokeWidth="8"
            />

            {/* Branch 4: Main Bus -> Section D */}
            <path
              d="M 400 360 L 610 360"
              stroke={getSectionColor(secD?.status || 'normal').stroke}
              strokeWidth="8"
            />

            {/* Valve Icons on Branches */}
            <circle cx="480" cy="60" r="10" fill="#ffffff" stroke="#0284c7" strokeWidth="3" />
            <circle cx="480" cy="160" r="10" fill="#ffffff" stroke="#f59e0b" strokeWidth="3" />
            <circle cx="480" cy="260" r="10" fill="#ffffff" stroke="#0284c7" strokeWidth="3" />
            <circle cx="480" cy="360" r="10" fill="#ffffff" stroke="#0284c7" strokeWidth="3" />
          </svg>

          {/* Interactive HTML UI Elements placed over the schematic coordinates */}

          {/* 1. RESERVOIR NODE */}
          <div
            id="node-reservoir"
            className="absolute left-2 top-[125px] w-32 bg-white border-2 border-sky-400 rounded-xl p-3 shadow-md z-10"
          >
            <div className="flex items-center gap-1.5 text-xs font-bold text-sky-900 mb-1">
              <Droplets className="w-4 h-4 text-sky-600" />
              RESERVOIR
            </div>
            <div className="text-[11px] font-mono text-slate-600">Apex RES-01</div>
            <div className="w-full bg-slate-100 rounded-full h-2 my-1.5 overflow-hidden">
              <div className="bg-sky-500 h-2 rounded-full w-[84%]" />
            </div>
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>Cap: 25k m³</span>
              <span className="font-bold text-sky-700">84.2%</span>
            </div>
          </div>

          {/* 2. PUMP STATION NODE */}
          <div
            id="node-pump"
            className="absolute left-[205px] top-[120px] w-28 bg-white border-2 border-slate-300 rounded-xl p-3 shadow-md z-10 text-center"
          >
            <div className="inline-flex p-1.5 rounded-full bg-sky-50 text-sky-600 mb-1 animate-spin-slow">
              <Zap className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-slate-900">VFD PUMP 01</div>
            <div className="text-[11px] font-mono text-emerald-600 font-semibold">1,780 RPM</div>
            <div className="text-[10px] font-mono text-slate-400 mt-0.5">Head: 6.4 bar</div>
          </div>

          {/* 3. MAIN PIPE MANIFOLD BADGE */}
          <div
            id="node-main-header"
            className="absolute left-[340px] top-[18px] bg-slate-900 text-white px-3 py-1 rounded-md text-[11px] font-mono font-bold shadow-xs z-10"
          >
            MAIN HEADER 600mm
          </div>

          {/* 4. SECTIONS BRANCH CARDS (CLICKABLE) */}

          {/* SECTION A */}
          <div
            id="node-section-a"
            onClick={() => secA && onSelectSection(secA)}
            className={`absolute left-[590px] top-[15px] w-[340px] border-2 rounded-xl p-3.5 shadow-sm cursor-pointer transition-all hover:scale-[1.02] z-10 ${
              selectedSectionId === secA?.id ? 'ring-2 ring-sky-500 ring-offset-2' : ''
            } ${getSectionColor(secA?.status || 'normal').bg}`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-white text-xs font-bold font-mono border border-slate-200">
                  SECTION A
                </span>
                <span className="text-xs font-semibold text-slate-800 truncate max-w-[130px]">
                  Primary Treatment
                </span>
              </div>
              <StatusBadge status={secA?.status || 'normal'} size="sm" />
            </div>

            <div className="grid grid-cols-3 gap-2 font-mono text-xs">
              <div className="bg-white/80 rounded p-1.5 border border-slate-100">
                <div className="text-[10px] text-slate-400 uppercase">Pressure</div>
                <div className="font-bold text-slate-800">{secA?.pressure?.toFixed(2)} bar</div>
              </div>
              <div className="bg-white/80 rounded p-1.5 border border-slate-100">
                <div className="text-[10px] text-slate-400 uppercase">Flow</div>
                <div className="font-bold text-slate-800">{secA?.flow?.toFixed(1)} m³/h</div>
              </div>
              <div className="bg-white/80 rounded p-1.5 border border-slate-100">
                <div className="text-[10px] text-slate-400 uppercase">Leak Prob</div>
                <div className="font-bold text-emerald-700">{secA?.leakProbability}%</div>
              </div>
            </div>

            <div className="mt-2 text-[10px] text-slate-500 truncate flex items-center justify-between">
              <span>Zone: Sand Filters & Clarifiers</span>
              <span className="text-sky-600 font-semibold hover:underline">Click for Details →</span>
            </div>
          </div>

          {/* SECTION B */}
          <div
            id="node-section-b"
            onClick={() => secB && onSelectSection(secB)}
            className={`absolute left-[590px] top-[115px] w-[340px] border-2 rounded-xl p-3.5 shadow-sm cursor-pointer transition-all hover:scale-[1.02] z-10 ${
              selectedSectionId === secB?.id ? 'ring-2 ring-sky-500 ring-offset-2' : ''
            } ${getSectionColor(secB?.status || 'warning').bg}`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-white text-xs font-bold font-mono border border-slate-200">
                  SECTION B
                </span>
                <span className="text-xs font-semibold text-slate-800 truncate max-w-[130px]">
                  High-Pressure Dist.
                </span>
              </div>
              <StatusBadge status={secB?.status || 'warning'} size="sm" showPulse />
            </div>

            <div className="grid grid-cols-3 gap-2 font-mono text-xs">
              <div className="bg-white/80 rounded p-1.5 border border-slate-100">
                <div className="text-[10px] text-slate-400 uppercase">Pressure</div>
                <div
                  className={`font-bold ${
                    secB?.status === 'critical'
                      ? 'text-rose-600'
                      : secB?.status === 'warning'
                      ? 'text-amber-700'
                      : 'text-slate-800'
                  }`}
                >
                  {secB?.pressure?.toFixed(2)} bar
                </div>
              </div>
              <div className="bg-white/80 rounded p-1.5 border border-slate-100">
                <div className="text-[10px] text-slate-400 uppercase">Flow</div>
                <div className="font-bold text-slate-800">{secB?.flow?.toFixed(1)} m³/h</div>
              </div>
              <div className="bg-white/80 rounded p-1.5 border border-slate-100">
                <div className="text-[10px] text-slate-400 uppercase">Leak Prob</div>
                <div
                  className={`font-bold ${
                    secB?.status === 'critical' ? 'text-rose-600' : 'text-amber-600'
                  }`}
                >
                  {secB?.leakProbability}%
                </div>
              </div>
            </div>

            <div className="mt-2 text-[10px] flex items-center justify-between">
              <span className="text-slate-500 truncate">
                {secB?.status === 'critical' ? (
                  <span className="text-rose-600 font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 inline" /> PIPE BURST DETECTED
                  </span>
                ) : (
                  'Zone: Turbine Feed Manifold B-2'
                )}
              </span>
              <span className="text-sky-600 font-semibold hover:underline">Click for Details →</span>
            </div>
          </div>

          {/* SECTION C */}
          <div
            id="node-section-c"
            onClick={() => secC && onSelectSection(secC)}
            className={`absolute left-[590px] top-[215px] w-[340px] border-2 rounded-xl p-3.5 shadow-sm cursor-pointer transition-all hover:scale-[1.02] z-10 ${
              selectedSectionId === secC?.id ? 'ring-2 ring-sky-500 ring-offset-2' : ''
            } ${getSectionColor(secC?.status || 'normal').bg}`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-white text-xs font-bold font-mono border border-slate-200">
                  SECTION C
                </span>
                <span className="text-xs font-semibold text-slate-800 truncate max-w-[130px]">
                  Cooling Water Loop
                </span>
              </div>
              <StatusBadge status={secC?.status || 'normal'} size="sm" />
            </div>

            <div className="grid grid-cols-3 gap-2 font-mono text-xs">
              <div className="bg-white/80 rounded p-1.5 border border-slate-100">
                <div className="text-[10px] text-slate-400 uppercase">Pressure</div>
                <div className="font-bold text-slate-800">{secC?.pressure?.toFixed(2)} bar</div>
              </div>
              <div className="bg-white/80 rounded p-1.5 border border-slate-100">
                <div className="text-[10px] text-slate-400 uppercase">Flow</div>
                <div className="font-bold text-slate-800">{secC?.flow?.toFixed(1)} m³/h</div>
              </div>
              <div className="bg-white/80 rounded p-1.5 border border-slate-100">
                <div className="text-[10px] text-slate-400 uppercase">Leak Prob</div>
                <div className="font-bold text-emerald-700">{secC?.leakProbability}%</div>
              </div>
            </div>

            <div className="mt-2 text-[10px] text-slate-500 truncate flex items-center justify-between">
              <span>Zone: Heat Exchangers Loop C</span>
              <span className="text-sky-600 font-semibold hover:underline">Click for Details →</span>
            </div>
          </div>

          {/* SECTION D */}
          <div
            id="node-section-d"
            onClick={() => secD && onSelectSection(secD)}
            className={`absolute left-[590px] top-[315px] w-[340px] border-2 rounded-xl p-3.5 shadow-sm cursor-pointer transition-all hover:scale-[1.02] z-10 ${
              selectedSectionId === secD?.id ? 'ring-2 ring-sky-500 ring-offset-2' : ''
            } ${getSectionColor(secD?.status || 'normal').bg}`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-white text-xs font-bold font-mono border border-slate-200">
                  SECTION D
                </span>
                <span className="text-xs font-semibold text-slate-800 truncate max-w-[130px]">
                  Recirculation & Return
                </span>
              </div>
              <StatusBadge status={secD?.status || 'normal'} size="sm" />
            </div>

            <div className="grid grid-cols-3 gap-2 font-mono text-xs">
              <div className="bg-white/80 rounded p-1.5 border border-slate-100">
                <div className="text-[10px] text-slate-400 uppercase">Pressure</div>
                <div className="font-bold text-slate-800">{secD?.pressure?.toFixed(2)} bar</div>
              </div>
              <div className="bg-white/80 rounded p-1.5 border border-slate-100">
                <div className="text-[10px] text-slate-400 uppercase">Flow</div>
                <div className="font-bold text-slate-800">{secD?.flow?.toFixed(1)} m³/h</div>
              </div>
              <div className="bg-white/80 rounded p-1.5 border border-slate-100">
                <div className="text-[10px] text-slate-400 uppercase">Leak Prob</div>
                <div className="font-bold text-emerald-700">{secD?.leakProbability}%</div>
              </div>
            </div>

            <div className="mt-2 text-[10px] text-slate-500 truncate flex items-center justify-between">
              <span>Zone: Effluent Neutralization Grid</span>
              <span className="text-sky-600 font-semibold hover:underline">Click for Details →</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
