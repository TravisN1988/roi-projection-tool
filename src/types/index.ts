// ROI Projection Tool - Type Definitions
// Based on ROI_Model_R1.xlsx canonical model

export interface Milestone {
  name: string;
  percentage: number; // 0-1 (e.g., 0.4 for 40%)
  month: number; // Can be decimal, rounded in calculation
}

export interface RoiInputs {
  // CAPEX
  equipmentCost: number;
  installationCost: number;
  milestones: Milestone[];

  // Operating Profile
  shiftsPerDay: number;
  hoursPerShift: number;
  operatingDaysPerYear: number;

  // Labor Savings
  burdenedRate: number;
  laborUnitsReduced: number;

  // Capacity Benefit
  baselineUnitsPerHour: number;
  proposedUnitsPerHour: number;
  contributionMarginPerUnit: number;

  // Timing
  commissioningMonth: number;
  installationMonth: number;
  lostProductionCost: number;
  lostProductionMonth: number;

  // Optional (for NPV - informational only)
  annualDiscountRate: number;
}

export interface LaborSavingsResult {
  annualHoursSaved: number;
  annualSavings: number;
  monthlySavings: number;
}

export interface CapacityBenefitResult {
  deltaUnitsPerHour: number;
  operatingHoursPerYear: number;
  incrementalUnitsPerYear: number;
  annualBenefit: number;
  monthlyBenefit: number;
}

export interface MonthlyCashflow {
  month: number;
  capexOut: number;
  laborSavings: number;
  capacityBenefit: number;
  totalBenefit: number;
  oneTimeLoss: number;
  investmentOut: number;
  netCashFlow: number;
  discountFactor: number;
  discountedCashFlow: number;
  cumulativeDiscountedCashFlow: number;
  cumulativeCosts: number;
  cumulativeBenefits: number;
  cumulativeNet: number;
}

export interface ChartDataPoint {
  month: number;
  cumulativeCosts: number;
  cumulativeBenefits: number;
  cumulativeNet: number;
}

export interface RoiOutputs {
  // Primary results
  breakEvenProjectMonth: number | null;
  breakEvenAfterCommissioning: number | null;
  paybackWithin24Months: 'Yes' | 'No' | 'N/A';

  // Monthly operating margin
  monthlyLaborSavings: number;
  monthlyCapacityBenefit: number;
  monthlyOperatingMargin: number;

  // Informational
  totalInstalledCost: number;
  operatingHoursPerYear: number;
  npvAt60Months: number;

  // Chart data
  chartData: ChartDataPoint[];

  // Full cashflow data (for debugging/detailed view)
  cashflows: MonthlyCashflow[];
}

// Default values from Excel model
export const DEFAULT_INPUTS: RoiInputs = {
  equipmentCost: 1139475,
  installationCost: 76200,
  milestones: [
    { name: 'Order / Downpayment', percentage: 0.40, month: 0 },
    { name: 'Engineered Drawings Approved', percentage: 0.20, month: 2.8 },
    { name: 'Progress Milestone (24 weeks)', percentage: 0.15, month: 5.5 },
    { name: 'Prior to Shipment', percentage: 0.15, month: 6.9 },
    { name: 'Final Acceptance (Net 30)', percentage: 0.10, month: 8.8 },
  ],
  shiftsPerDay: 3,
  hoursPerShift: 8,
  operatingDaysPerYear: 320,
  burdenedRate: 40,
  laborUnitsReduced: 2,
  baselineUnitsPerHour: 1600,
  proposedUnitsPerHour: 1650,
  contributionMarginPerUnit: 1.75,
  commissioningMonth: 8,
  installationMonth: 8,
  lostProductionCost: 34000,
  lostProductionMonth: 8,
  annualDiscountRate: 0.12,
};
