// Capacity Benefit Calculation
// Mirrors: Capacity_Benefit sheet in ROI_Model_R1.xlsx

import type { RoiInputs, CapacityBenefitResult } from '../types';

export function calculateCapacityBenefit(inputs: RoiInputs): CapacityBenefitResult {
  // Delta Units/hr = Proposed - Baseline
  // Excel: B6 = $B$5-$B$4
  const deltaUnitsPerHour = inputs.proposedUnitsPerHour - inputs.baselineUnitsPerHour;

  // Operating Hours per Year = Shifts × Hours × Days
  // Excel: Operating_Profile!B7 = $B$4*$B$5*$B$6
  const operatingHoursPerYear =
    inputs.shiftsPerDay * inputs.hoursPerShift * inputs.operatingDaysPerYear;

  // Incremental Units per Year = Delta × Operating Hours
  // Excel: B8 = $B$6*$B$7
  const incrementalUnitsPerYear = deltaUnitsPerHour * operatingHoursPerYear;

  // Annual Capacity Benefit = Incremental Units × Contribution Margin
  // Excel: B10 = $B$8*$B$9
  const annualBenefit = incrementalUnitsPerYear * inputs.contributionMarginPerUnit;

  // Monthly Capacity Benefit = Annual / 12
  // Excel: B11 = $B$10/12
  const monthlyBenefit = annualBenefit / 12;

  return {
    deltaUnitsPerHour,
    operatingHoursPerYear,
    incrementalUnitsPerYear,
    annualBenefit,
    monthlyBenefit,
  };
}
