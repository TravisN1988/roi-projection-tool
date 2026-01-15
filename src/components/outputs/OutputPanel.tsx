import type { RoiOutputs } from '../../types';
import { ResultCard } from './ResultCard';
import { MonthlyMargin } from './MonthlyMargin';
import { OpportunityCostSection } from './OpportunityCostSection';

interface OutputPanelProps {
  outputs: RoiOutputs;
  commissioningMonth: number;
}

export function OutputPanel({ outputs, commissioningMonth }: OutputPanelProps) {
  const breakEvenDisplay = outputs.breakEvenProjectMonth !== null
    ? outputs.breakEvenProjectMonth.toString()
    : '—';

  const afterCommDisplay = outputs.breakEvenAfterCommissioning !== null
    ? outputs.breakEvenAfterCommissioning.toString()
    : '—';

  const paybackVariant = outputs.paybackWithin24Months === 'Yes'
    ? 'success'
    : outputs.paybackWithin24Months === 'No'
      ? 'warning'
      : 'neutral';

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-3">
        <ResultCard
          label="Break-even"
          value={breakEvenDisplay}
          sublabel="Project Month"
          size="large"
        />
        <ResultCard
          label="Break-even"
          value={afterCommDisplay}
          sublabel={`Months after Mo. ${commissioningMonth}`}
          size="large"
        />
        <ResultCard
          label="Payback ≤ 24 Mo?"
          value={outputs.paybackWithin24Months}
          variant={paybackVariant}
          size="large"
        />
      </div>

      <OpportunityCostSection monthlyOperatingMargin={outputs.monthlyOperatingMargin} />

      <MonthlyMargin
        laborSavings={outputs.monthlyLaborSavings}
        capacityBenefit={outputs.monthlyCapacityBenefit}
        totalMargin={outputs.monthlyOperatingMargin}
      />
    </div>
  );
}
