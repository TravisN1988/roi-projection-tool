import type { RoiInputs } from '../../types';
import { NumberInput } from './NumberInput';
import { formatCurrency } from '../../utils/format';
import { calculateLaborSavings } from '../../calculations/engine';

interface LaborSectionProps {
  inputs: RoiInputs;
  onInputChange: <K extends keyof RoiInputs>(key: K, value: RoiInputs[K]) => void;
}

export function LaborSection({ inputs, onInputChange }: LaborSectionProps) {
  // Calculate derived values
  const laborSavings = calculateLaborSavings(inputs);
  const burdenedRate = inputs.baseWage * inputs.burdenMultiplier;

  return (
    <div className="card p-4 space-y-4">
      <h3 className="section-header">Labor Savings</h3>

      <div className="space-y-3">
        {/* Base Wage and Multiplier Row */}
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-3">
            <NumberInput
              label="Base Wage ($/hr)"
              value={inputs.baseWage}
              onChange={(v) => onInputChange('baseWage', v)}
              type="currency"
              decimals={2}
              min={0}
            />
            <NumberInput
              label="Burden Multiplier"
              value={inputs.burdenMultiplier}
              onChange={(v) => onInputChange('burdenMultiplier', v)}
              decimals={2}
              min={1}
              max={3}
            />
          </div>
          <div className="text-xs text-[var(--color-text-muted)] flex items-center justify-between px-1">
            <span>Burdened Rate:</span>
            <span className="font-medium text-[var(--color-text-secondary)]">
              {formatCurrency(burdenedRate, 2)}/hr
            </span>
          </div>
        </div>

        <NumberInput
          label="Labor Units Reduced per Shift"
          value={inputs.laborUnitsReduced}
          onChange={(v) => onInputChange('laborUnitsReduced', v)}
          decimals={1}
          min={0}
        />
      </div>

      <div className="text-sm text-[var(--color-text-muted)] italic">
        → {formatCurrency(laborSavings.monthlySavings)}/month saved
      </div>
    </div>
  );
}
