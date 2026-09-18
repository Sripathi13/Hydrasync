import React, { useState } from 'react';
import { useHydrasync } from '../context/HydrasyncContext.tsx';
import { StatusBadge } from '../components/StatusBadge.tsx';
import { SensorItem } from '../types/hydrasync.ts';
import {
  Battery,
  BatteryCharging,
  BatteryMedium,
  CheckCircle2,
  Cpu,
  Filter,
  Plus,
  Radio,
  RefreshCw,
  Search,
  Wifi,
  Wrench,
  X,
} from 'lucide-react';

export const Sensors: React.FC = () => {
  const { sensors, registerSensor } = useHydrasync();

  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [sectionFilter, setSectionFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // New Sensor form state
  const [newSensor, setNewSensor] = useState({
    name: '',
    type: 'pressure' as const,
    section: 'A',
    unit: 'bar',
  });

  const filteredSensors = sensors.filter((s) => {
    if (typeFilter !== 'all' && s.type.toLowerCase() !== typeFilter.toLowerCase()) return false;
    if (sectionFilter !== 'all' && s.section !== sectionFilter) return false;
    if (statusFilter !== 'all' && s.status !== statusFilter) return false;
    if (
      search &&
      !(s.name || s.id).toLowerCase().includes(search.toLowerCase()) &&
      !s.id.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const onlineCount = sensors.filter((s) => s.status === 'online' || s.status === 'normal').length;
  const warningCount = sensors.filter((s) => s.status === 'warning').length;
  const offlineCount = sensors.filter((s) => s.status === 'offline' || s.status === 'critical').length;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSensor.name) return;
    await registerSensor({
      name: newSensor.name,
      type: newSensor.type,
      section: newSensor.section,
      currentValue: newSensor.type === 'pressure' ? 5.2 : newSensor.type === 'flow' ? 140 : 18,
      unit: newSensor.unit,
      batteryLevel: 100,
      signalStrength: -62,
      status: 'online',
      lastCalibration: new Date().toISOString().slice(0, 10),
    });
    setIsModalOpen(false);
    setNewSensor({ name: '', type: 'pressure', section: 'A', unit: 'bar' });
  };

  return (
    <div id="sensors-page" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-100 text-sky-700">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
                IoT Sensor Fleet & Telemetry Transducers
              </h1>
              <p className="text-xs text-slate-500 font-mono">
                Hardware Health, Battery Life, LoRaWAN/Cellular Signal & Calibration
              </p>
            </div>
          </div>
        </div>

        <button
          id="register-new-sensor-btn"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition-all shadow-xs active:scale-98"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Sensor</span>
        </button>
      </div>

      {/* Fleet Status Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] text-slate-400 font-mono uppercase font-bold block">
            Fleet Hardware
          </span>
          <span className="text-2xl font-bold font-mono text-slate-900 mt-1 block">
            {sensors.length}
          </span>
          <span className="text-xs text-slate-500">Total deployed IoT nodes</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] text-slate-400 font-mono uppercase font-bold block">
            Online Streaming
          </span>
          <span className="text-2xl font-bold font-mono text-emerald-600 mt-1 block">
            {onlineCount}
          </span>
          <span className="text-xs text-slate-500">Active telemetry heartbeat</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] text-slate-400 font-mono uppercase font-bold block">
            Low Battery / Warning
          </span>
          <span className="text-2xl font-bold font-mono text-amber-600 mt-1 block">
            {warningCount}
          </span>
          <span className="text-xs text-slate-500">Requires calibration or cell swap</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] text-slate-400 font-mono uppercase font-bold block">
            Offline Devices
          </span>
          <span className="text-2xl font-bold font-mono text-slate-400 mt-1 block">
            {offlineCount}
          </span>
          <span className="text-xs text-slate-500">Scheduled maintenance standby</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Type Filter */}
          <select
            id="sensor-type-filter"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 bg-white focus:border-sky-500 outline-hidden font-mono"
          >
            <option value="all">All Sensor Types</option>
            <option value="pressure">Pressure Transducers</option>
            <option value="flow">Electromagnetic Flowmeters</option>
            <option value="acoustic">Acoustic Hydrophones</option>
            <option value="valve">Valve Actuators</option>
          </select>

          {/* Section Filter */}
          <select
            id="sensor-section-filter"
            value={sectionFilter}
            onChange={(e) => setSectionFilter(e.target.value)}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 bg-white focus:border-sky-500 outline-hidden font-mono"
          >
            <option value="all">All Pipeline Sections</option>
            <option value="A">Section A</option>
            <option value="B">Section B</option>
            <option value="C">Section C</option>
            <option value="D">Section D</option>
          </select>

          {/* Status Filter */}
          <select
            id="sensor-status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 bg-white focus:border-sky-500 outline-hidden font-mono"
          >
            <option value="all">All Fleet Statuses</option>
            <option value="online">Online</option>
            <option value="warning">Warning</option>
            <option value="offline">Offline</option>
          </select>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Search sensor ID, tag..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:border-sky-500 outline-hidden w-56 font-mono"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
        </div>
      </div>

      {/* Sensor Inventory Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-50 text-[10px] text-slate-500 uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Sensor Tag</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Section / Location</th>
                <th className="py-3 px-4">Live Reading</th>
                <th className="py-3 px-4">Battery</th>
                <th className="py-3 px-4">Signal</th>
                <th className="py-3 px-4">Calibration</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSensors.map((sensor) => {
                const reading = sensor.currentValue ?? sensor.currentReading ?? 0;
                const battery = sensor.batteryLevel ?? sensor.battery ?? 85;
                const signal = sensor.signalStrength ?? sensor.signal ?? -65;
                const calib = sensor.lastCalibration ?? sensor.lastCommunication ?? '2026-03-12';
                const label = sensor.name || `Transducer ${sensor.id}`;

                return (
                  <tr key={sensor.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{sensor.id}</div>
                      <div className="text-[11px] font-sans text-slate-500">{label}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 uppercase text-[10px] font-bold">
                        {sensor.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-sans text-slate-700">Section {sensor.section}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {reading} {sensor.unit}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <Battery
                          className={`w-4 h-4 ${
                            battery < 25
                              ? 'text-rose-600'
                              : battery < 50
                              ? 'text-amber-500'
                              : 'text-emerald-600'
                          }`}
                        />
                        <span className={battery < 25 ? 'font-bold text-rose-600' : ''}>
                          {battery}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      <div className="flex items-center gap-1">
                        <Wifi className="w-3.5 h-3.5 text-sky-600" />
                        <span>{signal} dBm</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-500">{calib}</td>
                    <td className="py-3 px-4">
                      <StatusBadge status={sensor.status} size="sm" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Registration Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h3 className="text-sm font-bold text-slate-900">Commission New IoT Sensor</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegister} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                  Sensor Tag / Model Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Endress+Hauser Promag 300"
                  value={newSensor.name}
                  onChange={(e) => setNewSensor({ ...newSensor, name: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 outline-hidden font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                    Sensor Type
                  </label>
                  <select
                    value={newSensor.type}
                    onChange={(e) => {
                      const t = e.target.value as any;
                      const u = t === 'pressure' ? 'bar' : t === 'flow' ? 'm³/h' : 'dB';
                      setNewSensor({ ...newSensor, type: t, unit: u });
                    }}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 outline-hidden font-mono"
                  >
                    <option value="pressure">Pressure</option>
                    <option value="flow">Flow</option>
                    <option value="acoustic">Acoustic</option>
                    <option value="valve">Valve Actuator</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                    Section
                  </label>
                  <select
                    value={newSensor.section}
                    onChange={(e) => setNewSensor({ ...newSensor, section: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 outline-hidden font-mono"
                  >
                    <option value="A">Section A</option>
                    <option value="B">Section B</option>
                    <option value="C">Section C</option>
                    <option value="D">Section D</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-xs"
                >
                  Commission Hardware
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
