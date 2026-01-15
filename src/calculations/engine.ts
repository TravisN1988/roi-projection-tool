// ROI Calculation Engine
// Main orchestrator that mirrors the complete Excel model

import type { RoiInputs, RoiOutputs, ChartDataPoint } from '../types';
import { calculateLaborSavings } from './laborSavings';
import { calculateCapacityBenefit } from './capacityBenefit';
import { generateMonthlyCashflows } from './cashflow';

export function calculateRoi(inputs: RoiInputs): RoiOutputs {
  // Calculate labor savings
  const laborSavingsResult = calculateLaborSavings(inputs);

  // Calculate capacity benefit
  const capacityBenefitResult = calculateCapacityBenefit(inputs);

  // Generate monthly cashflows
  const cashflows = generateMonthlyCashflows(inputs, laborSavingsResult, capacityBenefitResult);

  // Find break-even month (first month where cumulative net >= 0)
  // Excel: =IFERROR(INDEX(Chart_Data!$A$2:$A$62, MATCH(1, Chart_Data!$H$2:$H$62, 0)),"")
  let breakEvenProjectMonth: number | null = null;
  for (const cf of cashflows) {
    if (cf.cumulativeNet >= 0) {
      breakEvenProjectMonth = cf.month;
      break;
    }
  }

  // Break-even after commissioning
  // Excel: =IF(B5="","",B5-CAPEX_Inputs!$B$20)
  const breakEvenAfterCommissioning =
    breakEvenProjectMonth !== null
      ? breakEvenProjectMonth - inputs.commissioningMonth
      : null;

  // Payback within 24 months
  // Excel: =IF(B4="","No",IF(B4<=24,"Yes","No"))
  let paybackWithin24Months: 'Yes' | 'No' | 'N/A';
  if (breakEvenAfterCommissioning === null) {
    paybackWithin24Months = 'N/A';
  } else if (breakEvenAfterCommissioning <= 24) {
    paybackWithin24Months = 'Yes';
  } else {
    paybackWithin24Months = 'No';
  }

  // Monthly operating margin
  const monthlyLaborSavings = laborSavingsResult.monthlySavings;
  const monthlyCapacityBenefit = capacityBenefitResult.monthlyBenefit;
  const monthlyOperatingMargin = monthlyLaborSavings + monthlyCapacityBenefit;

  // Total installed cost
  // Excel: CAPEX_Inputs!B7 = B5+B6
  const totalInstalledCost = inputs.equipmentCost + inputs.installationCost;

  // Operating hours per year
  const operatingHoursPerYear = capacityBenefitResult.operatingHoursPerYear;

  // NPV at 60 months (cumulative discounted cash flow at month 60)
  const npvAt60Months = cashflows[60]?.cumulativeDiscountedCashFlow ?? 0;

  // Chart data
  const chartData: ChartDataPoint[] = cashflows.map((cf) => ({
    month: cf.month,
    cumulativeCosts: cf.cumulativeCosts,
    cumulativeBenefits: cf.cumulativeBenefits,
    cumulativeNet: cf.cumulativeNet,
  }));

  return {
    breakEvenProjectMonth,
    breakEvenAfterCommissioning,
    paybackWithin24Months,
    monthlyLaborSavings,
    monthlyCapacityBenefit,
    monthlyOperatingMargin,
    totalInstalledCost,
    operatingHoursPerYear,
    npvAt60Months,
    chartData,
    cashflows,
  };
}

// Re-export calculation functions for direct use
export { calculateLaborSavings } from './laborSavings';
export { calculateCapacityBenefit } from './capacityBenefit';
export { generateMonthlyCashflows } from './cashflow';
