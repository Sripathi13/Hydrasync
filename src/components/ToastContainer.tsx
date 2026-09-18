import React from 'react';
import { useHydrasync } from '../context/HydrasyncContext.tsx';
import { AlertTriangle, CheckCircle, Info, XCircle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useHydrasync();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let borderClass = 'border-slate-200 bg-white';
        let icon = <Info className="w-4 h-4 text-sky-600" />;

        if (toast.type === 'success') {
          borderClass = 'border-emerald-200 bg-white';
          icon = <CheckCircle className="w-4 h-4 text-emerald-600" />;
        } else if (toast.type === 'warning') {
          borderClass = 'border-amber-200 bg-white';
          icon = <AlertTriangle className="w-4 h-4 text-amber-600" />;
        } else if (toast.type === 'error') {
          borderClass = 'border-rose-300 bg-rose-50/90';
          icon = <XCircle className="w-4 h-4 text-rose-600" />;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border ${borderClass} shadow-lg transition-all animate-in slide-in-from-bottom-2`}
          >
            <div className="shrink-0 mt-0.5">{icon}</div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-slate-900 tracking-tight">{toast.title}</div>
              <div className="text-[11px] text-slate-600 mt-0.5 leading-snug line-clamp-2">
                {toast.message}
              </div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 p-0.5 rounded transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
