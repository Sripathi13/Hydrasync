import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Bell,
  Building2,
  ChevronDown,
  LogOut,
  Menu,
  Moon,
  Radio,
  RefreshCw,
  Sun,
  User,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { useHydrasync } from '../context/HydrasyncContext.tsx';

interface HeaderProps {
  onToggleMobileSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileSidebar }) => {
  const { user, connectionStatus, lastUpdated, alerts, refreshData, logout, systemHealth } = useHydrasync();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigate = useNavigate();

  const activeAlerts = alerts.filter((a) => a.status === 'active');

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await refreshData();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header
      id="hydrasync-global-header"
      className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 lg:px-8 flex items-center justify-between transition-colors"
    >
      {/* Left: Mobile Trigger & Facility Badge */}
      <div className="flex items-center gap-3">
        <button
          id="mobile-sidebar-toggle-btn"
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-hidden"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex p-1.5 rounded-lg bg-sky-50 text-sky-700 border border-sky-100">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-900 tracking-tight">
                {user?.facility || 'HydraSync Metro Apex Plant 04'}
              </span>
              <span className="hidden md:inline-block text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200">
                SCADA NODE 7
              </span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono hidden sm:block">
              Sector 7 Distribution Hub • Primary Pressure Zone
            </div>
          </div>
        </div>
      </div>

      {/* Right: Live Telemetry Indicator, Notifications, Theme, User Menu */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Live Telemetry Pulse & Last Updated */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-xs font-mono">
          <span className="relative flex h-2 w-2">
            {connectionStatus === 'connected' && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            )}
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                connectionStatus === 'connected' ? 'bg-emerald-500' : 'bg-rose-500'
              }`}
            />
          </span>
          <span className="hidden sm:inline font-bold text-slate-700">
            {connectionStatus === 'connected' ? 'LIVE' : 'CONNECTION LOST'}
          </span>
          <span className="text-slate-400 text-[11px] hidden md:inline">
            Sync: <strong className="text-slate-700">{lastUpdated}</strong>
          </span>
          <button
            id="header-manual-sync-btn"
            onClick={handleManualRefresh}
            title="Force Telemetry Sync"
            className={`text-slate-400 hover:text-sky-600 ml-1 transition-transform ${
              isRefreshing ? 'animate-spin text-sky-600' : ''
            }`}
          >
            <RefreshCw className="w-3 h-3" />
          </button>
        </div>

        {/* Theme Indicator (Clean Light Blue & White Theme) */}
        <div className="hidden lg:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-50/70 border border-sky-100 text-sky-700 text-xs font-semibold">
          <Sun className="w-3.5 h-3.5 text-amber-500" />
          <span>Industrial Light</span>
        </div>

        {/* Notification Bell Dropdown */}
        <div className="relative">
          <button
            id="notifications-toggle-btn"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {activeAlerts.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white animate-pulse" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 p-4 z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900 uppercase">
                  <span>Incident Notifications</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-rose-100 text-rose-700 font-mono text-[10px]">
                    {activeAlerts.length}
                  </span>
                </div>
                <NavLink
                  to="/alerts"
                  onClick={() => setShowNotifications(false)}
                  className="text-xs text-sky-600 hover:underline font-medium"
                >
                  View All Alerts →
                </NavLink>
              </div>

              <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto my-2">
                {activeAlerts.length === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-400">
                    No active anomalies or critical warnings.
                  </div>
                ) : (
                  activeAlerts.slice(0, 4).map((a) => (
                    <div
                      key={a.id}
                      onClick={() => {
                        setShowNotifications(false);
                        navigate('/alerts');
                      }}
                      className="py-2.5 px-1 hover:bg-slate-50 cursor-pointer rounded-lg transition-colors"
                    >
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="font-bold text-rose-600 font-mono">{a.id}</span>
                        <span className="text-slate-400 font-mono">{a.timestamp}</span>
                      </div>
                      <div className="text-xs font-semibold text-slate-800 line-clamp-1">
                        {a.title}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                        Drop: {a.pressureDrop} bar • Loss: ${a.estimatedLoss}/hr
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Avatar & Menu */}
        <div className="relative">
          <button
            id="user-menu-toggle-btn"
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-sky-600 text-white font-bold text-xs flex items-center justify-center">
              AM
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50">
              <div className="px-3 py-2 border-b border-slate-100">
                <div className="text-xs font-bold text-slate-900">{user?.name || 'Alex Mercer'}</div>
                <div className="text-[11px] text-slate-500 truncate">{user?.email}</div>
                <div className="text-[10px] font-mono text-sky-600 font-semibold mt-0.5">
                  {user?.role || 'Lead SCADA Engineer'}
                </div>
              </div>
              <div className="py-1">
                <NavLink
                  to="/settings"
                  onClick={() => setShowUserMenu(false)}
                  className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-2"
                >
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  Account & Settings
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-lg flex items-center gap-2"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-500" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
