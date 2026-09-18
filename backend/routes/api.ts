import { Router } from 'express';
import { simulationEngine } from '../services/simulationEngine.ts';
import { generateReport, getSavedReports } from '../services/reportService.ts';

export const apiRouter = Router();

// Health
apiRouter.get('/health', (_req, res) => {
  res.json({
    status: 'healthy',
    product: 'HYDRASYNC',
    version: '2.4.0',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
  });
});

// Water Telemetry
apiRouter.get('/water/current', (_req, res) => {
  try {
    const data = simulationEngine.getCurrentTelemetry();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.get('/water/history', (req, res) => {
  try {
    const range = (req.query.range as string) || '1h';
    const history = simulationEngine.getHistory();
    res.json({ range, points: history.length, data: history });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Network
apiRouter.get('/network', (_req, res) => {
  try {
    const network = simulationEngine.getNetwork();
    res.json(network);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.put('/network/sections/:id', (req, res) => {
  try {
    const updated = simulationEngine.updateSection(req.params.id, req.body);
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Sensors CRUD
apiRouter.get('/sensors', (_req, res) => {
  try {
    const sensors = simulationEngine.getSensors();
    res.json(sensors);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.post('/sensors', (req, res) => {
  try {
    const created = simulationEngine.addSensor(req.body);
    res.status(201).json(created);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

apiRouter.put('/sensors/:id', (req, res) => {
  try {
    const updated = simulationEngine.updateSensor(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Sensor not found' });
    }
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

apiRouter.delete('/sensors/:id', (req, res) => {
  try {
    const deleted = simulationEngine.deleteSensor(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Sensor not found' });
    }
    res.json({ success: true, id: req.params.id });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Alerts
apiRouter.get('/alerts', (_req, res) => {
  try {
    const alerts = simulationEngine.getAlerts();
    res.json(alerts);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.post('/alerts/:id/dismiss', (req, res) => {
  try {
    const ok = simulationEngine.dismissAlert(req.params.id);
    if (!ok) {
      return res.status(404).json({ error: 'Alert not found' });
    }
    res.json({ success: true, id: req.params.id });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

apiRouter.post('/alerts/:id/resolve', (req, res) => {
  try {
    const resolvedBy = req.body?.resolvedBy || 'Alex Mercer';
    const alert = simulationEngine.resolveAlert(req.params.id, resolvedBy);
    if (!alert) {
      return res.status(404).json({ error: 'Alert not found' });
    }
    res.json(alert);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Analytics
apiRouter.get('/analytics', (req, res) => {
  try {
    const range = (req.query.range as string) || '24h';
    const analytics = simulationEngine.getAnalytics(range);
    res.json(analytics);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Financials
apiRouter.get('/financials', (_req, res) => {
  try {
    const fin = simulationEngine.getFinancials();
    res.json(fin);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Scenarios
apiRouter.get('/scenarios', (_req, res) => {
  try {
    const scenarios = simulationEngine.getScenarios();
    res.json(scenarios);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.post('/scenarios/apply', (req, res) => {
  try {
    const { scenarioId } = req.body;
    if (!scenarioId) {
      return res.status(400).json({ error: 'Missing scenarioId' });
    }
    const applied = simulationEngine.applyScenario(scenarioId);
    if (!applied) {
      return res.status(404).json({ error: 'Scenario not found' });
    }
    res.json({ success: true, scenario: applied });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

apiRouter.post('/scenarios/reset', (_req, res) => {
  try {
    const reset = simulationEngine.resetScenario();
    res.json({ success: true, scenario: reset });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Reports
apiRouter.post('/reports/generate', (req, res) => {
  try {
    const { type, dateRange } = req.body;
    if (!type) {
      return res.status(400).json({ error: 'Missing report type' });
    }
    const report = generateReport(type, dateRange);
    res.json(report);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

apiRouter.get('/reports', (_req, res) => {
  try {
    const reports = getSavedReports();
    res.json(reports);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Settings
apiRouter.get('/settings', (_req, res) => {
  try {
    res.json(simulationEngine.getSettings());
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.post('/settings', (req, res) => {
  try {
    const updated = simulationEngine.updateSettings(req.body);
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

apiRouter.post('/settings/reset', (_req, res) => {
  try {
    const reset = simulationEngine.resetSettings();
    res.json(reset);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
