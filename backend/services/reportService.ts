import { simulationEngine } from './simulationEngine.ts';

export interface GeneratedReport {
  id: string;
  type: string;
  title: string;
  generatedAt: string;
  dateRange: { start: string; end: string };
  facility: string;
  executiveSummary: string;
  metrics: Record<string, any>;
  tableData: Array<Record<string, any>>;
  recommendations: string[];
}

const savedReports: GeneratedReport[] = [];

export function generateReport(type: string, dateRange?: { start: string; end: string }): GeneratedReport {
  const now = new Date();
  const range = dateRange || {
    start: new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0],
    end: now.toISOString().split('T')[0],
  };

  const current = simulationEngine.getCurrentTelemetry();
  const financials = current.financials;
  const sections = current.sections;
  const sensors = simulationEngine.getSensors();
  const alerts = simulationEngine.getAlerts();

  let title = 'HydraSync Operational Report';
  let summary = '';
  let metrics: Record<string, any> = {};
  let tableData: Array<Record<string, any>> = [];
  let recommendations: string[] = [];

  switch (type) {
    case 'Daily Water Report':
      title = `Daily Volumetric & Distribution Audit — ${range.end}`;
      summary = `Aggregate 24-hour water throughput totaled ${((current.currentReading.flow * 24)).toFixed(0)} m³. Mean delivery flow remained within nominal industrial tolerance, with primary variance isolated to Section B distribution lines.`;
      metrics = {
        'Total Flow Delivered': `${((current.currentReading.flow * 24)).toFixed(0)} m³`,
        'Peak Flow Recorded': `${(current.currentReading.flow * 1.15).toFixed(1)} m³/h`,
        'Base Expected Flow': '530.0 m³/h',
        'Distribution Efficiency': `${(94.5).toFixed(1)}%`,
        'Reservoir Inflow Rate': '545.0 m³/h',
      };
      tableData = sections.map((s) => ({
        Section: s.name,
        'Mean Pressure (bar)': s.pressure,
        'Active Flow (m³/h)': s.flow,
        'Leak Probability': `${s.leakProbability}%`,
        Status: s.status.toUpperCase(),
      }));
      recommendations = [
        'Continue acoustic surveillance on Section B header manifold.',
        'Calibrate flow meter FLOW-MAIN01 at the upcoming bi-weekly maintenance window.',
        'Maintain baseline pump speed at 1,780 RPM to sustain minimal cavitation index.',
      ];
      break;

    case 'Leak Incident Report':
      title = `Subsurface Anomaly & Acoustic Leak Assessment`;
      summary = `Autonomous anomaly detection engine evaluated ${alerts.length} total event logs. Section B demonstrates persistent micro-acoustic signatures with estimated leak discharge of ${current.currentReading.leakRate} m³/h.`;
      metrics = {
        'Active Incident Count': alerts.filter((a) => a.status === 'active').length,
        'Resolved Incident Count': alerts.filter((a) => a.status === 'resolved').length,
        'Current Leak Discharge Rate': `${current.currentReading.leakRate} m³/h`,
        'Localized Vulnerable Zone': current.anomaly.affectedSection !== 'None' ? `Section ${current.anomaly.affectedSection}` : 'None',
        'AI/ML Confidence Score': `${current.anomaly.anomalyScore}/100`,
      };
      tableData = alerts.map((a) => ({
        'Alert ID': a.id,
        Severity: a.severity.toUpperCase(),
        Title: a.title,
        Section: a.section,
        'Flow Deviation': `${a.flowDeviation} m³/h`,
        'Pressure Drop': `${a.pressureDrop} bar`,
        'Loss ($/hr)': `$${a.estimatedLoss}`,
        Status: a.status.toUpperCase(),
      }));
      recommendations = [
        'Deploy ultrasonic acoustic pipe clamp to isolate exact linear coordinate on Section B.',
        'Excavate inspection trench near Valve V-B02 if acoustic decibel reading persists above 70 dBμV.',
        'Pre-stage replacement composite clamp sleeve for rapid bolt-on remediation.',
      ];
      break;

    case 'Financial Impact Report':
      title = `Industrial Water Loss & Fiscal Exposure Analysis`;
      summary = `At the benchmark industrial tariff of $${financials.waterCostPerUnit}/m³, current hydraulic loss imposes an annualized financial exposure of $${financials.annualizedCost.toLocaleString()}. Targeted engineering intervention can recover up to $${financials.potentialAvoidableLoss.toLocaleString()} annually.`;
      metrics = {
        'Unit Tariff': `$${financials.waterCostPerUnit} / m³`,
        'Daily Water Loss': `${financials.waterLostPerDay} m³`,
        'Daily Financial Burden': `$${financials.dailyCost}`,
        'Monthly Financial Exposure': `$${financials.monthlyCost}`,
        'Projected Annual Loss': `$${financials.annualizedCost.toLocaleString()}`,
        'Recoverable Avoidable Loss': `$${financials.potentialAvoidableLoss.toLocaleString()}`,
      };
      tableData = [
        { Timeframe: 'Hourly', 'Volume Lost (m³)': financials.waterLostPerHour, Cost: `$${financials.hourlyCost}` },
        { Timeframe: 'Daily', 'Volume Lost (m³)': financials.waterLostPerDay, Cost: `$${financials.dailyCost}` },
        { Timeframe: 'Monthly (30.4d)', 'Volume Lost (m³)': financials.waterLostPerMonth, Cost: `$${financials.monthlyCost}` },
        { Timeframe: 'Annualized (365d)', 'Volume Lost (m³)': financials.waterLostPerYear, Cost: `$${financials.annualizedCost.toLocaleString()}` },
      ];
      recommendations = [
        'Approve emergency work order #WO-9024 for Section B to recoup projected monthly loss of $' + financials.monthlyCost + '.',
        'Integrate automated actuator shut-off logic into SCADA emergency loop to cap instantaneous fiscal exposure.',
      ];
      break;

    case 'Sensor Health Report':
      title = `SCADA Transducer & IoT Telemetry Health Audit`;
      summary = `Telemetry audit surveyed ${sensors.length} total nodes across Sections A-D and Main manifold. Fleet communication uptime stands at 97.4% with mean battery reserve of 88.6%.`;
      metrics = {
        'Total Online Sensors': sensors.filter((s) => s.status !== 'offline').length,
        'Offline / Degraded Nodes': sensors.filter((s) => s.status === 'offline').length,
        'Average Battery Level': `${(sensors.reduce((a, s) => a + (s.battery ?? s.batteryLevel ?? 100), 0) / sensors.length).toFixed(1)}%`,
        'Average Signal Strength': `${(sensors.reduce((a, s) => a + (s.signal ?? s.signalStrength ?? -65), 0) / sensors.length).toFixed(1)} dBm`,
        'Sample Rate Polling': 'Every 5 seconds',
      };
      tableData = sensors.map((s) => ({
        'Sensor ID': s.id,
        Type: s.type,
        Section: s.section,
        'Current Reading': `${s.currentReading ?? s.currentValue ?? 0} ${s.unit}`,
        Status: s.status.toUpperCase(),
        'Battery (%)': `${s.battery ?? s.batteryLevel ?? 100}%`,
        'Signal Strength': `${s.signal ?? s.signalStrength ?? -65} dBm`,
        'Last Comm': s.lastCommunication,
      }));
      recommendations = [
        'Replace coin-cell lithium backup battery in sensor ACOU-B02 during next turnaround.',
        'Perform zero-offset calibration check on PRESS-D01 pressure transmitter.',
      ];
      break;

    default: // System Performance Report
      title = `Overall Plant Hydraulic Performance & Energy Index`;
      summary = `Comprehensive operational review confirms stable continuous duty across plant circuits. Solar generation offset 32% of pumping energy consumption during peak production hours.`;
      metrics = {
        'Operating Flow': `${current.currentReading.flow} m³/h`,
        'Solar Offset Power': `${current.currentReading.solarKW} kW`,
        'Grid Power Consumption': `${current.currentReading.gridKW} kW`,
        'System Health Rating': current.systemHealth,
        'Pumping Specific Energy': '0.34 kWh/m³',
      };
      tableData = [
        { Circuit: 'Pump Station P-01', Power: `${current.currentReading.gridKW} kW`, Status: 'ONLINE', Efficiency: '92.4%' },
        { Circuit: 'Solar Microgrid Array', Power: `${current.currentReading.solarKW} kW`, Status: 'ACTIVE', Efficiency: '98.1%' },
        { Circuit: 'Backup Battery Reserve', Power: `${current.currentReading.batteryKW} kW`, Status: 'STANDBY', Efficiency: '96.5%' },
        { Circuit: 'Storage Reservoir RES-01', Capacity: '25,000 m³', Fill: `${current.currentReading.reservoirLevel}%`, Status: 'NOMINAL' },
      ];
      recommendations = [
        'Maintain solar inverter cleaning cadence to maximize daytime pumping offset.',
        'Keep reserve battery pre-charged for automated peak shaving during industrial utility surge tariff hours.',
      ];
      break;
  }

  const report: GeneratedReport = {
    id: `REP-${Math.floor(100000 + Math.random() * 900000)}`,
    type,
    title,
    generatedAt: now.toLocaleString(),
    dateRange: range,
    facility: 'HydraSync Metro Apex Plant 04',
    executiveSummary: summary,
    metrics,
    tableData,
    recommendations,
  };

  savedReports.unshift(report);
  if (savedReports.length > 20) savedReports.pop();

  return report;
}

export function getSavedReports(): GeneratedReport[] {
  if (savedReports.length === 0) {
    // Generate an initial default report so user sees pre-populated history
    generateReport('Daily Water Report');
    generateReport('Financial Impact Report');
  }
  return savedReports;
}
