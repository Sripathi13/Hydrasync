export interface NetworkSection {
  id: string;
  name: string;
  code: 'A' | 'B' | 'C' | 'D';
  status: 'normal' | 'warning' | 'critical' | 'offline';
  pressure: number; // bar
  expectedPressure: number; // bar
  flow: number; // m3/h
  expectedFlow: number; // m3/h
  temperature: number; // °C
  leakProbability: number; // 0 - 100%
  leakRate: number; // m3/h
  anomalyScore: number; // 0 - 100
  sensorsCount: number;
  activeSensors: number;
  valvesOpen: number;
  valvesTotal: number;
  productionZone: string;
  recommendedAction: string;
  lastUpdated: string;
}

export interface SensorItem {
  id: string;
  name?: string;
  type: 'Flow' | 'Pressure' | 'Temperature' | 'Acoustic' | 'Quality' | 'flow' | 'pressure' | 'temperature' | 'acoustic' | 'valve' | string;
  section: 'A' | 'B' | 'C' | 'D' | 'Main' | 'Pump' | 'Reservoir' | string;
  currentReading?: number;
  currentValue?: number;
  unit: string;
  status: 'normal' | 'warning' | 'critical' | 'offline' | 'online';
  battery?: number; // %
  batteryLevel?: number; // %
  signal?: number; // dBm or %
  signalStrength?: number; // dBm
  lastCommunication?: string;
  installationDate?: string;
  lastCalibration?: string;
  firmware?: string;
}

export interface AlertItem {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  section: 'A' | 'B' | 'C' | 'D' | 'Main';
  timestamp: string;
  status: 'active' | 'resolved';
  flowDeviation: number; // m3/h
  flowDeviationPercent: number; // %
  pressureDrop: number; // bar
  leakRate: number; // m3/h
  estimatedLoss: number; // $/hr
  explanation: string;
  recommendedAction: string;
  resolvedAt?: string;
  resolvedBy?: string;
}

export interface TelemetryReading {
  timestamp: string;
  flow: number;
  expectedFlow: number;
  flowDeviation: number;
  pressureA: number;
  pressureB: number;
  pressureC: number;
  pressureD: number;
  pumpPressure: number;
  reservoirLevel: number;
  temperature: number;
  productionDemand: number;
  solarKW: number;
  gridKW: number;
  batteryKW: number;
  anomalyScore: number;
  leakRate: number;
  systemHealth: 'NORMAL' | 'WARNING' | 'CRITICAL';
}

export interface ScenarioDefinition {
  id: string;
  name: string;
  category: string;
  description: string;
  expectedEffect: string;
  isApplied: boolean;
  targetSection?: string;
  severity?: 'critical' | 'warning' | 'info' | string;
  flowDelta?: number;
  pressureDelta?: number;
  anomalyPattern?: string;
  activeConfig?: {
    flowMultiplier?: number;
    sectionBPressureDelta?: number;
    sectionAPressureDelta?: number;
    leakRateB?: number;
    coolingDemandDelta?: number;
    sensorOffline?: string[];
  };
}

export type SimulationScenario = ScenarioDefinition;

export interface FinancialStats {
  waterLostPerHour: number;
  waterLostPerDay: number;
  waterLostPerMonth: number;
  waterLostPerYear: number;
  hourlyCost: number;
  dailyCost: number;
  monthlyCost: number;
  annualizedCost: number;
  potentialAvoidableLoss: number;
  estimatedInterventionImpact: number;
  waterCostPerUnit: number;
  currency: string;
  unit: string;
}

export interface SystemSettings {
  facilityName: string;
  facilityLocation: string;
  operatorName?: string;
  operatorOnDuty?: string;
  waterCostPerUnit: number; // $/m3
  energyCostPerUnit?: number; // $/m3
  currency?: string;
  flowThresholdPercent?: number; // %
  warningThresholdDeviation?: number;
  criticalThresholdDeviation?: number;
  baselineFlow?: number;
  targetPressure?: number;
  leakSensitivity?: number;
  pressureMinThreshold?: number; // bar
  pressureMaxThreshold?: number; // bar
  pressureDropThreshold?: number;
  anomalyThreshold?: number; // 0-100
  sensorUpdateIntervalSeconds?: number; // default 5s
  simulationInterval?: number;
  notificationEmail?: boolean;
  notificationSMS?: boolean;
  audioAlerts?: boolean;
  theme?: 'light';
  demoMode?: boolean;
}

export interface GeneratedReport {
  id: string;
  title: string;
  type: string;
  facility: string;
  author: string;
  generatedAt: string;
  dateRange: string;
  format: 'pdf' | 'csv' | 'json';
  summary: string;
  metrics: {
    totalWaterDelivered: number;
    totalWaterLost: number;
    financialLossTotal: number;
    efficiencyIndex: number;
  };
  sections: Array<{
    id: string;
    code: string;
    name: string;
    pressure: number;
    leakRate: number;
    status: string;
  }>;
  recommendations: string[];
}
