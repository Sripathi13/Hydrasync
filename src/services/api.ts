import {
  TelemetryReading,
  NetworkSection,
  SensorItem,
  AlertItem,
  ScenarioDefinition,
  FinancialStats,
  SystemSettings,
} from '../types/hydrasync.ts';
import { simulationEngine } from '../../backend/services/simulationEngine.ts';
import { generateReport, getSavedReports } from '../../backend/services/reportService.ts';

const BASE_URL = '/api';

async function fetchJSON<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.error || `HTTP error ${res.status}: ${res.statusText}`);
  }

  const contentType = res.headers.get('content-type');
  if (contentType && !contentType.includes('application/json')) {
    throw new Error(`Expected JSON but received ${contentType}`);
  }

  return res.json();
}

export const api = {
  // Telemetry & Water
  async getCurrentWater(): Promise<{
    currentReading: TelemetryReading;
    anomaly: any;
    sections: NetworkSection[];
    financials: FinancialStats;
    systemHealth: 'NORMAL' | 'WARNING' | 'CRITICAL';
    lastUpdated: string;
  }> {
    return fetchJSON<any>(`${BASE_URL}/water/current`).catch(() => {
      return simulationEngine.getCurrentTelemetry();
    });
  },

  async getWaterHistory(range: string = '1h'): Promise<{ range: string; points: number; data: TelemetryReading[] }> {
    return fetchJSON<any>(`${BASE_URL}/water/history?range=${range}`).catch(() => {
      const history = simulationEngine.getHistory();
      return { range, points: history.length, data: history };
    });
  },

  // Network
  async getNetwork(): Promise<{
    sections: NetworkSection[];
    pumps: any[];
    reservoir: any;
    valves: any[];
  }> {
    return fetchJSON<any>(`${BASE_URL}/network`).catch(() => {
      return simulationEngine.getNetwork();
    });
  },

  async updateSection(id: string, updates: Partial<NetworkSection>): Promise<NetworkSection> {
    return fetchJSON<NetworkSection>(`${BASE_URL}/network/sections/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }).catch(() => {
      return simulationEngine.updateSection(id, updates);
    });
  },

  // Sensors
  async getSensors(): Promise<SensorItem[]> {
    return fetchJSON<SensorItem[]>(`${BASE_URL}/sensors`).catch(() => {
      return simulationEngine.getSensors();
    });
  },

  async addSensor(sensor: Partial<SensorItem>): Promise<SensorItem> {
    return fetchJSON<SensorItem>(`${BASE_URL}/sensors`, {
      method: 'POST',
      body: JSON.stringify(sensor),
    }).catch(() => {
      return simulationEngine.addSensor(sensor as any);
    });
  },

  async updateSensor(id: string, updates: Partial<SensorItem>): Promise<SensorItem> {
    return fetchJSON<SensorItem>(`${BASE_URL}/sensors/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }).catch(() => {
      return simulationEngine.updateSensor(id, updates) || ({} as SensorItem);
    });
  },

  async deleteSensor(id: string): Promise<{ success: boolean; id: string }> {
    return fetchJSON<{ success: boolean; id: string }>(`${BASE_URL}/sensors/${id}`, {
      method: 'DELETE',
    }).catch(() => {
      simulationEngine.deleteSensor(id);
      return { success: true, id };
    });
  },

  // Alerts
  async getAlerts(): Promise<AlertItem[]> {
    return fetchJSON<AlertItem[]>(`${BASE_URL}/alerts`).catch(() => {
      return simulationEngine.getAlerts();
    });
  },

  async dismissAlert(id: string): Promise<{ success: boolean; id: string }> {
    return fetchJSON<{ success: boolean; id: string }>(`${BASE_URL}/alerts/${id}/dismiss`, {
      method: 'POST',
    }).catch(() => {
      simulationEngine.dismissAlert(id);
      return { success: true, id };
    });
  },

  async resolveAlert(id: string, resolvedBy?: string): Promise<AlertItem> {
    return fetchJSON<AlertItem>(`${BASE_URL}/alerts/${id}/resolve`, {
      method: 'POST',
      body: JSON.stringify({ resolvedBy: resolvedBy || 'Alex Mercer' }),
    }).catch(() => {
      return simulationEngine.resolveAlert(id, resolvedBy || 'Alex Mercer') || ({} as any);
    });
  },

  // Analytics
  async getAnalytics(range: string = '24h'): Promise<any> {
    return fetchJSON<any>(`${BASE_URL}/analytics?range=${range}`).catch(() => {
      return simulationEngine.getAnalytics(range);
    });
  },

  // Financials
  async getFinancials(): Promise<FinancialStats> {
    return fetchJSON<FinancialStats>(`${BASE_URL}/financials`).catch(() => {
      return simulationEngine.getFinancials();
    });
  },

  // Scenarios
  async getScenarios(): Promise<ScenarioDefinition[]> {
    return fetchJSON<ScenarioDefinition[]>(`${BASE_URL}/scenarios`).catch(() => {
      return simulationEngine.getScenarios();
    });
  },

  async applyScenario(scenarioId: string): Promise<{ success: boolean; scenario: ScenarioDefinition }> {
    return fetchJSON<{ success: boolean; scenario: ScenarioDefinition }>(`${BASE_URL}/scenarios/apply`, {
      method: 'POST',
      body: JSON.stringify({ scenarioId }),
    }).catch(() => {
      const scenario = simulationEngine.applyScenario(scenarioId);
      return { success: true, scenario: scenario! };
    });
  },

  async resetScenario(): Promise<{ success: boolean; scenario: ScenarioDefinition }> {
    return fetchJSON<{ success: boolean; scenario: ScenarioDefinition }>(`${BASE_URL}/scenarios/reset`, {
      method: 'POST',
    }).catch(() => {
      const scenario = simulationEngine.resetScenario();
      return { success: true, scenario: scenario! };
    });
  },

  // Reports
  async generateReport(type: string, dateRange?: { start: string; end: string }): Promise<any> {
    return fetchJSON<any>(`${BASE_URL}/reports/generate`, {
      method: 'POST',
      body: JSON.stringify({ type, dateRange }),
    }).catch(() => {
      return generateReport(type, dateRange);
    });
  },

  async getReports(): Promise<any[]> {
    return fetchJSON<any[]>(`${BASE_URL}/reports`).catch(() => {
      return getSavedReports();
    });
  },

  // Settings
  async getSettings(): Promise<SystemSettings> {
    return fetchJSON<SystemSettings>(`${BASE_URL}/settings`).catch(() => {
      return simulationEngine.getSettings();
    });
  },

  async updateSettings(settings: Partial<SystemSettings>): Promise<SystemSettings> {
    return fetchJSON<SystemSettings>(`${BASE_URL}/settings`, {
      method: 'PUT',
      body: JSON.stringify(settings),
    }).catch(() => {
      return simulationEngine.updateSettings(settings);
    });
  },
  async resetSettings(): Promise<SystemSettings> {
    return fetchJSON<SystemSettings>(`${BASE_URL}/settings/reset`, {
      method: 'POST',
    }).catch(() => {
      return simulationEngine.updateSettings({});
    });
  },
};
