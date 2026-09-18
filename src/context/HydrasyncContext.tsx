import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  TelemetryReading,
  NetworkSection,
  SensorItem,
  AlertItem,
  ScenarioDefinition,
  FinancialStats,
  SystemSettings,
  GeneratedReport,
} from '../types/hydrasync.ts';
import { api } from '../services/api.ts';
import { getSocket, ConnectionState } from '../services/socket.ts';

interface UserProfile {
  email: string;
  name: string;
  role: string;
  facility: string;
}

interface ToastMessage {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
}

interface HydrasyncContextType {
  // Auth
  user: UserProfile | null;
  login: (email: string) => void;
  logout: () => void;

  // Real-time telemetry
  currentReading: TelemetryReading | null;
  anomaly: any | null;
  sections: NetworkSection[];
  financials: FinancialStats | null;
  systemHealth: 'NORMAL' | 'WARNING' | 'CRITICAL';
  lastUpdated: string;
  history: TelemetryReading[];
  connectionStatus: ConnectionState;

  // Data lists
  sensors: SensorItem[];
  alerts: AlertItem[];
  scenarios: ScenarioDefinition[];
  settings: SystemSettings | null;

  activeScenarioId: string | null;

  // Modals & Interactivity
  selectedSection: NetworkSection | null;
  setSelectedSection: (sec: NetworkSection | null) => void;
  selectedAlert: AlertItem | null;
  setSelectedAlert: (alert: AlertItem | null) => void;

  // Actions
  applyScenario: (scenarioId: string) => Promise<void>;
  resetScenario: () => Promise<void>;
  resolveAlert: (alertId: string) => Promise<void>;
  dismissAlert: (alertId: string) => Promise<void>;
  addSensor: (sensor: Partial<SensorItem>) => Promise<SensorItem>;
  registerSensor: (sensor: Partial<SensorItem>) => Promise<SensorItem>;
  updateSensor: (id: string, updates: Partial<SensorItem>) => Promise<SensorItem>;
  deleteSensor: (id: string) => Promise<void>;
  updateSectionValve: (sectionId: string, valvesOpen: number) => Promise<void>;
  generateReport: (params: any) => Promise<GeneratedReport>;
  updateSettings: (newSettings: Partial<SystemSettings>) => Promise<void>;
  resetSettings: () => Promise<void>;

  // Toasts
  toasts: ToastMessage[];
  removeToast: (id: string) => void;
  addToast: (type: ToastMessage['type'], title: string, message: string) => void;
  refreshData: () => Promise<void>;
}

const HydrasyncContext = createContext<HydrasyncContextType | null>(null);

const DEFAULT_USER: UserProfile = {
  email: 'demo@hydrasync.ai',
  name: 'Alex Mercer',
  role: 'Lead SCADA Engineer',
  facility: 'HydraSync Metro Apex Plant 04',
};

