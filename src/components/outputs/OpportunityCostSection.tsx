import { formatCurrency } from '../../utils/format';

interface OpportunityCostSectionProps {
  monthlyOperatingMargin: number;
  delayMonths: number;
  onDelayChange: (months: number) => void;
}

export function OpportunityCostSection({
  monthlyOperatingMargin,
  delayMonths,
  onDelayChange,
}: OpportunityCostSectionProps) {
  // Lost revenue = months delayed × monthly benefit foregone
  const lostRevenue = delayMonths * monthlyOperatingMargin;

  return (
    <div className="card p-3">
      <div className="flex items-center gap-6">
        {/* Left: Title and slider */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-[var(--color-text-secondary)] uppercase tracking-wide">
              Opportunity Cost of Delay
            </span>
            <span className="text-xs font-medium text-[var(--color-text-primary)]">
              {delayMonths} {delayMonths === 1 ? 'mo' : 'mos'}
            </span>
          </div>

          <input
            type="range"
            min={0}
            max={18}
            step={1}
            value={delayMonths}
            onChange={(e) => onDelayChange(Number(e.target.value))}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-[var(--color-accent)]"
            style={{
              background: `linear-gradient(to right, var(--color-accent) 0%, var(--color-accent) ${(delayMonths / 18) * 100}%, var(--color-bg-tertiary) ${(delayMonths / 18) * 100}%, var(--color-bg-tertiary) 100%)`,
            }}
          />

          <div className="flex justify-between text-[10px] text-[var(--color-text-muted)] mt-0.5">
            <span>0</span>
            <span>6</span>
            <span>12</span>
            <span>18 mo</span>
          </div>
        </div>

        {/* Right: Output value */}
        <div className="text-right flex-shrink-0">
          <div className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wide">
            Revenue Lost
          </div>
          <div className={`text-xl font-semibold ${delayMonths > 0 ? 'text-[var(--color-cost)]' : 'text-[var(--color-text-primary)]'}`}>
            {formatCurrency(lostRevenue)}
          </div>
          <div className="text-[10px] text-[var(--color-text-muted)]">
            {delayMonths} × {formatCurrency(monthlyOperatingMargin)}/mo
          </div>
        </div>
      </div>
    </div>
  );
}
