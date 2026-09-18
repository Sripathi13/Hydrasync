import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Activity,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Cpu,
  Database,
  DollarSign,
  Droplets,
  Gauge,
  Layers,
  Network,
  Radio,
  ShieldAlert,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-sky-500 selection:text-white">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-sky-600 to-blue-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
              <Droplets className="w-5 h-5 fill-white/20" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight text-slate-900">HYDRASYNC</span>
              <span className="text-[10px] font-mono font-bold text-sky-600 ml-1.5 px-1.5 py-0.5 rounded bg-sky-50 border border-sky-100">
                SCADA 2.4
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-600">
            <a href="#problem" className="hover:text-sky-600 transition-colors">
              The Industrial Problem
            </a>
            <a href="#capabilities" className="hover:text-sky-600 transition-colors">
              Core Capabilities
            </a>
            <a href="#technology" className="hover:text-sky-600 transition-colors">
              Telemetry Architecture
            </a>
            <a href="#benefits" className="hover:text-sky-600 transition-colors">
              Fiscal ROI
            </a>
          </div>

          <div className="flex items-center gap-3">
            <NavLink
              to="/login"
              id="landing-cta-btn"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition-all shadow-md shadow-sky-600/20 hover:shadow-lg hover:shadow-sky-600/30 active:scale-98"
            >
              <span>Enter HYDRASYNC</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </NavLink>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-32 bg-linear-to-b from-sky-50/50 via-white to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-100/70 border border-sky-200 text-sky-800 text-xs font-semibold mb-6">
            <span className="w-2 h-2 rounded-full bg-sky-600 animate-pulse" />
            <span>Industrial Water Intelligence Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 max-w-4xl mx-auto leading-[1.08]">
            Intelligent Water. <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-sky-600 via-blue-600 to-cyan-600">
              Zero Waste.
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Real-time hydraulic telemetry, sub-second anomaly localization, acoustic leak detection,
            and predictive fiscal loss calculation for heavy manufacturing and utility networks.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <NavLink
              to="/login"
              id="hero-enter-platform-btn"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-sm font-bold shadow-lg shadow-sky-600/25 transition-all hover:scale-[1.02] active:scale-98"
            >
              <span>Enter HYDRASYNC Console</span>
              <ArrowRight className="w-4 h-4" />
            </NavLink>
            <NavLink
              to="/dashboard"
              id="hero-quick-demo-btn"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white text-slate-800 text-sm font-semibold hover:bg-slate-50 transition-all shadow-xs"
            >
              <span>Explore Live Dashboard Demo</span>
            </NavLink>
          </div>

          {/* Quick Telemetry KPI Ribbon */}
          <div className="mt-14 max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">
                Network Latency
              </span>
              <span className="text-2xl font-bold font-mono text-slate-900 mt-1 block">
                &lt; 500ms
              </span>
              <span className="text-xs text-slate-500">Edge IoT telemetry push</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">
                Anomaly Confidence
              </span>
              <span className="text-2xl font-bold font-mono text-sky-600 mt-1 block">99.4%</span>
              <span className="text-xs text-slate-500">Hydraulic correlation logic</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">
                Loss Avoidance
              </span>
              <span className="text-2xl font-bold font-mono text-emerald-600 mt-1 block">
                $180k+
              </span>
              <span className="text-xs text-slate-500">Annualized per facility</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">
                Pipeline Coverage
              </span>
              <span className="text-2xl font-bold font-mono text-slate-900 mt-1 block">100%</span>
              <span className="text-xs text-slate-500">Acoustic & pressure mesh</span>
            </div>
          </div>
        </div>
      </section>

      {/* Problem vs Solution */}
      <section id="problem" className="py-20 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-sky-600 font-mono">
              Industrial Challenge
            </h2>
            <p className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">
              Traditional SCADA is Blind to Sub-Surface Volumetric Leaks
            </p>
            <p className="mt-4 text-slate-600 text-sm sm:text-base">
              Conventional plants wait until end-of-month water utility bills arrive before
              discovering catastrophic buried pipe ruptures, valve bypasses, or heat-exchanger
              failing seals.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* The Old Way */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs">
              <div className="inline-flex p-3 rounded-xl bg-rose-50 text-rose-600 mb-4 font-bold text-xs uppercase tracking-wider">
                Legacy SCADA & Manual Inspection
              </div>
              <ul className="space-y-4 text-sm text-slate-600">
                <li className="flex items-start gap-3">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span>
                    <strong>Delayed Anomaly Discovery:</strong> Hidden micro-leaks bleed tens of
                    thousands of gallons for weeks before surface puddling occurs.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span>
                    <strong>No Fiscal Correlation:</strong> Operators see fluctuating bar readings
                    without automated dollar-loss quantification.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span>
                    <strong>Manual Valve Hunting:</strong> Maintenance crews manually close dozens of
                    manual isolation valves to locate a suspected pressure drop.
                  </span>
                </li>
              </ul>
            </div>

            {/* The HydraSync Way */}
            <div className="bg-linear-to-br from-sky-50 to-blue-50/40 p-8 rounded-2xl border border-sky-200 shadow-xs">
              <div className="inline-flex p-3 rounded-xl bg-sky-600 text-white mb-4 font-bold text-xs uppercase tracking-wider shadow-xs">
                The HydraSync Intelligence Engine
              </div>
              <ul className="space-y-4 text-sm text-slate-700">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Automated Hydraulic Correlation:</strong> Flow deviation and localized
                    pressure drops are paired with acoustic resonance for sub-second leak detection.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Instant Fiscal Loss Modeling:</strong> Every m³/h lost is dynamically
                    converted into hourly, monthly, and annualized avoidable financial burden.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Predictive Scenario Simulation:</strong> Test hypothetical pipe bursts,
                    cooling tower outages, and pump ramp-ups before hardware stress occurs.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Core Capabilities */}
      <section id="capabilities" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-sky-600 font-mono">
              Operational Modules
            </h2>
            <p className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">
              End-to-End Industrial Water Intelligence
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl border border-slate-200 bg-white hover:border-sky-300 hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center mb-4">
                <Network className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Topological Schematic Map
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Visual pipeline topology mapping reservoirs, variable frequency pumps, main header
                manifolds, and active manufacturing sectors with live flow-rate animations.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 bg-white hover:border-sky-300 hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4">
                <Gauge className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Real-Time Telemetry Stream
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Sub-5-second continuous sampling across multi-point pressure gauges, thermal
                transmitters, production demand meters, and microgrid solar/grid telemetry.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 bg-white hover:border-sky-300 hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center mb-4">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Autonomous Anomaly Engine
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                AI/ML demo inference and hydraulic rule engines calculating volumetric deviation,
                pressure delta, and acoustic confidence to isolate exact culprit sections.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 bg-white hover:border-sky-300 hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                <DollarSign className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Financial Impact Modeling
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Configurable industrial water unit tariffs instantly recomputing hourly, daily, and
                annualized losses, demonstrating tangible intervention payback to CFOs.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 bg-white hover:border-sky-300 hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Digital Twin Scenario Simulator
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Test 7 realistic stress events including pipe bursts, restricted valves, cooling
                tower trips, and sensor communication dropouts in a safe sandbox.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 bg-white hover:border-sky-300 hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-4">
                <Radio className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Sensor Fleet Administration
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Manage IoT flow meters, acoustic sensors, and pressure transmitters with battery
                health telemetry, signal strength dBm ratings, and dynamic registration.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Stack Preview */}
      <section id="technology" className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-wider text-sky-600 font-mono">
              Industrial Infrastructure
            </h2>
            <p className="mt-2 text-3xl font-extrabold text-slate-900">
              Enterprise IoT & SCADA Architecture
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-center font-mono text-xs">
            <div className="p-4 rounded-xl bg-white border border-slate-200">
              <div className="text-sky-600 font-bold mb-1">WebSocket Protocol</div>
              <div className="text-slate-500">Socket.IO real-time event pipeline</div>
            </div>
            <div className="p-4 rounded-xl bg-white border border-slate-200">
              <div className="text-sky-600 font-bold mb-1">Edge Simulator</div>
              <div className="text-slate-500">Gaussian synthetic sensor engine</div>
            </div>
            <div className="p-4 rounded-xl bg-white border border-slate-200">
              <div className="text-sky-600 font-bold mb-1">REST SCADA API</div>
              <div className="text-slate-500">Stateless telemetry & control</div>
            </div>
            <div className="p-4 rounded-xl bg-white border border-slate-200">
              <div className="text-sky-600 font-bold mb-1">Database Ready</div>
              <div className="text-slate-500">PostgreSQL & MQTT compatible</div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Bar */}
      <section className="py-16 bg-sky-600 text-white">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Launch Your Water Intelligence Platform
          </h2>
          <p className="mt-4 text-sky-100 text-sm sm:text-base max-w-xl mx-auto">
            Experience the live industrial dashboard with pre-configured telemetry, active
            incidents, and interactive scenarios.
          </p>
          <div className="mt-8">
            <NavLink
              to="/login"
              id="cta-enter-hydrasync-btn"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white hover:bg-slate-50 text-sky-700 text-sm font-bold shadow-xl transition-all hover:scale-105 active:scale-98"
            >
              <span>Enter HYDRASYNC</span>
              <ArrowRight className="w-4 h-4" />
            </NavLink>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-white border-t border-slate-100 text-center text-xs text-slate-400 font-mono">
        HYDRASYNC v2.4 • Industrial SCADA & Water Network Intelligence • Intelligent Water. Zero Waste.
      </footer>
    </div>
  );
};
