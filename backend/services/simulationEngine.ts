import {
  NetworkSection,
  SensorItem,
  AlertItem,
  TelemetryReading,
  ScenarioDefinition,
  FinancialStats,
  SystemSettings,
} from '../../src/types/hydrasync.ts';
import {
  INITIAL_SETTINGS,
  INITIAL_SECTIONS,
  INITIAL_SENSORS,
  INITIAL_ALERTS,
  INITIAL_SCENARIOS,
  generateInitialHistory,
} from '../data/initialData.ts';
import { evaluateAnomalies, AnomalyEvaluation } from './anomalyEngine.ts';
import { calculateFinancialImpact } from './financialEngine.ts';

type Broadcaster = (event: string, payload: any) => void;

class SimulationEngine {
  private settings: SystemSettings;
  private sections: NetworkSection[];
  private sensors: SensorItem[];
  private alerts: AlertItem[];
  private scenarios: ScenarioDefinition[];
  private activeScenarioId: string = 'normal';
  private history: TelemetryReading[];
  private timer: NodeJS.Timeout | null = null;
  private broadcaster: Broadcaster | null = null;
  private tickCount: number = 0;

  constructor() {
    this.settings = JSON.parse(JSON.stringify(INITIAL_SETTINGS));
    this.sections = JSON.parse(JSON.stringify(INITIAL_SECTIONS));
    this.sensors = JSON.parse(JSON.stringify(INITIAL_SENSORS));
    this.alerts = JSON.parse(JSON.stringify(INITIAL_ALERTS));
    this.scenarios = JSON.parse(JSON.stringify(INITIAL_SCENARIOS));
    this.history = generateInitialHistory(40);
  }

  public setBroadcaster(fn: Broadcaster) {
    this.broadcaster = fn;
  }

  public start() {
    if (this.timer) return;
    const intervalMs = (this.settings.sensorUpdateIntervalSeconds || 5) * 1000;
    this.timer = setInterval(() => this.tick(), intervalMs);
  }

