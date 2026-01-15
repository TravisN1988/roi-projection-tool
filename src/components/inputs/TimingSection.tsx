import type { RoiInputs } from '../../types';
import { NumberInput } from './NumberInput';

interface TimingSectionProps {
  inputs: RoiInputs;
  onInputChange: <K extends keyof RoiInputs>(key: K, value: RoiInputs[K]) => void;
}

export function TimingSection({ inputs, onInputChange }: TimingSectionProps) {
  return (
    <div className="card p-4 space-y-4">
      <h3 className="section-header">Timing & One-Time Impacts</h3>

      <div className="space-y-3">
        <NumberInput
          label="Commissioning Month"
          value={inputs.commissioningMonth}
          onChange={(v) => onInputChange('commissioningMonth', v)}
          min={0}
          max={60}
        />
        <NumberInput
          label="Lost Production Cost ($)"
          value={inputs.lostProductionCost}
          onChange={(v) => onInputChange('lostProductionCost', v)}
          type="currency"
          min={0}
        />
        <NumberInput
          label="Lost Production Month"
          value={inputs.lostProductionMonth}
          onChange={(v) => onInputChange('lostProductionMonth', v)}
          min={0}
          max={60}
        />
      </div>
    </div>
  );
}
