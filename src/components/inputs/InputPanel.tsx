import type { RoiInputs } from '../../types';
import { CapexSection } from './CapexSection';
import { OperatingSection } from './OperatingSection';
import { LaborSection } from './LaborSection';
import { CapacitySection } from './CapacitySection';
import { TimingSection } from './TimingSection';

interface InputPanelProps {
  inputs: RoiInputs;
  onInputChange: <K extends keyof RoiInputs>(key: K, value: RoiInputs[K]) => void;
}

export function InputPanel({ inputs, onInputChange }: InputPanelProps) {
  return (
    <div className="space-y-4">
      <CapexSection inputs={inputs} onInputChange={onInputChange} />
      <OperatingSection inputs={inputs} onInputChange={onInputChange} />
      <LaborSection inputs={inputs} onInputChange={onInputChange} />
      <CapacitySection inputs={inputs} onInputChange={onInputChange} />
      <TimingSection inputs={inputs} onInputChange={onInputChange} />
    </div>
  );
}