  public stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  public tick() {
    this.tickCount++;
    const now = new Date();
    const timeStr = now.toLocaleTimeString();

    // Base target flow
    let baseFlow = 530;
    let expectedFlow = 530;
    let secBPressureTarget = 3.9;
    let secAPressureTarget = 5.2;
    let secCPressureTarget = 4.6;
    let secDPressureTarget = 4.1;
    let leakRate = 3.8;

    const activeScenario = this.scenarios.find((s) => s.id === this.activeScenarioId && s.isApplied);

    if (activeScenario) {
      if (activeScenario.id === 'pipe-burst-b') {
        baseFlow = 530 * 1.35; // surge
        secBPressureTarget = 2.1; // major drop
        leakRate = 16.5;
      } else if (activeScenario.id === 'valve-partially-closed') {
        baseFlow = 530 * 0.82;
        secAPressureTarget = 6.8;
        leakRate = 0.5;
      } else if (activeScenario.id === 'cooling-tower-shutdown') {
        baseFlow = 530 - 80;
        secCPressureTarget = 5.1;
        leakRate = 0.2;
      } else if (activeScenario.id === 'production-increase') {
        baseFlow = 530 * 1.5;
        expectedFlow = 530 * 1.5;
        leakRate = 1.2;
      } else if (activeScenario.id === 'production-decrease') {
        baseFlow = 530 * 0.6;
        expectedFlow = 530 * 0.6;
        leakRate = 0.5;
      } else if (activeScenario.id === 'normal') {
        baseFlow = 530;
        secBPressureTarget = 4.8;
        leakRate = 0.2;
      }
    }

    // Add realistic subtle industrial jitter
    const flowJitter = (Math.random() * 4 - 2);
    const currentFlow = Number((baseFlow + flowJitter).toFixed(1));

    // Update section pressures & flows
    this.sections = this.sections.map((sec) => {
      let pressure = sec.pressure;
      let status = sec.status;
      let leakProb = sec.leakProbability;
      let secLeakRate = sec.leakRate;
      let flow = sec.flow;

      if (sec.code === 'A') {
        pressure = Number((secAPressureTarget + (Math.random() * 0.1 - 0.05)).toFixed(2));
        flow = Number((140 * (currentFlow / 530) + (Math.random() * 1.5 - 0.75)).toFixed(1));
        status = activeScenario?.id === 'valve-partially-closed' ? 'warning' : 'normal';
        leakProb = status === 'warning' ? 14.5 : 3.8;
      } else if (sec.code === 'B') {
        pressure = Number((secBPressureTarget + (Math.random() * 0.15 - 0.07)).toFixed(2));
        flow = Number((165 * (currentFlow / 530) + (Math.random() * 2 - 1)).toFixed(1));
        if (activeScenario?.id === 'pipe-burst-b') {
          status = 'critical';
          leakProb = 96.8;
          secLeakRate = 16.5;
        } else if (activeScenario?.id === 'normal') {
          status = 'normal';
          leakProb = 4.5;
          secLeakRate = 0.2;
        } else {
          status = 'warning';
          leakProb = 48.7;
          secLeakRate = 3.8;
        }
      } else if (sec.code === 'C') {
        pressure = Number((secCPressureTarget + (Math.random() * 0.08 - 0.04)).toFixed(2));
        flow = activeScenario?.id === 'cooling-tower-shutdown' ? 12.4 : Number((95 * (currentFlow / 530)).toFixed(1));
        status = activeScenario?.id === 'cooling-tower-shutdown' ? 'warning' : 'normal';
      } else if (sec.code === 'D') {
        pressure = Number((secDPressureTarget + (Math.random() * 0.08 - 0.04)).toFixed(2));
        flow = Number((110 * (currentFlow / 530)).toFixed(1));
        status = activeScenario?.id === 'sensor-failure' ? 'warning' : 'normal';
      }

      return {
        ...sec,
        pressure,
        flow,
        status,
        leakProbability: leakProb,
        leakRate: secLeakRate,
        lastUpdated: timeStr,
      };
    });

    // Run Anomaly Evaluation
    const anomaly = evaluateAnomalies(
      currentFlow,
      expectedFlow,
      this.sections,
      this.settings.anomalyThreshold
    );

    // Update section anomaly scores
    this.sections = this.sections.map((sec) => {
      if (sec.code === anomaly.affectedSection) {
        return {
          ...sec,
          anomalyScore: anomaly.anomalyScore,
          recommendedAction: anomaly.recommendedAction,
        };
      }
      return {
        ...sec,
        anomalyScore: Math.min(25, Math.round(sec.leakProbability * 0.5)),
      };
    });

    // Handle automated alert generation for pipe burst
    if (activeScenario?.id === 'pipe-burst-b') {
      const hasCriticalAlert = this.alerts.some(
        (a) => a.severity === 'critical' && a.section === 'B' && a.status === 'active'
      );
      if (!hasCriticalAlert) {
        const newAlert: AlertItem = {
          id: `ALT-CRIT-${Math.floor(1000 + Math.random() * 9000)}`,
          severity: 'critical',
          title: 'CRITICAL PIPE BURST: Catastrophic Rupture in Section B Manifold',
          section: 'B',
          timestamp: timeStr,
          status: 'active',
          flowDeviation: Number((currentFlow - expectedFlow).toFixed(1)),
          flowDeviationPercent: anomaly.flowDeviationPercent,
          pressureDrop: 2.7,
          leakRate: 16.5,
          estimatedLoss: Number((16.5 * this.settings.waterCostPerUnit).toFixed(2)),
          explanation:
            'Rapid structural breach detected in Section B header pipeline. Severe hydraulic depression to 2.1 bar with volumetric flow anomaly exceeding +35%. High risk of facility flooding and structural damage.',
          recommendedAction:
            'TRIGGER EMERGENCY SHUTDOWN OF MAIN PUMP P-01. Close automated isolation gate valve ISO-B01 immediately. Evacuate Sub-Level 2 trench zone.',
        };
        this.alerts.unshift(newAlert);
        if (this.broadcaster) {
          this.broadcaster('alert:new', newAlert);
        }
      }
    }

    // Update Sensors
    this.sensors = this.sensors.map((sensor) => {
      let reading = sensor.currentReading ?? sensor.currentValue ?? 0;
      let status = sensor.status;

      if (activeScenario?.id === 'sensor-failure' && activeScenario.activeConfig?.sensorOffline?.includes(sensor.id)) {
        return {
          ...sensor,
          status: 'offline',
          signal: 0,
          lastCommunication: 'Offline (Comm Timeout)',
        };
      }

      if (sensor.id === 'FLOW-MAIN01') reading = currentFlow;
      else if (sensor.id === 'FLOW-A01') reading = this.sections.find((s) => s.code === 'A')?.flow || reading;
      else if (sensor.id === 'FLOW-B01') reading = this.sections.find((s) => s.code === 'B')?.flow || reading;
      else if (sensor.id === 'FLOW-C01') reading = this.sections.find((s) => s.code === 'C')?.flow || reading;
      else if (sensor.id === 'PRESS-A01') reading = this.sections.find((s) => s.code === 'A')?.pressure || reading;
      else if (sensor.id === 'PRESS-B01') {
        reading = this.sections.find((s) => s.code === 'B')?.pressure || reading;
        status = activeScenario?.id === 'pipe-burst-b' ? 'critical' : activeScenario?.id === 'normal' ? 'normal' : 'warning';
      } else if (sensor.id === 'PRESS-C01') reading = this.sections.find((s) => s.code === 'C')?.pressure || reading;
      else if (sensor.id === 'PRESS-D01') reading = this.sections.find((s) => s.code === 'D')?.pressure || reading;

      return {
        ...sensor,
        currentReading: Number(reading.toFixed(1)),
        status,
        lastCommunication: '1s ago',
      };
    });

    // Telemetry reading point
    const latestReading: TelemetryReading = {
      timestamp: timeStr,
      flow: currentFlow,
      expectedFlow,
      flowDeviation: anomaly.flowDeviation,
      pressureA: this.sections.find((s) => s.code === 'A')?.pressure || 5.2,
      pressureB: this.sections.find((s) => s.code === 'B')?.pressure || 3.9,
      pressureC: this.sections.find((s) => s.code === 'C')?.pressure || 4.6,
      pressureD: this.sections.find((s) => s.code === 'D')?.pressure || 4.1,
      pumpPressure: Number((6.3 + (Math.random() * 0.1 - 0.05)).toFixed(2)),
      reservoirLevel: Number((84.2 - (this.tickCount * 0.02) % 10).toFixed(1)),
      temperature: Number((19.2 + Math.sin(this.tickCount / 10) * 0.5).toFixed(1)),
      productionDemand: Number((85 + Math.cos(this.tickCount / 8) * 5).toFixed(1)),
      solarKW: Number((165 + Math.sin(this.tickCount / 20) * 20).toFixed(1)),
      gridKW: Number((285 - Math.sin(this.tickCount / 20) * 15).toFixed(1)),
      batteryKW: 45.0,
      anomalyScore: anomaly.anomalyScore,
      leakRate: anomaly.estimatedLeakRate,
      systemHealth: anomaly.severity,
    };

    // Keep history rolling
    this.history.push(latestReading);
    if (this.history.length > 60) {
      this.history.shift();
    }

    // Broadcast WebSocket updates
    if (this.broadcaster) {
      this.broadcaster('water:update', {
        reading: latestReading,
        anomaly,
        sections: this.sections,
      });
      this.broadcaster('sensor:update', this.sensors);
      this.broadcaster('system:status', {
        health: anomaly.severity,
        timestamp: timeStr,
        activeAlertsCount: this.alerts.filter((a) => a.status === 'active').length,
      });
    }
  }

