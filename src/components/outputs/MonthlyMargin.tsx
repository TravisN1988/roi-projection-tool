import { formatCurrency } from '../../utils/format';

interface MonthlyMarginProps {
  laborSavings: number;
  capacityBenefit: number;
  totalMargin: number;
}

export function MonthlyMargin({ laborSavings, capacityBenefit, totalMargin }: MonthlyMarginProps) {
  return (
    <div className="card p-3 border-l-4 border-l-[var(--color-benefit)]">
      <div className="flex items-center justify-between gap-4">
        <span className="text-xs text-[var(--color-text-secondary)] uppercase tracking-wide flex-shrink-0">
          Monthly Operating Margin
        </span>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5">
            <span className="text-[var(--color-text-muted)]">Labor:</span>
            <span className="result-value">{formatCurrency(laborSavings)}</span>
          </div>
          <span className="text-[var(--color-text-muted)]">+</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[var(--color-text-muted)]">Capacity:</span>
            <span className="result-value">{formatCurrency(capacityBenefit)}</span>
          </div>
          <span className="text-[var(--color-text-muted)]">=</span>
          <span className="result-value text-[var(--color-benefit)] font-semibold">
            {formatCurrency(totalMargin)}/mo
          </span>
        </div>
      </div>
    </div>
  );
}
