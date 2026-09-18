import React, { useState } from 'react';
import { useHydrasync } from '../context/HydrasyncContext.tsx';
import {
  Bell,
  Building2,
  CheckCircle2,
  DollarSign,
  Droplets,
  Gauge,
  RotateCcw,
  Save,
  Settings as SettingsIcon,
  ShieldAlert,
  Sliders,
  User,
} from 'lucide-react';

export const Settings: React.FC = () => {
  const { settings, updateSettings, user } = useHydrasync();
  const [formData, setFormData] = useState({ ...settings });
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'network' | 'financials' | 'alerts' | 'facility'>('network');

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setIsSaved(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleResetDefaults = async () => {
    const defaults = {
      baselineFlow: 530,
      targetPressure: 4.8,
      leakSensitivity: 82,
      waterCostPerUnit: 3.85,
      energyCostPerUnit: 0.42,
      currency: 'USD',
      warningThresholdDeviation: 10,
      criticalThresholdDeviation: 25,
      pressureDropThreshold: 0.8,
      facilityName: 'HydraSync Metro Apex Plant 04',
      facilityLocation: 'Industrial Zone 7, Sector B, Hub 4',
      operatorOnDuty: 'Alex Mercer (Lead SCADA)',
      simulationInterval: 5,
    };
    setFormData(defaults);
    await updateSettings(defaults);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div id="settings-page" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-100 text-sky-700">
              <SettingsIcon className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
                SCADA System & Telemetry Configuration
              </h1>
              <p className="text-xs text-slate-500 font-mono">
                Facility Thresholds, Financial Tariffs & Calibration Parameters
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isSaved && (
            <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
              <CheckCircle2 className="w-4 h-4" />
              Settings Updated
            </span>
          )}
          <button
            type="button"
            onClick={handleResetDefaults}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
        </div>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-2 font-mono text-xs overflow-x-auto">
        {[
          { id: 'network', label: 'Hydraulic Network', icon: Droplets },
          { id: 'financials', label: 'Financial Tariffs', icon: DollarSign },
          { id: 'alerts', label: 'Alert Thresholds', icon: ShieldAlert },
          { id: 'facility', label: 'Facility Profile', icon: Building2 },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 border-b-2 font-semibold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-sky-600 text-sky-700 bg-sky-50/50 rounded-t-lg'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
        {activeTab === 'network' && (
          <div className="space-y-5 animate-in fade-in">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-tight">
              Hydraulic Network Baselines
            </h2>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-700 mb-1.5">
                  Calibrated Baseline Flow (m³/h)
                </label>
                <input
                  type="number"
                  step="1"
                  value={formData.baselineFlow}
                  onChange={(e) => handleChange('baselineFlow', parseFloat(e.target.value))}
                  className="w-full text-xs font-mono px-3 py-2 rounded-lg border border-slate-200 outline-hidden font-bold"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Baseline intake rate calibrated for typical diurnal operating hours.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-700 mb-1.5">
                  Target Header Pressure (bar)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.targetPressure}
                  onChange={(e) => handleChange('targetPressure', parseFloat(e.target.value))}
                  className="w-full text-xs font-mono px-3 py-2 rounded-lg border border-slate-200 outline-hidden font-bold"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Optimal pressure setpoint across Main Header Bus.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-700 mb-1.5">
                  AI Leak Sensitivity Score (0 - 100)
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={formData.leakSensitivity}
                  onChange={(e) => handleChange('leakSensitivity', parseInt(e.target.value))}
                  className="w-full text-xs font-mono px-3 py-2 rounded-lg border border-slate-200 outline-hidden font-bold"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Higher sensitivity flags micro-deviations earlier with tighter confidence bounds.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-700 mb-1.5">
                  SCADA Telemetry Polling Interval (Seconds)
                </label>
                <input
                  type="number"
                  min="2"
                  max="60"
                  value={formData.simulationInterval}
                  onChange={(e) => handleChange('simulationInterval', parseInt(e.target.value))}
                  className="w-full text-xs font-mono px-3 py-2 rounded-lg border border-slate-200 outline-hidden font-bold"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  WebSocket push frequency for edge transceivers (default 5s).
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'financials' && (
          <div className="space-y-5 animate-in fade-in">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-tight">
              Financial Tariffs & Billing Parameters
            </h2>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-700 mb-1.5">
                  Industrial Water Unit Tariff ($/m³)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.waterCostPerUnit}
                  onChange={(e) => handleChange('waterCostPerUnit', parseFloat(e.target.value))}
                  className="w-full text-xs font-mono px-3 py-2 rounded-lg border border-slate-200 outline-hidden font-bold"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Blended contract cost for municipal intake and wastewater discharge.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-700 mb-1.5">
                  Pumping Energy Factor ($/m³)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.energyCostPerUnit}
                  onChange={(e) => handleChange('energyCostPerUnit', parseFloat(e.target.value))}
                  className="w-full text-xs font-mono px-3 py-2 rounded-lg border border-slate-200 outline-hidden font-bold"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Electricity cost per cubic meter pressurized through primary pumps.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-700 mb-1.5">
                  Billing Currency
                </label>
                <select
                  value={formData.currency}
                  onChange={(e) => handleChange('currency', e.target.value)}
                  className="w-full text-xs font-mono px-3 py-2 rounded-lg border border-slate-200 outline-hidden font-bold"
                >
                  <option value="USD">USD ($) - United States Dollar</option>
                  <option value="EUR">EUR (€) - Euro</option>
                  <option value="GBP">GBP (£) - British Pound</option>
                  <option value="CAD">CAD ($) - Canadian Dollar</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'alerts' && (
          <div className="space-y-5 animate-in fade-in">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-tight">
              SCADA Alarm & Incident Setpoints
            </h2>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-700 mb-1.5">
                  Warning Flow Deviation (%)
                </label>
                <input
                  type="number"
                  step="1"
                  value={formData.warningThresholdDeviation}
                  onChange={(e) =>
                    handleChange('warningThresholdDeviation', parseFloat(e.target.value))
                  }
                  className="w-full text-xs font-mono px-3 py-2 rounded-lg border border-slate-200 outline-hidden font-bold"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Trigger amber warning when flow departs from baseline by this percentage.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-700 mb-1.5">
                  Critical Flow Deviation (%)
                </label>
                <input
                  type="number"
                  step="1"
                  value={formData.criticalThresholdDeviation}
                  onChange={(e) =>
                    handleChange('criticalThresholdDeviation', parseFloat(e.target.value))
                  }
                  className="w-full text-xs font-mono px-3 py-2 rounded-lg border border-slate-200 outline-hidden font-bold"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Trigger critical siren / red emergency alarm when flow exceeds this percentage.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-700 mb-1.5">
                  Pressure Drop Threshold (bar)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.pressureDropThreshold}
                  onChange={(e) =>
                    handleChange('pressureDropThreshold', parseFloat(e.target.value))
                  }
                  className="w-full text-xs font-mono px-3 py-2 rounded-lg border border-slate-200 outline-hidden font-bold"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Localized pressure reduction from expected level signifying physical rupture.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'facility' && (
          <div className="space-y-5 animate-in fade-in">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-tight">
              Facility Node Information
            </h2>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-700 mb-1.5">
                  Facility Designation
                </label>
                <input
                  type="text"
                  value={formData.facilityName}
                  onChange={(e) => handleChange('facilityName', e.target.value)}
                  className="w-full text-xs font-mono px-3 py-2 rounded-lg border border-slate-200 outline-hidden font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-700 mb-1.5">
                  Geographic Location
                </label>
                <input
                  type="text"
                  value={formData.facilityLocation}
                  onChange={(e) => handleChange('facilityLocation', e.target.value)}
                  className="w-full text-xs font-mono px-3 py-2 rounded-lg border border-slate-200 outline-hidden font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-700 mb-1.5">
                  Operator on Duty
                </label>
                <input
                  type="text"
                  value={formData.operatorOnDuty}
                  onChange={(e) => handleChange('operatorOnDuty', e.target.value)}
                  className="w-full text-xs font-mono px-3 py-2 rounded-lg border border-slate-200 outline-hidden font-bold"
                />
              </div>
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
          <button
            id="save-settings-submit-btn"
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md transition-all active:scale-98"
          >
            <Save className="w-4 h-4" />
            <span>Save & Apply SCADA Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
};