  // --- API Getters & Mutation Methods ---

  public getCurrentTelemetry() {
    const latest = this.history[this.history.length - 1];
    const anomaly = evaluateAnomalies(
      latest.flow,
      latest.expectedFlow,
      this.sections,
      this.settings.anomalyThreshold
    );
    const activeLeakRate = this.sections.reduce((sum, s) => sum + (s.status === 'critical' || s.status === 'warning' ? s.leakRate : 0), 0);
    const financials = calculateFinancialImpact(activeLeakRate, this.settings.waterCostPerUnit);

    return {
      currentReading: latest,
      anomaly,
      sections: this.sections,
      financials,
      systemHealth: latest.systemHealth,
      lastUpdated: latest.timestamp,
    };
  }

  public getHistory() {
    return this.history;
  }

  public getNetwork() {
    return {
      sections: this.sections,
      pumps: [
        { id: 'PUMP-01', name: 'Primary Variable Frequency Pump', status: 'normal', rpm: 1780, powerKW: 48.5, headBar: 6.4 },
        { id: 'PUMP-02', name: 'Standby Booster Pump', status: 'standby', rpm: 0, powerKW: 0, headBar: 0 },
      ],
      reservoir: {
        id: 'RES-01',
        name: 'Apex Main Storage Reservoir',
        capacityM3: 25000,
        currentM3: 21050,
        fillPercent: 84.2,
        inflowM3H: 545.0,
      },
      valves: [
        { id: 'V-A01', section: 'A', status: 'open', travelPercent: 100 },
        { id: 'V-B01', section: 'B', status: 'open', travelPercent: 100 },
        { id: 'V-B02', section: 'B', status: 'throttled', travelPercent: 70 },
        { id: 'V-C01', section: 'C', status: 'open', travelPercent: 100 },
        { id: 'V-D01', section: 'D', status: 'open', travelPercent: 100 },
      ],
    };
  }

