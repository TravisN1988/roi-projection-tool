// Monthly Cashflow Generation
// Mirrors: Monthly_Cashflow sheet in ROI_Model_R1.xlsx

import type { RoiInputs, MonthlyCashflow, LaborSavingsResult, CapacityBenefitResult } from '../types';

const ANALYSIS_HORIZON = 60; // Months 0-60

export function generateMonthlyCashflows(
  inputs: RoiInputs,
  laborSavings: LaborSavingsResult,
  capacityBenefit: CapacityBenefitResult
): MonthlyCashflow[] {
  const cashflows: MonthlyCashflow[] = [];

  let cumulativeCosts = 0;
  let cumulativeBenefits = 0;
  let cumulativeDiscountedCashFlow = 0;

  for (let month = 0; month <= ANALYSIS_HORIZON; month++) {
    // CAPEX Out: sum of milestones hitting this month + installation cost
    // Excel: =SUMPRODUCT(--(ROUND(CAPEX_Inputs!$D$11:$D$15,0)=A5),CAPEX_Inputs!$C$11:$C$15)
    //        +IF(A5=CAPEX_Inputs!$B$22,CAPEX_Inputs!$B$21,0)
    let capexOut = inputs.milestones
      .filter((m) => Math.round(m.month) === month)
      .reduce((sum, m) => sum + inputs.equipmentCost * m.percentage, 0);

    // Add installation cost at installation month
    if (month === inputs.installationMonth) {
      capexOut += inputs.installationCost;
    }

    // Labor Savings: only accrue at/after commissioning
    // Excel: =IF(A5>=CAPEX_Inputs!$B$20,Labor_Savings!$B$11,0)
    const laborSavingsAmount =
      month >= inputs.commissioningMonth ? laborSavings.monthlySavings : 0;

    // Capacity Benefit: only accrue at/after commissioning
    // Excel: =IF(A5>=CAPEX_Inputs!$B$20,Capacity_Benefit!$B$11,0)
    const capacityBenefitAmount =
      month >= inputs.commissioningMonth ? capacityBenefit.monthlyBenefit : 0;

    // Total Benefit = Labor Savings + Capacity Benefit
    // Excel: =C5+D5
    const totalBenefit = laborSavingsAmount + capacityBenefitAmount;

    // One-Time Loss: applied at lost production month
    // Excel: =IF(A5=CAPEX_Inputs!$B$26,CAPEX_Inputs!$B$25,0)
    const oneTimeLoss = month === inputs.lostProductionMonth ? inputs.lostProductionCost : 0;

    // Investment Out = CAPEX + One-Time Loss
    // Excel: =B5+G5 (H column)
    const investmentOut = capexOut + oneTimeLoss;

    // Net Cash Flow = Benefits - Investment Out
    // Excel: =E5-H5 (I column)
    const netCashFlow = totalBenefit - investmentOut;

    // Discount Factor = 1 / (1 + annual_rate)^month
    // Excel: =1/(1+Project_Assumptions!$B$7)^A5
    const discountFactor = 1 / Math.pow(1 + inputs.annualDiscountRate, month);

    // Discounted Cash Flow = Net CF × Discount Factor
    // Excel: =I5*J5
    const discountedCashFlow = netCashFlow * discountFactor;

    // Cumulative Discounted Cash Flow
    // Excel: =IF(A5=0,K5,L4+K5)
    cumulativeDiscountedCashFlow += discountedCashFlow;

    // Cumulative tracking for break-even (undiscounted)
    cumulativeCosts += investmentOut;
    cumulativeBenefits += totalBenefit;
    const cumulativeNet = cumulativeBenefits - cumulativeCosts;

    cashflows.push({
      month,
      capexOut,
      laborSavings: laborSavingsAmount,
      capacityBenefit: capacityBenefitAmount,
      totalBenefit,
      oneTimeLoss,
      investmentOut,
      netCashFlow,
      discountFactor,
      discountedCashFlow,
      cumulativeDiscountedCashFlow,
      cumulativeCosts,
      cumulativeBenefits,
      cumulativeNet,
    });
  }

  return cashflows;
}
