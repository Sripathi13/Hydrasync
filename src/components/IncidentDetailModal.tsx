import React from 'react';
import { AlertItem } from '../types/hydrasync.ts';
import { StatusBadge } from './StatusBadge.tsx';
import { X, AlertTriangle, CheckCircle, ShieldAlert, DollarSign, Activity, Wrench } from 'lucide-react';

interface IncidentDetailModalProps {
  alert: AlertItem | null;
  onClose: () => void;
  onResolve: (id: string) => void;
  onDismiss: (id: string) => void;
}

export const IncidentDetailModal: React.FC<IncidentDetailModalProps> = ({
  alert,
  onClose,
  onResolve,
  onDismiss,
}) => {
  if (!alert) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div
        id="incident-detail-modal"
        className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between px-6 py-4 border-b ${
            alert.severity === 'critical'
              ? 'bg-rose-50/70 border-rose-100'
              : alert.severity === 'warning'
              ? 'bg-amber-50/70 border-amber-100'
              : 'bg-slate-50 border-slate-100'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div
              className={`p-2 rounded-lg ${
                alert.severity === 'critical'
                  ? 'bg-rose-100 text-rose-700'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-slate-500">{alert.id}</span>
                <StatusBadge status={alert.severity} size="sm" showPulse />
              </div>
              <h2 className="text-sm font-bold text-slate-900 mt-0.5">{alert.title}</h2>
            </div>
          </div>
          <button
            id="close-incident-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Key Incident Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                Target Section
              </span>
              <span className="text-base font-bold text-slate-800">
                {alert.section ? `Section ${alert.section}` : 'System Wide'}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                Leak Discharge
              </span>
              <span className="text-base font-bold text-rose-600">{alert.leakRate} m³/h</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                Pressure Drop
              </span>
              <span className="text-base font-bold text-amber-700">-{alert.pressureDrop} bar</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                Loss Rate
              </span>
              <span className="text-base font-bold text-slate-900">${alert.estimatedLoss}/hr</span>
            </div>
          </div>

          {/* Explanation */}
          <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-200 text-xs">
            <div className="font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-sky-600" />
              Root-Cause Hydraulic Diagnosis
            </div>
            <p className="text-slate-700 leading-relaxed font-sans">{alert.explanation}</p>
          </div>

          {/* Recommended Action */}
          <div className="bg-sky-50/60 rounded-xl p-4 border border-sky-200 text-xs">
            <div className="font-bold uppercase tracking-wider text-sky-900 mb-1.5 flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5 text-sky-700" />
              Prescribed SCADA Intervention
            </div>
            <p className="text-sky-900 leading-relaxed font-sans font-medium">
              {alert.recommendedAction}
            </p>
          </div>

          {/* Resolution Stamp if resolved */}
          {alert.status === 'resolved' && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-xs text-emerald-800">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Resolved at <strong>{alert.resolvedAt}</strong> by{' '}
                <strong>{alert.resolvedBy || 'Operator'}</strong>.
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <div className="text-xs font-mono text-slate-400">Timestamp: {alert.timestamp}</div>
          <div className="flex items-center gap-2">
            <button
              id="dismiss-alert-action-btn"
              onClick={() => {
                onDismiss(alert.id);
                onClose();
              }}
              className="px-3.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors"
            >
              Dismiss
            </button>
            {alert.status !== 'resolved' && (
              <button
                id="resolve-alert-action-btn"
                onClick={() => {
                  onResolve(alert.id);
                  onClose();
                }}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                Resolve Incident
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