  public updateSection(id: string, updates: Partial<NetworkSection>): NetworkSection {
    const idx = this.sections.findIndex((s) => s.id === id || s.code === id);
    if (idx === -1) {
      throw new Error(`Section ${id} not found`);
    }
    this.sections[idx] = { ...this.sections[idx], ...updates };
    if (this.broadcaster) {
      this.broadcaster('network:sectionUpdated', this.sections[idx]);
    }
    return this.sections[idx];
  }

  public getSensors(): SensorItem[] {
    return this.sensors;
  }

  public addSensor(sensorData: Partial<SensorItem>): SensorItem {
    const newSensor: SensorItem = {
      id: sensorData.id || `SENS-${Date.now().toString().slice(-4)}`,
      type: sensorData.type || 'Pressure',
      section: sensorData.section || 'A',
      currentReading: sensorData.currentReading || 4.5,
      unit: sensorData.unit || (sensorData.type === 'Flow' ? 'm³/h' : sensorData.type === 'Temperature' ? '°C' : 'bar'),
      status: 'normal',
      battery: 100,
      signal: 95,
      lastCommunication: 'Just now',
      installationDate: new Date().toISOString().split('T')[0],
      firmware: 'v2.6.0-ind',
    };
    this.sensors.push(newSensor);
    if (this.broadcaster) {
      this.broadcaster('sensor:update', this.sensors);
    }
    return newSensor;
  }

  public updateSensor(id: string, updates: Partial<SensorItem>): SensorItem | null {
    const idx = this.sensors.findIndex((s) => s.id === id);
    if (idx === -1) return null;
    this.sensors[idx] = { ...this.sensors[idx], ...updates };
    if (this.broadcaster) {
      this.broadcaster('sensor:update', this.sensors);
    }
    return this.sensors[idx];
  }

  public deleteSensor(id: string): boolean {
    const initialLen = this.sensors.length;
    this.sensors = this.sensors.filter((s) => s.id !== id);
    if (this.sensors.length !== initialLen) {
      if (this.broadcaster) {
        this.broadcaster('sensor:update', this.sensors);
      }
      return true;
    }
    return false;
  }

  public getAlerts(): AlertItem[] {
    return this.alerts;
  }

  public dismissAlert(id: string): boolean {
    const alert = this.alerts.find((a) => a.id === id);
    if (alert) {
      this.alerts = this.alerts.filter((a) => a.id !== id);
      if (this.broadcaster) {
        this.broadcaster('alert:dismissed', { id });
      }
      return true;
    }
    return false;
  }

  public resolveAlert(id: string, resolvedBy: string = 'Alex Mercer'): AlertItem | null {
    const alert = this.alerts.find((a) => a.id === id);
    if (alert) {
      alert.status = 'resolved';
      alert.resolvedAt = new Date().toLocaleTimeString();
      alert.resolvedBy = resolvedBy;
      if (this.broadcaster) {
        this.broadcaster('alert:dismissed', { id, resolved: true, alert });
      }
      return alert;
    }
    return null;
  }

  public getScenarios(): ScenarioDefinition[] {
    return this.scenarios;
  }

