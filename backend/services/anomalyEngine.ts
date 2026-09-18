import { NetworkSection } from '../../src/types/hydrasync.ts';

export interface AnomalyEvaluation {
  flowDeviation: number;
  flowDeviationPercent: number;
  maxPressureDrop: number;
  anomalyScore: number;
  severity: 'NORMAL' | 'WARNING' | 'CRITICAL';
  affectedSection: 'A' | 'B' | 'C' | 'D' | 'None';
  leakProbability: number;
  estimatedLeakRate: number;
  explanation: string;
  recommendedAction: string;
  engineType: string;
}

export function evaluateAnomalies(
  totalFlow: number,
  expectedFlow: number,
  sections: NetworkSection[],
  anomalyThreshold: number = 65
): AnomalyEvaluation {
  const flowDeviation = Number((totalFlow - expectedFlow).toFixed(1));
  const flowDeviationPercent = Number(((flowDeviation / Math.max(expectedFlow, 1)) * 100).toFixed(1));

  // Compare pressure drops across sections
  let maxDrop = 0;
  let candidateSection: 'A' | 'B' | 'C' | 'D' | 'None' = 'None';
  let worstSectionObj: NetworkSection | null = null;

  for (const s of sections) {
    const drop = s.expectedPressure - s.pressure;
    if (drop > maxDrop) {
      maxDrop = drop;
      candidateSection = s.code;
      worstSectionObj = s;
    }
  }

  // Calculate composite anomaly score: weighted combination of positive flow deviation and localized pressure loss
  let anomalyScore = 0;
  if (flowDeviationPercent > 0) {
    anomalyScore += Math.min(50, flowDeviationPercent * 2.2);
  }
  if (maxDrop > 0) {
    anomalyScore += Math.min(50, (maxDrop / 1.5) * 40);
  }
  anomalyScore = Math.min(100, Math.max(0, Math.round(anomalyScore)));

  // Leak probability estimation based on inverse correlation between flow surge and pressure dip
  let leakProbability = 0;
  let estimatedLeakRate = 0;

  if (flowDeviation > 2 && maxDrop > 0.3) {
    leakProbability = Math.min(99.4, Number((30 + (flowDeviationPercent * 1.8) + (maxDrop * 20)).toFixed(1)));
    estimatedLeakRate = Number(Math.max(0, flowDeviation * 0.75).toFixed(1));
  } else if (flowDeviation > 1) {
    leakProbability = Math.min(45, Number((10 + flowDeviationPercent * 1.2).toFixed(1)));
    estimatedLeakRate = Number(Math.max(0, flowDeviation * 0.3).toFixed(1));
  } else {
    leakProbability = Math.max(1.5, Number((Math.random() * 3).toFixed(1)));
    estimatedLeakRate = 0;
  }

  let severity: 'NORMAL' | 'WARNING' | 'CRITICAL' = 'NORMAL';
  if (anomalyScore >= 75 || maxDrop >= 1.5 || flowDeviationPercent >= 25) {
    severity = 'CRITICAL';
  } else if (anomalyScore >= anomalyThreshold || maxDrop >= 0.6 || flowDeviationPercent >= 10) {
    severity = 'WARNING';
  } else {
    severity = 'NORMAL';
  }

  let explanation = 'All telemetry signatures adhere to calibrated hydraulic profiles.';
  let recommendedAction = 'Nominal continuous telemetry monitoring.';

  if (severity === 'CRITICAL' && candidateSection !== 'None') {
    explanation = `Critical hydraulic loss: Total flow is ${Math.abs(flowDeviationPercent)}% above expected profile while Section ${candidateSection} pressure plunged ${maxDrop.toFixed(2)} bar below baseline. Signature indicates severe pipe breach or uncontrolled release.`;
    recommendedAction = `Immediate automated or manual isolation of Section ${candidateSection}. Close intake valve V-${candidateSection}01 and dispatch rapid intervention team.`;
  } else if (severity === 'WARNING' && candidateSection !== 'None') {
    explanation = `Flow is ${flowDeviationPercent > 0 ? '+' : ''}${flowDeviationPercent}% relative to baseline while Section ${candidateSection} pressure is below its nominal operating range (-${maxDrop.toFixed(2)} bar). Micro-fracture or valve seal bypass suspected.`;
    recommendedAction = `Conduct acoustic resonance inspection on Section ${candidateSection} manifolds. Verify flange torques at node ${candidateSection}-14.`;
  } else if (flowDeviationPercent < -15) {
    explanation = `Flow throttled by ${Math.abs(flowDeviationPercent)}% below expected demand. Upstream line pressure elevated due to downstream blockage or constricted valve travel.`;
    recommendedAction = 'Inspect control valve positions and verify bypass loop integrity.';
  }

  return {
    flowDeviation,
    flowDeviationPercent,
    maxPressureDrop: Number(maxDrop.toFixed(2)),
    anomalyScore,
    severity,
    affectedSection: candidateSection,
    leakProbability,
    estimatedLeakRate,
    explanation,
    recommendedAction,
    engineType: 'AI/ML Simulation (Demo Inference Engine)',
  };
}
