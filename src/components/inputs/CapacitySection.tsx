import type { RoiInputs } from '../../types';
import { NumberInput } from './NumberInput';
import { formatCurrency } from '../../utils/format';
import { calculateCapacityBenefit } from '../../calculations/engine';

interface CapacitySectionProps {
  inputs: RoiInputs;
  onInputChange: <K extends keyof RoiInputs>(key: K, value: RoiInputs[K]) => void;
}

export function CapacitySection({ inputs, onInputChange }: CapacitySectionProps) {
  // Calculate derived value
  const capacityBenefit = calculateCapacityBenefit(inputs);

  // Warning if proposed is less than baseline
  const showWarning = inputs.proposedUnitsPerHour < inputs.baselineUnitsPerHour;

  return (
    <div className="card p-4 space-y-4">
      <h3 className="section-header">Capacity Benefit</h3>

      <div className="space-y-3">
        <NumberInput
          label="Baseline Units/hr (Current)"
          value={inputs.baselineUnitsPerHour}
          onChange={(v) => onInputChange('baselineUnitsPerHour', v)}
          min={0}
        />
        <NumberInput
          label="Proposed Units/hr (New)"
          value={inputs.proposedUnitsPerHour}
          onChange={(v) => onInputChange('proposedUnitsPerHour', v)}
          min={0}
        />
        <NumberInput
          label="Contribution Margin ($/unit)"
          value={inputs.contributionMarginPerUnit}
          onChange={(v) => onInputChange('contributionMarginPerUnit', v)}
          type="currency"
          decimals={2}
          min={0}
        />
      </div>

      {showWarning && (
        <div className="text-sm text-[var(--color-warning)] flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>Proposed rate is lower than baseline</span>
        </div>
      )}

      <div className="text-sm text-[var(--color-text-muted)] italic">
        → {formatCurrency(capacityBenefit.monthlyBenefit)}/month benefit
      </div>
    </div>
  );
}