  public applyScenario(id: string): ScenarioDefinition | null {
    this.scenarios = this.scenarios.map((s) => ({
      ...s,
      isApplied: s.id === id,
    }));
    this.activeScenarioId = id;

    // Immediately trigger tick so dashboard and network reflect scenario state without waiting 5s!
    this.tick();

    if (this.broadcaster) {
      this.broadcaster('scenario:update', {
        activeScenarioId: id,
        scenarios: this.scenarios,
      });
    }

    return this.scenarios.find((s) => s.id === id) || null;
  }

  public resetScenario(): ScenarioDefinition | null {
    return this.applyScenario('normal');
  }

  public getFinancials(): FinancialStats {
    const activeLeakRate = this.sections.reduce(
      (sum, s) => sum + (s.status === 'critical' || s.status === 'warning' ? s.leakRate : 0),
      0
    );
    return calculateFinancialImpact(activeLeakRate, this.settings.waterCostPerUnit);
  }

  public getAnalytics(range: string = '24h') {
    // Generate realistic analytical series for 24h, 7d, 30d
    const points = range === '30d' ? 30 : range === '7d' ? 28 : 24;
    const series = [];
    const now = Date.now();
    const stepMs = range === '30d' ? 86400000 : range === '7d' ? 21600000 : 3600000;

    for (let i = points - 1; i >= 0; i--) {
      const date = new Date(now - i * stepMs);
      const label = range === '24h'
        ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : date.toLocaleDateString([], { month: 'short', day: 'numeric' });

      series.push({
        timestamp: label,
        totalConsumption: Number((12400 + Math.sin(i / 3) * 1200 + Math.random() * 400).toFixed(0)),
        averageFlow: Number((525 + Math.sin(i / 4) * 25 + Math.random() * 8).toFixed(1)),
        expectedFlow: 520,
        pressureAvg: Number((4.5 + Math.cos(i / 5) * 0.3).toFixed(2)),
        temperatureAvg: Number((19.1 + Math.sin(i / 6) * 1.2).toFixed(1)),
        anomalyScore: i > points - 6 ? (this.activeScenarioId === 'pipe-burst-b' ? 88 : 58) : Math.floor(15 + Math.random() * 15),
        leakFrequency: i % 4 === 0 ? 1 : 0,
        waterEfficiency: Number((94.2 - (i > points - 6 ? 4.8 : 0) + Math.random() * 0.8).toFixed(1)),
      });
    }

    return {
      timeRange: range,
      series,
      kpis: {
        totalVolumeM3: range === '30d' ? 382400 : range === '7d' ? 89400 : 12640,
        averageDailyLossM3: (this.getFinancials().waterLostPerDay).toFixed(1),
        overallEfficiencyPercent: 93.8,
        anomaliesDetectedCount: this.activeScenarioId === 'pipe-burst-b' ? 9 : 3,
        unaccountedWaterPercent: 4.2,
      },
      sectionComparison: [
        { section: 'Section A', flowShare: 26.5, leakProbability: 4.2, healthScore: 98 },
        { section: 'Section B', flowShare: 35.2, leakProbability: this.activeScenarioId === 'pipe-burst-b' ? 96.8 : 48.7, healthScore: this.activeScenarioId === 'pipe-burst-b' ? 24 : 64 },
        { section: 'Section C', flowShare: 18.0, leakProbability: 6.1, healthScore: 95 },
        { section: 'Section D', flowShare: 20.3, leakProbability: 8.5, healthScore: 94 },
      ],
    };
  }

  public getSettings(): SystemSettings {
    return this.settings;
  }

  public updateSettings(newSettings: Partial<SystemSettings>): SystemSettings {
    this.settings = { ...this.settings, ...newSettings };
    if (newSettings.sensorUpdateIntervalSeconds && newSettings.sensorUpdateIntervalSeconds > 0) {
      this.stop();
      this.start();
    }
    return this.settings;
  }

  public resetSettings(): SystemSettings {
    this.settings = JSON.parse(JSON.stringify(INITIAL_SETTINGS));
    this.stop();
    this.start();
    return this.settings;
  }
}

export const simulationEngine = new SimulationEngine();
simulationEngine.start();
