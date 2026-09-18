import { FinancialStats } from '../../src/types/hydrasync.ts';

export function calculateFinancialImpact(leakRateM3H: number, waterCostPerUnit: number): FinancialStats {
  const safeRate = Math.max(0, leakRateM3H);
  const safeCost = Math.max(0.1, waterCostPerUnit);

  const waterLostPerHour = Number(safeRate.toFixed(2));
  const waterLostPerDay = Number((safeRate * 24).toFixed(1));
  const waterLostPerMonth = Number((safeRate * 24 * 30.4).toFixed(1));
  const waterLostPerYear = Number((safeRate * 24 * 365).toFixed(1));

  const hourlyCost = Number((waterLostPerHour * safeCost).toFixed(2));
  const dailyCost = Number((waterLostPerDay * safeCost).toFixed(2));
  const monthlyCost = Number((waterLostPerMonth * safeCost).toFixed(2));
  const annualizedCost = Number((waterLostPerYear * safeCost).toFixed(2));

  // If intervention is executed promptly vs neglected
  const potentialAvoidableLoss = Number((annualizedCost * 0.88).toFixed(2));
  const estimatedInterventionImpact = Number((annualizedCost * 0.94).toFixed(2));

  return {
    waterLostPerHour,
    waterLostPerDay,
    waterLostPerMonth,
    waterLostPerYear,
    hourlyCost,
    dailyCost,
    monthlyCost,
    annualizedCost,
    potentialAvoidableLoss,
    estimatedInterventionImpact,
    waterCostPerUnit: safeCost,
    currency: 'USD',
    unit: 'm³',
  };
}
