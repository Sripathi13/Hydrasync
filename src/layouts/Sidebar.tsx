import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Cpu,
  Database,
  DollarSign,
  Droplets,
  FileText,
  Gauge,
  Layers,
  LogOut,
  Network,
  Radio,
  Settings,
  ShieldCheck,
  Sliders,
  User,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { useHydrasync } from '../context/HydrasyncContext.tsx';

interface SidebarProps {
  isOpen: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onCloseMobile }) => {
  const { user, systemHealth, connectionStatus, alerts, logout } = useHydrasync();
  const navigate = useNavigate();

  const activeAlertsCount = alerts.filter((a) => a.status === 'active').length;

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: Activity, badge: null },
    { to: '/network', label: 'Network', icon: Network, badge: null },
    { to: '/monitoring', label: 'Monitoring', icon: Gauge, badge: 'LIVE' },
    {
      to: '/alerts',
      label: 'Alerts',
      icon: AlertTriangle,
      badge: activeAlertsCount > 0 ? `${activeAlertsCount}` : null,
      badgeColor: activeAlertsCount > 0 ? 'bg-rose-500 text-white' : '',
    },
    { to: '/analytics', label: 'Analytics', icon: BarChart3, badge: null },
    { to: '/financials', label: 'Financials', icon: DollarSign, badge: null },
    { to: '/scenarios', label: 'Scenarios', icon: Sliders, badge: 'SIM' },
    { to: '/reports', label: 'Reports', icon: FileText, badge: null },
    { to: '/sensors', label: 'Sensors', icon: Radio, badge: null },
    { to: '/settings', label: 'Settings', icon: Settings, badge: null },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/40 z-30 lg:hidden backdrop-blur-xs"
        />
      )}

      <aside
        id="hydrasync-main-sidebar"
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top: Brand Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <NavLink
            to="/dashboard"
            className="flex items-center gap-2.5 group focus:outline-hidden"
          >
            <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-sky-600 to-blue-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
              <Droplets className="w-5 h-5 fill-white/20" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-slate-900">
                  HYDRASYNC
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-sky-100 text-sky-700 font-mono">
                  v2.4
                </span>
              </div>
              <span className="text-[11px] font-medium text-slate-400 block tracking-tight">
                Intelligent Water. Zero Waste.
              </span>
            </div>
          </NavLink>
        </div>

        {/* Center: Scrollable Navigation Links */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
            OPERATIONAL CONSOLE
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                id={`nav-${item.label.toLowerCase()}`}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-sky-50 text-sky-700 border border-sky-200/80 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`
                }
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full ${
                      item.badgeColor || 'bg-sky-100 text-sky-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Bottom Sidebar: System Status & User Profile */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/60 space-y-3">
          {/* Real-time System Status Card */}
          <div className="p-2.5 rounded-lg border border-slate-200 bg-white shadow-2xs text-xs font-mono">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-slate-400 text-[10px] uppercase font-bold">System Status</span>
              <span
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                  systemHealth === 'CRITICAL'
                    ? 'bg-rose-100 text-rose-700'
                    : systemHealth === 'WARNING'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                {systemHealth}
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-600">
              <span className="flex items-center gap-1.5">
                {connectionStatus === 'connected' ? (
                  <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <WifiOff className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                )}
                {connectionStatus === 'connected' ? 'Connected (5s)' : 'Connection Lost'}
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
          </div>

          {/* User Profile */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-sky-100 border border-sky-200 flex items-center justify-center text-sky-800 font-bold text-xs shrink-0">
                AM
              </div>
              <div className="truncate">
                <div className="text-xs font-bold text-slate-800 truncate">
                  {user?.name || 'Alex Mercer'}
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  {user?.email || 'demo@hydrasync.ai'}
                </div>
              </div>
            </div>
            <button
              id="sidebar-logout-btn"
              onClick={handleLogout}
              title="Sign Out"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
