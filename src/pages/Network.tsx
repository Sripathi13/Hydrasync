import React, { useState } from 'react';
import { useHydrasync } from '../context/HydrasyncContext.tsx';
import { NetworkMap } from '../components/NetworkMap.tsx';
import { StatusBadge } from '../components/StatusBadge.tsx';
import { NetworkSection } from '../types/hydrasync.ts';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  Droplets,
  Filter,
  Gauge,
  Info,
  Layers,
  Network as NetworkIcon,
  RefreshCw,
  Search,
  Sliders,
  Thermometer,
  Wrench,
} from 'lucide-react';

export const Network: React.FC = () => {
  const { sections, selectedSection, setSelectedSection, updateSectionValve } = useHydrasync();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'map' | 'topology'>('map');

  const filteredSections = sections.filter((s) => {
    if (filterStatus === 'all') return true;
    return s.status === filterStatus;
  });

  const handleToggleValve = async (e: React.MouseEvent, section: NetworkSection) => {
    e.stopPropagation();
    const newOpen = section.valvesOpen > 0 ? 0 : section.valvesTotal;
    await updateSectionValve(section.id, newOpen);
  };

  return (
    <div id="network-page" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-100 text-sky-700">
              <NetworkIcon className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
                Water Distribution Network Architecture
              </h1>
              <p className="text-xs text-slate-500 font-mono">
                Topological Schematic, Pipeline Routing & Transducer Mesh
              </p>
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400 hidden sm:inline">Filter:</span>
          {['all', 'normal', 'warning', 'critical'].map((st) => (
            <button
              key={st}
              id={`filter-btn-${st}`}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                filterStatus === st
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Main Graphical Network Visualizer */}
      <div>
        <NetworkMap
          sections={sections}
          onSelectSection={(s) => setSelectedSection(s)}
          selectedSectionId={selectedSection?.id}
        />
      </div>

      {/* Interactive Section Inventory & Topology Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Distribution Sections & SCADA Nodes
            </h2>
            <p className="text-xs text-slate-500 font-mono">
              Click any section row or card to open comprehensive diagnostics
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Showing {filteredSections.length} of {sections.length} Active Nodes
          </span>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredSections.map((sec) => (
            <div
              key={sec.id}
              id={`section-card-${sec.code.toLowerCase()}`}
              onClick={() => setSelectedSection(sec)}
              className={`bg-white rounded-2xl border p-5 shadow-xs transition-all hover:shadow-md hover:-translate-y-0.5 cursor-pointer flex flex-col justify-between ${
                sec.status === 'critical'
                  ? 'border-rose-300 ring-2 ring-rose-200/50'
                  : sec.status === 'warning'
                  ? 'border-amber-300'
                  : 'border-slate-200 hover:border-sky-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 rounded-md bg-sky-50 text-sky-800 text-xs font-bold font-mono border border-sky-100">
                    SEC {sec.code}
                  </span>
                  <StatusBadge status={sec.status} size="sm" showPulse />
                </div>

                <h3 className="text-sm font-bold text-slate-900 line-clamp-1">{sec.name}</h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5 line-clamp-1">
                  Zone: {sec.productionZone}
                </p>

                {/* Mini Metrics */}
                <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 font-mono text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">Pressure</span>
                    <span
                      className={`font-bold ${
                        sec.status === 'critical' ? 'text-rose-600' : 'text-slate-800'
                      }`}
                    >
                      {sec.pressure.toFixed(2)} bar
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">Active Flow</span>
                    <span className="font-bold text-slate-800">{sec.flow.toFixed(1)} m³/h</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">Leak Prob</span>
                    <span
                      className={`font-bold ${
                        sec.leakProbability > 30 ? 'text-rose-600' : 'text-emerald-700'
                      }`}
                    >
                      {sec.leakProbability}%
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">Valves</span>
                    <span className="font-bold text-slate-800">
                      {sec.valvesOpen}/{sec.valvesTotal} Open
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button Strip */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  id={`valve-toggle-${sec.id}`}
                  onClick={(e) => handleToggleValve(e, sec)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold font-mono transition-colors ${
                    sec.valvesOpen > 0
                      ? 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
                      : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                  }`}
                  title={sec.valvesOpen > 0 ? 'Isolate Section' : 'Re-open Valves'}
                >
                  {sec.valvesOpen > 0 ? 'Isolate Valve' : 'Open Valve'}
                </button>

                <span className="text-xs text-sky-600 font-semibold hover:underline">
                  Inspect Details →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
