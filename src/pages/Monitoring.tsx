import React, { useState } from 'react';
import { useHydrasync } from '../context/HydrasyncContext.tsx';
import { StatusBadge } from '../components/StatusBadge.tsx';
import { FlowChart } from '../components/charts/FlowChart.tsx';
import { PressureChart } from '../components/charts/PressureChart.tsx';
import {
  Activity,
  ArrowDownToLine,
  CheckCircle2,
  ChevronDown,
  Download,
  Filter,
  Gauge,
  Pause,
  Play,
  RefreshCw,
  Search,
  SlidersHorizontal,
} from 'lucide-react';

export const Monitoring: React.FC = () => {
  const {
    currentReading,
    history,
    sections,
    lastUpdated,
    refreshData,
    setSelectedSection,
  } = useHydrasync();

  const [sectionFilter, setSectionFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Generate synthetic multi-row telemetry log by multiplying historical readings across sections
  const telemetryRows = history
    .slice()
    .reverse()
    .flatMap((entry, idx) => {
      return sections.map((sec) => {
        // Derive proportional reading for section
        const isCurrentSec = sec.code === 'B';
        const sectionPressure =
          sec.code === 'A'
            ? entry.pressureA
            : sec.code === 'B'
            ? entry.pressureB
            : sec.code === 'C'
            ? entry.pressureC
            : entry.pressureD;

        const secFlow = entry.flow * (sec.code === 'A' ? 0.32 : sec.code === 'B' ? 0.35 : sec.code === 'C' ? 0.2 : 0.13);
        const expectedSecFlow = entry.expectedFlow * (sec.code === 'A' ? 0.32 : sec.code === 'B' ? 0.25 : sec.code === 'C' ? 0.23 : 0.2);

        let rowStatus: 'normal' | 'warning' | 'critical' = 'normal';
        if (sec.code === 'B' && (entry.pressureB < 3.2 || entry.flow > 600)) {
          rowStatus = 'critical';
        } else if (sec.code === 'B' && entry.pressureB < 4.0) {
          rowStatus = 'warning';
        }

        return {
          id: `${entry.timestamp}-${sec.code}`,
          timestamp: entry.timestamp,
          sectionCode: sec.code,
          sectionName: sec.name,
          flow: Number(secFlow.toFixed(1)),
          expectedFlow: Number(expectedSecFlow.toFixed(1)),
          pressure: Number(sectionPressure.toFixed(2)),
          temperature: Number(entry.temperature.toFixed(1)),
          leakProbability: sec.leakProbability,
          status: rowStatus,
          sectionRef: sec,
        };
      });
    });

  // Filter rows
  const filteredRows = telemetryRows.filter((row) => {
    if (sectionFilter !== 'all' && row.sectionCode !== sectionFilter) return false;
    if (statusFilter !== 'all' && row.status !== statusFilter) return false;
    if (
      searchQuery &&
      !row.sectionName.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !row.sectionCode.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !row.timestamp.includes(searchQuery)
    ) {
      return false;
    }
    return true;
  });

  // Export CSV
  const handleExportCSV = () => {
    const headers = [
      'Timestamp',
      'Section Code',
      'Section Name',
      'Measured Flow (m3/h)',
      'Expected Flow (m3/h)',
      'Pressure (bar)',
      'Temperature (C)',
      'Leak Probability (%)',
      'Status',
    ];

    const csvContent = [
      headers.join(','),
      ...filteredRows.map((r) =>
        [
          r.timestamp,
          r.sectionCode,
          `"${r.sectionName}"`,
          r.flow,
          r.expectedFlow,
          r.pressure,
          r.temperature,
          r.leakProbability,
          r.status,
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `hydrasync-telemetry-${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="monitoring-page" className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-100 text-sky-700">
              <Gauge className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
                Live Industrial Telemetry Stream
              </h1>
              <p className="text-xs text-slate-500 font-mono">
                Continuous 5-second SCADA Multi-Parameter Polling
              </p>
            </div>
          </div>
        </div>

        {/* Live Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            id="pause-stream-btn"
            onClick={() => setIsPaused(!isPaused)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              isPaused
                ? 'bg-amber-50 border-amber-300 text-amber-800'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            {isPaused ? <Play className="w-3.5 h-3.5 fill-amber-600" /> : <Pause className="w-3.5 h-3.5" />}
            <span>{isPaused ? 'Streaming Paused' : 'Live Stream Active'}</span>
          </button>

          <button
            id="export-csv-btn"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition-all shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Dual Charts: Flow Variance + Pressure Multi-Trace */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-tight">
              Volumetric Intake vs Baseline
            </h2>
            <span className="text-xs font-mono text-slate-400">m³/h</span>
          </div>
          <FlowChart data={history} height={230} />
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-tight">
              Multi-Point Section Pressures
            </h2>
            <span className="text-xs font-mono text-slate-400">bar</span>
          </div>
          <PressureChart data={history} height={230} />
        </div>
      </div>

      {/* Telemetry Filter & Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Table Filters Bar */}
        <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50">
          <div className="flex flex-wrap items-center gap-2">
            {/* Section Filter */}
            <select
              id="telemetry-section-filter"
              value={sectionFilter}
              onChange={(e) => setSectionFilter(e.target.value)}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white border border-slate-200 focus:border-sky-500 outline-hidden font-mono"
            >
              <option value="all">All Sections (A, B, C, D)</option>
              <option value="A">Section A (Treatment)</option>
              <option value="B">Section B (Turbine Dist)</option>
              <option value="C">Section C (Cooling Loop)</option>
              <option value="D">Section D (Effluent)</option>
            </select>

            {/* Status Filter */}
            <select
              id="telemetry-status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white border border-slate-200 focus:border-sky-500 outline-hidden font-mono"
            >
              <option value="all">All Operational Statuses</option>
              <option value="normal">Normal</option>
              <option value="warning">Warning</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          <div className="relative">
            <input
              id="telemetry-search-input"
              type="text"
              placeholder="Search timestamp, section..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:border-sky-500 outline-hidden w-56 font-mono"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </div>
        </div>

        {/* Dense Table */}
        <div className="overflow-x-auto max-h-[480px]">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-50 text-[10px] text-slate-500 uppercase font-semibold sticky top-0 border-b border-slate-200 z-10">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Section</th>
                <th className="py-3 px-4">Measured Flow</th>
                <th className="py-3 px-4">Expected Flow</th>
                <th className="py-3 px-4">Pressure</th>
                <th className="py-3 px-4">Temp</th>
                <th className="py-3 px-4">Leak Prob</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRows.slice(0, 50).map((row) => (
                <tr
                  key={row.id}
                  className={`hover:bg-slate-50/80 transition-colors ${
                    row.status === 'critical'
                      ? 'bg-rose-50/30'
                      : row.status === 'warning'
                      ? 'bg-amber-50/20'
                      : ''
                  }`}
                >
                  <td className="py-2.5 px-4 font-bold text-slate-600">{row.timestamp}</td>
                  <td className="py-2.5 px-4">
                    <span className="font-sans font-bold text-slate-900 block">
                      Section {row.sectionCode}
                    </span>
                    <span className="text-[10px] text-slate-400 font-sans">{row.sectionName}</span>
                  </td>
                  <td className="py-2.5 px-4 font-bold text-slate-900">{row.flow} m³/h</td>
                  <td className="py-2.5 px-4 text-slate-500">{row.expectedFlow} m³/h</td>
                  <td className="py-2.5 px-4">
                    <span
                      className={`font-bold ${
                        row.pressure < 3.2
                          ? 'text-rose-600'
                          : row.pressure < 4.0
                          ? 'text-amber-600'
                          : 'text-slate-800'
                      }`}
                    >
                      {row.pressure} bar
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-slate-700">{row.temperature} °C</td>
                  <td className="py-2.5 px-4">
                    <span
                      className={`font-bold ${
                        row.leakProbability > 30 ? 'text-rose-600' : 'text-emerald-700'
                      }`}
                    >
                      {row.leakProbability}%
                    </span>
                  </td>
                  <td className="py-2.5 px-4">
                    <StatusBadge status={row.status} size="sm" />
                  </td>
                  <td className="py-2.5 px-4 text-right">
                    <button
                      id={`inspect-btn-${row.id}`}
                      onClick={() => setSelectedSection(row.sectionRef)}
                      className="text-xs text-sky-600 font-sans font-semibold hover:underline"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-mono">
          <span>
            Displaying {Math.min(filteredRows.length, 50)} of {filteredRows.length} sample readings
          </span>
          <span className="text-slate-400">Buffer size: 30 cycles</span>
        </div>
      </div>
    </div>
  );
};
