// Labor Savings Calculation
// Mirrors: Labor_Savings sheet in ROI_Model_R1.xlsx

import type { RoiInputs, LaborSavingsResult } from '../types';

export function calculateLaborSavings(inputs: RoiInputs): LaborSavingsResult {
  // Annual Hours Saved = Units Reduced × Shifts × Hours × Days
  // Excel: B9 = $B$5*$B$6*$B$7*$B$8
  const annualHoursSaved =
    inputs.laborUnitsReduced *
    inputs.shiftsPerDay *
    inputs.hoursPerShift *
    inputs.operatingDaysPerYear;

  // Burdened Rate = Base Wage × Burden Multiplier
  const burdenedRate = inputs.baseWage * inputs.burdenMultiplier;

  // Annual Labor Savings = Hours Saved × Burdened Rate
  // Excel: B10 = $B$9*$B$4
  const annualSavings = annualHoursSaved * burdenedRate;

  // Monthly Labor Savings = Annual / 12
  // Excel: B11 = $B$10/12
  const monthlySavings = annualSavings / 12;

  return {
    annualHoursSaved,
    annualSavings,
    monthlySavings,
  };
}
