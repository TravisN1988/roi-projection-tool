// ROI Projection Tool - Type Definitions
// Based on ROI_Model_R1.xlsx canonical model

// Optional milestone (0-4 can be added between downpayment and pre-shipment)
export interface OptionalMilestone {
  id: string;
  name: string;
  percentage: number; // 0-1 (e.g., 0.2 for 20%)
  month: number;
}

// Payment terms for final payment
export type FinalPaymentTerms = 30 | 60;

// Payment schedule structure
export interface PaymentSchedule {
  // Fixed: Downpayment at order (month 0)
  downpaymentPercent: number; // Default 40%

  // Optional: 0-4 additional milestones between order and pre-shipment
  optionalMilestones: OptionalMilestone[];

  // Fixed: Pre-shipment payment
  preShipmentPercent: number;
  preShipmentMonth: number;

  // Fixed: Final payment (Net 30 or 60 from commissioning)
  finalPaymentPercent: number;
  finalPaymentTerms: FinalPaymentTerms; // 30 or 60 days
}

export interface RoiInputs {
  // CAPEX
  equipmentCost: number;
  installationCost: number;
  paymentSchedule: PaymentSchedule;

  // Operating Profile
  shiftsPerDay: number;
  hoursPerShift: number;
  operatingDaysPerYear: number;

  // Labor Savings
  baseWage: number; // Base hourly wage before burden
  burdenMultiplier: number; // Multiplier for benefits/taxes (default 1.35)
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
  paymentSchedule: {
    downpaymentPercent: 0.40,
    optionalMilestones: [
      { id: '1', name: 'Engineered Drawings Approved', percentage: 0.20, month: 2.8 },
      { id: '2', name: 'Progress Milestone (24 weeks)', percentage: 0.15, month: 5.5 },
    ],
    preShipmentPercent: 0.15,
    preShipmentMonth: 6.9,
    finalPaymentPercent: 0.10,
    finalPaymentTerms: 30,
  },
  shiftsPerDay: 3,
  hoursPerShift: 8,
  operatingDaysPerYear: 320,
  baseWage: 22.48, // BLS Food Manufacturing (NAICS 311) avg hourly earnings
  burdenMultiplier: 1.35, // Standard burden rate for benefits/taxes
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

// Helper to generate unique ID for new milestones
export const generateMilestoneId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};
