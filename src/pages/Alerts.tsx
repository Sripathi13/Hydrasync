import React, { useState } from 'react';
import { useHydrasync } from '../context/HydrasyncContext.tsx';
import { StatusBadge } from '../components/StatusBadge.tsx';
import { AlertItem } from '../types/hydrasync.ts';
import {
  AlertTriangle,
  CheckCircle,
  CheckCircle2,
  Clock,
  DollarSign,
  Filter,
  PlusCircle,
  RefreshCw,
  Search,
  ShieldAlert,
  Trash2,
  Wrench,
} from 'lucide-react';

export const Alerts: React.FC = () => {
  const { alerts, selectedAlert, setSelectedAlert, resolveAlert, dismissAlert } = useHydrasync();
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState<string>('');

  const filteredAlerts = alerts.filter((a) => {
    if (severityFilter !== 'all' && a.severity !== severityFilter) return false;
    if (statusFilter !== 'all' && a.status !== statusFilter) return false;
    if (
      search &&
      !a.title.toLowerCase().includes(search.toLowerCase()) &&
      !a.id.toLowerCase().includes(search.toLowerCase()) &&
      !a.section.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const activeCount = alerts.filter((a) => a.status === 'active').length;
  const criticalCount = alerts.filter((a) => a.severity === 'critical' && a.status === 'active').length;
  const totalFinancialLoss = alerts
    .filter((a) => a.status === 'active')
    .reduce((sum, a) => sum + a.estimatedLoss, 0);

  return (
    <div id="alerts-page" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-100 text-rose-700">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
                Incident Triage & SCADA Alerts
              </h1>
              <p className="text-xs text-slate-500 font-mono">
                Real-Time Anomaly Detection, Leak Localization & Operator Workflows
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-mono bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
            <span className="text-slate-500">Active Financial Exposure:</span>
            <span className="font-bold text-rose-600">${totalFinancialLoss}/hr</span>
          </div>
        </div>
      </div>

      {/* KPI Triage Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] text-slate-400 font-mono uppercase font-bold block">
            Total Logged
          </span>
          <span className="text-2xl font-bold font-mono text-slate-900 mt-1 block">
            {alerts.length}
          </span>
          <span className="text-xs text-slate-500">All historical incidents</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] text-slate-400 font-mono uppercase font-bold block">
            Active Unresolved
          </span>
          <span className="text-2xl font-bold font-mono text-rose-600 mt-1 block">
            {activeCount}
          </span>
          <span className="text-xs text-slate-500">Requires SCADA triage</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] text-slate-400 font-mono uppercase font-bold block">
            Critical Red Alerts
          </span>
          <span className="text-2xl font-bold font-mono text-rose-700 mt-1 block">
            {criticalCount}
          </span>
          <span className="text-xs text-slate-500">Immediate valve isolation</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] text-slate-400 font-mono uppercase font-bold block">
            Resolved Incidents
          </span>
          <span className="text-2xl font-bold font-mono text-emerald-600 mt-1 block">
            {alerts.filter((a) => a.status === 'resolved').length}
          </span>
          <span className="text-xs text-slate-500">Mitigated & verified</span>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Severity selector */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            {['all', 'critical', 'warning', 'info'].map((sev) => (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold uppercase font-mono transition-colors ${
                  severityFilter === sev
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>

          {/* Status selector */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            {['all', 'active', 'resolved'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold capitalize transition-colors ${
                  statusFilter === st
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Search incident title, ID, section..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:border-sky-500 outline-hidden w-64 font-mono"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
        </div>
      </div>

      {/* Alerts Table List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-50 text-[10px] text-slate-500 uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Incident ID</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Section</th>
                <th className="py-3 px-4">Incident Description</th>
                <th className="py-3 px-4">Flow Dev</th>
                <th className="py-3 px-4">Press Drop</th>
                <th className="py-3 px-4">Loss ($/hr)</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Triage Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAlerts.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    No incidents matching selected filters.
                  </td>
                </tr>
              ) : (
                filteredAlerts.map((alert) => (
                  <tr
                    key={alert.id}
                    id={`alert-row-${alert.id}`}
                    className={`hover:bg-slate-50/80 transition-colors cursor-pointer ${
                      alert.severity === 'critical' && alert.status === 'active'
                        ? 'bg-rose-50/40'
                        : alert.severity === 'warning' && alert.status === 'active'
                        ? 'bg-amber-50/20'
                        : ''
                    }`}
                    onClick={() => setSelectedAlert(alert)}
                  >
                    <td className="py-3 px-4 font-bold text-slate-800">{alert.id}</td>
                    <td className="py-3 px-4">
                      <StatusBadge status={alert.severity} size="sm" showPulse />
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-900">
                        {alert.section ? `Section ${alert.section}` : 'System Wide'}
                      </span>
                    </td>
                    <td className="py-3 px-4 max-w-xs">
                      <div className="font-sans font-semibold text-slate-900 truncate">
                        {alert.title}
                      </div>
                      <div className="font-sans text-[11px] text-slate-400 truncate">
                        {alert.explanation}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-800">+{alert.leakRate} m³/h</td>
                    <td className="py-3 px-4 text-amber-700 font-bold">-{alert.pressureDrop} bar</td>
                    <td className="py-3 px-4 text-rose-600 font-bold">${alert.estimatedLoss}/hr</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold capitalize ${
                          alert.status === 'active'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {alert.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div
                        className="inline-flex items-center gap-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {alert.status === 'active' && (
                          <button
                            id={`quick-resolve-${alert.id}`}
                            onClick={() => resolveAlert(alert.id)}
                            className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-sans font-semibold transition-colors"
                          >
                            Resolve
                          </button>
                        )}
                        <button
                          id={`quick-dismiss-${alert.id}`}
                          onClick={() => dismissAlert(alert.id)}
                          className="px-2.5 py-1 rounded border border-slate-200 hover:bg-slate-100 text-slate-600 text-[11px] font-sans font-medium transition-colors"
                        >
                          Dismiss
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
