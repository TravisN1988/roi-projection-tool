import type { RoiInputs } from '../../types';
import { NumberInput } from './NumberInput';
import { formatNumber } from '../../utils/format';

interface OperatingSectionProps {
  inputs: RoiInputs;
  onInputChange: <K extends keyof RoiInputs>(key: K, value: RoiInputs[K]) => void;
}

export function OperatingSection({ inputs, onInputChange }: OperatingSectionProps) {
  // Calculate derived value
  const operatingHoursPerYear = inputs.shiftsPerDay * inputs.hoursPerShift * inputs.operatingDaysPerYear;

  return (
    <div className="card p-4 space-y-4">
      <h3 className="section-header">Operating Profile</h3>

      <div className="space-y-3">
        <NumberInput
          label="Shifts per Day"
          value={inputs.shiftsPerDay}
          onChange={(v) => onInputChange('shiftsPerDay', v)}
          min={1}
          max={4}
        />
        <NumberInput
          label="Hours per Shift"
          value={inputs.hoursPerShift}
          onChange={(v) => onInputChange('hoursPerShift', v)}
          min={1}
          max={12}
        />
        <NumberInput
          label="Operating Days per Year"
          value={inputs.operatingDaysPerYear}
          onChange={(v) => onInputChange('operatingDaysPerYear', v)}
          min={1}
          max={365}
        />
      </div>

      <div className="text-sm text-[var(--color-text-muted)] italic">
        → {formatNumber(operatingHoursPerYear)} hrs/year
      </div>
    </div>
  );
}