export const HydrasyncProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Auth state persisted in sessionStorage
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = sessionStorage.getItem('hydrasync_auth');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    // Default authenticated for instant demo readiness if already on sub-route, or default to demo account
    return DEFAULT_USER;
  });

  const [connectionStatus, setConnectionStatus] = useState<ConnectionState>('connected');
  const [currentReading, setCurrentReading] = useState<TelemetryReading | null>(null);
  const [anomaly, setAnomaly] = useState<any | null>(null);
  const [sections, setSections] = useState<NetworkSection[]>([]);
  const [financials, setFinancials] = useState<FinancialStats | null>(null);
  const [systemHealth, setSystemHealth] = useState<'NORMAL' | 'WARNING' | 'CRITICAL'>('NORMAL');
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toLocaleTimeString());
  const [history, setHistory] = useState<TelemetryReading[]>([]);
  const [sensors, setSensors] = useState<SensorItem[]>([]);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [scenarios, setScenarios] = useState<ScenarioDefinition[]>([]);
  const [settings, setSettings] = useState<SystemSettings | null>(null);

  // Selected for drill-down panels
  const [selectedSection, setSelectedSection] = useState<NetworkSection | null>(null);
  const [selectedAlert, setSelectedAlert] = useState<AlertItem | null>(null);

  // Toast stack
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((type: ToastMessage['type'], title: string, message: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const login = (email: string) => {
    const usr = { ...DEFAULT_USER, email: email || DEFAULT_USER.email };
    setUser(usr);
    sessionStorage.setItem('hydrasync_auth', JSON.stringify(usr));
    addToast('success', 'Authenticated', `Signed in as ${usr.name} (${usr.facility})`);
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('hydrasync_auth');
    addToast('info', 'Signed Out', 'Session terminated.');
  };

  // Initial Data Fetch
  const refreshData = useCallback(async () => {
    try {
      const [waterRes, historyRes, sensorsRes, alertsRes, scenariosRes, settingsRes] = await Promise.all([
        api.getCurrentWater(),
        api.getWaterHistory('1h'),
        api.getSensors(),
        api.getAlerts(),
        api.getScenarios(),
        api.getSettings(),
      ]);

      setCurrentReading(waterRes.currentReading);
      setAnomaly(waterRes.anomaly);
      setSections(waterRes.sections);
      setFinancials(waterRes.financials);
      setSystemHealth(waterRes.systemHealth);
      setLastUpdated(waterRes.lastUpdated);
      setHistory(historyRes.data || []);
      setSensors(sensorsRes);
      setAlerts(alertsRes);
      setScenarios(scenariosRes);
      setSettings(settingsRes);
    } catch (err: any) {
      console.error('[HydraSync Context] Failed to fetch initial state:', err);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // WebSocket Subscription
  useEffect(() => {
    const socket = getSocket((state) => {
      setConnectionStatus(state);
      if (state === 'connected') {
        addToast('info', 'LIVE — CONNECTED', 'WebSocket telemetry stream active (5s interval)');
      } else if (state === 'reconnecting' || state === 'disconnected') {
        addToast('warning', 'CONNECTION LOST', 'Attempting automatic reconnection to telemetry daemon...');
      }
    });

    socket.on('water:update', (payload: any) => {
      if (payload.reading) {
        setCurrentReading(payload.reading);
        setLastUpdated(payload.reading.timestamp);
        setHistory((prev) => {
          const next = [...prev, payload.reading];
          return next.slice(-60);
        });
      }
      if (payload.anomaly) {
        setAnomaly(payload.anomaly);
        setSystemHealth(payload.anomaly.severity);
      }
      if (payload.sections) {
        setSections(payload.sections);
        // If current modal is open, keep it in sync
        setSelectedSection((curr) => {
          if (!curr) return null;
          return payload.sections.find((s: NetworkSection) => s.id === curr.id) || curr;
        });
      }
    });

    socket.on('sensor:update', (updatedSensors: SensorItem[]) => {
      setSensors(updatedSensors);
    });

    socket.on('alert:new', (newAlert: AlertItem) => {
      setAlerts((prev) => [newAlert, ...prev.filter((a) => a.id !== newAlert.id)]);
      addToast(
        newAlert.severity === 'critical' ? 'error' : 'warning',
        `New Alert: ${newAlert.title}`,
        `${newAlert.section ? `Section ${newAlert.section} — ` : ''}${newAlert.explanation}`
      );
    });

    socket.on('alert:dismissed', (payload: any) => {
      if (payload.resolved && payload.alert) {
        setAlerts((prev) => prev.map((a) => (a.id === payload.alert.id ? payload.alert : a)));
      } else {
        setAlerts((prev) => prev.filter((a) => a.id !== payload.id));
      }
    });

    socket.on('scenario:update', (payload: any) => {
      if (payload.scenarios) {
        setScenarios(payload.scenarios);
      }
    });

    socket.on('system:status', (payload: any) => {
      if (payload.health) {
        setSystemHealth(payload.health);
      }
    });

    // Fallback polling every 5s if socket is disconnected
    const fallbackInterval = setInterval(() => {
      if (socket.disconnected) {
        api.getCurrentWater().then((res) => {
          setCurrentReading(res.currentReading);
          setAnomaly(res.anomaly);
          setSections(res.sections);
          setFinancials(res.financials);
          setSystemHealth(res.systemHealth);
          setLastUpdated(res.lastUpdated);
        }).catch(() => {});
      }
    }, 5000);

    return () => {
      clearInterval(fallbackInterval);
      socket.off('water:update');
      socket.off('sensor:update');
      socket.off('alert:new');
      socket.off('alert:dismissed');
      socket.off('scenario:update');
      socket.off('system:status');
    };
  }, [addToast]);

  // Scenario actions
  const applyScenario = async (scenarioId: string) => {
    try {
      const res = await api.applyScenario(scenarioId);
      if (res.success) {
        setScenarios((prev) =>
          prev.map((s) => ({
            ...s,
            isApplied: s.id === scenarioId,
          }))
        );
        addToast(
          scenarioId === 'pipe-burst-b' ? 'error' : 'info',
          'Scenario Applied',
          `Simulation activated: ${res.scenario.name}`
        );
        // Instant refresh
        const waterRes = await api.getCurrentWater();
        setCurrentReading(waterRes.currentReading);
        setAnomaly(waterRes.anomaly);
        setSections(waterRes.sections);
        setFinancials(waterRes.financials);
        setSystemHealth(waterRes.systemHealth);
        setAlerts(await api.getAlerts());
      }
    } catch (err: any) {
      addToast('error', 'Failed to Apply Scenario', err.message);
    }
  };

  const resetScenario = async () => {
    try {
      const res = await api.resetScenario();
      if (res.success) {
        setScenarios((prev) =>
          prev.map((s) => ({
            ...s,
            isApplied: s.id === 'normal',
          }))
        );
        addToast('success', 'Scenario Reset', 'Water network reverted to baseline NORMAL operation.');
        // Instant refresh
        const waterRes = await api.getCurrentWater();
        setCurrentReading(waterRes.currentReading);
        setAnomaly(waterRes.anomaly);
        setSections(waterRes.sections);
        setFinancials(waterRes.financials);
        setSystemHealth(waterRes.systemHealth);
        setAlerts(await api.getAlerts());
      }
    } catch (err: any) {
      addToast('error', 'Failed to Reset Scenario', err.message);
    }
  };

  // Alert actions
  const resolveAlert = async (alertId: string) => {
    try {
      const updated = await api.resolveAlert(alertId, user?.name || 'Alex Mercer');
      setAlerts((prev) => prev.map((a) => (a.id === alertId ? updated : a)));
      addToast('success', 'Incident Resolved', `Alert ${alertId} marked resolved by ${updated.resolvedBy}`);
    } catch (err: any) {
      addToast('error', 'Resolve Failed', err.message);
    }
  };

  const dismissAlert = async (alertId: string) => {
    try {
      await api.dismissAlert(alertId);
      setAlerts((prev) => prev.filter((a) => a.id !== alertId));
      addToast('info', 'Alert Dismissed', `Alert ${alertId} removed from active log.`);
    } catch (err: any) {
      addToast('error', 'Dismiss Failed', err.message);
    }
  };

  // Sensor actions
  const addSensor = async (sensor: Partial<SensorItem>) => {
    const created = await api.addSensor(sensor);
    setSensors((prev) => [...prev, created]);
    addToast('success', 'Sensor Added', `Transducer ${created.id} registered in Section ${created.section}`);
    return created;
  };

  const updateSensor = async (id: string, updates: Partial<SensorItem>) => {
    const updated = await api.updateSensor(id, updates);
    setSensors((prev) => prev.map((s) => (s.id === id ? updated : s)));
    addToast('success', 'Sensor Updated', `Configuration updated for ${id}`);
    return updated;
  };

  const deleteSensor = async (id: string) => {
    await api.deleteSensor(id);
    setSensors((prev) => prev.filter((s) => s.id !== id));
    addToast('info', 'Sensor Removed', `Transducer node ${id} deleted.`);
  };

  // Settings actions
  const updateSettings = async (newSettings: Partial<SystemSettings>) => {
    const updated = await api.updateSettings(newSettings);
    setSettings(updated);
    addToast('success', 'Settings Saved', 'Industrial thresholds and cost factors updated.');
    // Recompute financials with new water price
    const fin = await api.getFinancials();
    setFinancials(fin);
  };

  const activeScenario = scenarios.find((s) => s.isApplied && s.id !== 'normal');
  const activeScenarioId = activeScenario ? activeScenario.id : null;

  const updateSectionValve = async (sectionId: string, valvesOpen: number) => {
    try {
      await api.updateSection(sectionId, { valvesOpen });
      setSections((prev) =>
        prev.map((s) => (s.id === sectionId ? { ...s, valvesOpen } : s))
      );
      addToast('success', 'Valve Actuated', `Valves set to ${valvesOpen} for section ${sectionId}`);
    } catch (err: any) {
      addToast('error', 'Valve Actuation Failed', err.message);
    }
  };

  const registerSensor = async (sensor: Partial<SensorItem>) => {
    return addSensor(sensor);
  };

  const generateReport = async (params: any): Promise<GeneratedReport> => {
    const report = await api.generateReport(params);
    addToast('success', 'Report Generated', `Compliance report ${report.id} generated.`);
    return report;
  };

  const resetSettings = async () => {
    const reset = await api.resetSettings();
    setSettings(reset);
    addToast('info', 'Settings Reset', 'Restored default industrial operating parameters.');
    const fin = await api.getFinancials();
    setFinancials(fin);
  };

  return (
    <HydrasyncContext.Provider
      value={{
        user,
        login,
        logout,
        currentReading,
        anomaly,
        sections,
        financials,
        systemHealth,
        lastUpdated,
        history,
        connectionStatus,
        sensors,
        alerts,
        scenarios,
        settings,
        activeScenarioId,
        selectedSection,
        setSelectedSection,
        selectedAlert,
        setSelectedAlert,
        applyScenario,
        resetScenario,
        resolveAlert,
        dismissAlert,
        addSensor,
        registerSensor,
        updateSensor,
        deleteSensor,
        updateSectionValve,
        generateReport,
        updateSettings,
        resetSettings,
        toasts,
        removeToast,
        addToast,
        refreshData,
      }}
    >
      {children}
    </HydrasyncContext.Provider>
  );
};

export function useHydrasync() {
  const ctx = useContext(HydrasyncContext);
  if (!ctx) {
    throw new Error('useHydrasync must be used within a HydrasyncProvider');
  }
  return ctx;
}
