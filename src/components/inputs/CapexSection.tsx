import type { RoiInputs, Milestone } from '../../types';
import { NumberInput } from './NumberInput';
import { formatPercent } from '../../utils/format';

interface CapexSectionProps {
  inputs: RoiInputs;
  onInputChange: <K extends keyof RoiInputs>(key: K, value: RoiInputs[K]) => void;
}

export function CapexSection({ inputs, onInputChange }: CapexSectionProps) {
  const handleMilestoneChange = (index: number, field: 'percentage' | 'month', value: number) => {
    const newMilestones = [...inputs.milestones];
    newMilestones[index] = { ...newMilestones[index], [field]: value };
    onInputChange('milestones', newMilestones);
  };

  // Calculate milestone sum for validation
  const milestoneSum = inputs.milestones.reduce((sum, m) => sum + m.percentage, 0);
  const isValid = Math.abs(milestoneSum - 1) < 0.001;

  return (
    <div className="card p-4 space-y-4">
      <h3 className="section-header">CAPEX & Milestones</h3>

      <div className="grid grid-cols-2 gap-3">
        <NumberInput
          label="Equipment Cost"
          value={inputs.equipmentCost}
          onChange={(v) => onInputChange('equipmentCost', v)}
          type="currency"
        />
        <NumberInput
          label="Installation Cost"
          value={inputs.installationCost}
          onChange={(v) => onInputChange('installationCost', v)}
          type="currency"
        />
      </div>

      <div className="pt-2">
        <div className="text-sm text-[var(--color-text-secondary)] mb-2">Billing Schedule</div>
        <div className="space-y-2">
          {inputs.milestones.map((milestone, index) => (
            <MilestoneRow
              key={index}
              milestone={milestone}
              onPercentageChange={(v) => handleMilestoneChange(index, 'percentage', v)}
              onMonthChange={(v) => handleMilestoneChange(index, 'month', v)}
            />
          ))}
        </div>

        <div className={`mt-2 text-sm flex items-center gap-2 ${isValid ? 'text-[var(--color-benefit)]' : 'text-[var(--color-warning)]'}`}>
          <span>Sum: {formatPercent(milestoneSum)}</span>
          {isValid ? (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <span className="text-xs">(should equal 100%)</span>
          )}
        </div>
      </div>
    </div>
  );
}

interface MilestoneRowProps {
  milestone: Milestone;
  onPercentageChange: (value: number) => void;
  onMonthChange: (value: number) => void;
}

function MilestoneRow({ milestone, onPercentageChange, onMonthChange }: MilestoneRowProps) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="flex-1 text-[var(--color-text-secondary)] truncate" title={milestone.name}>
        {milestone.name}
      </span>
      <div className="w-20">
        <NumberInput
          label=""
          value={milestone.percentage}
          onChange={onPercentageChange}
          type="percent"
          min={0}
          max={1}
          className="[&>div]:hidden"
        />
      </div>
      <span className="text-[var(--color-text-muted)]">Mo:</span>
      <div className="w-16">
        <NumberInput
          label=""
          value={milestone.month}
          onChange={onMonthChange}
          decimals={1}
          min={0}
          max={60}
          className="[&>div]:hidden"
        />
      </div>
    </div>
  );
}
