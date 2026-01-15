import { formatCurrency } from '../../utils/format';

interface MonthlyMarginProps {
  laborSavings: number;
  capacityBenefit: number;
  totalMargin: number;
}

export function MonthlyMargin({ laborSavings, capacityBenefit, totalMargin }: MonthlyMarginProps) {
  return (
    <div className="card p-4 border-l-4 border-l-[var(--color-benefit)]">
      <h3 className="section-header mb-3">Monthly Operating Margin</h3>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-[var(--color-text-secondary)]">Labor Savings</span>
          <span className="result-value">{formatCurrency(laborSavings)}/mo</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[var(--color-text-secondary)]">Capacity Benefit</span>
          <span className="result-value">{formatCurrency(capacityBenefit)}/mo</span>
        </div>
        <div className="border-t border-[var(--color-border)] my-2" />
        <div className="flex justify-between font-semibold">
          <span className="text-[var(--color-text-primary)]">Total Margin</span>
          <span className="result-value text-[var(--color-benefit)]">
            {formatCurrency(totalMargin)}/mo
          </span>
        </div>
      </div>
    </div>
  );
}
