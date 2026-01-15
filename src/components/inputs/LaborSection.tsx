import type { RoiInputs } from '../../types';
import { NumberInput } from './NumberInput';
import { formatCurrency } from '../../utils/format';
import { calculateLaborSavings } from '../../calculations/engine';

interface LaborSectionProps {
  inputs: RoiInputs;
  onInputChange: <K extends keyof RoiInputs>(key: K, value: RoiInputs[K]) => void;
}

export function LaborSection({ inputs, onInputChange }: LaborSectionProps) {
  // Calculate derived value
  const laborSavings = calculateLaborSavings(inputs);

  return (
    <div className="card p-4 space-y-4">
      <h3 className="section-header">Labor Savings</h3>

      <div className="space-y-3">
        <NumberInput
          label="Burdened Rate ($/hr)"
          value={inputs.burdenedRate}
          onChange={(v) => onInputChange('burdenedRate', v)}
          type="currency"
          decimals={2}
          min={0}
        />
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
