import { useState } from 'react';
import { formatCurrency } from '../../utils/format';

interface OpportunityCostSectionProps {
  monthlyOperatingMargin: number;
}

export function OpportunityCostSection({ monthlyOperatingMargin }: OpportunityCostSectionProps) {
  const [delayMonths, setDelayMonths] = useState(0);

  // Lost revenue = months delayed × monthly benefit foregone
  const lostRevenue = delayMonths * monthlyOperatingMargin;

  return (
    <div className="card p-4">
      <h3 className="section-header mb-4">Opportunity Cost of Delay</h3>

      <div className="space-y-4">
        {/* Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--color-text-secondary)]">
              Project Start Delay
            </span>
            <span className="text-sm font-medium text-[var(--color-text-primary)]">
              {delayMonths} {delayMonths === 1 ? 'month' : 'months'}
            </span>
          </div>

          <input
            type="range"
            min={0}
            max={18}
            step={1}
            value={delayMonths}
            onChange={(e) => setDelayMonths(Number(e.target.value))}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-[var(--color-accent)]"
            style={{
              background: `linear-gradient(to right, var(--color-accent) 0%, var(--color-accent) ${(delayMonths / 18) * 100}%, var(--color-bg-tertiary) ${(delayMonths / 18) * 100}%, var(--color-bg-tertiary) 100%)`,
            }}
          />

          <div className="flex justify-between text-xs text-[var(--color-text-muted)]">
            <span>0</span>
            <span>6</span>
            <span>12</span>
            <span>18</span>
          </div>
        </div>

        {/* Output */}
        <div className="p-4 rounded-lg bg-[var(--color-bg-tertiary)] border border-[var(--color-border)]">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-[var(--color-text-secondary)]">
                Revenue Lost Due to Delay
              </div>
              <div className="text-xs text-[var(--color-text-muted)] mt-1">
                {delayMonths} mo × {formatCurrency(monthlyOperatingMargin)}/mo
              </div>
            </div>
            <div className={`text-2xl font-semibold ${delayMonths > 0 ? 'text-[var(--color-cost)]' : 'text-[var(--color-text-primary)]'}`}>
              {formatCurrency(lostRevenue)}
            </div>
          </div>
        </div>

        {/* Context note */}
        <p className="text-xs text-[var(--color-text-muted)] italic">
          This represents the cumulative monthly operating margin (labor savings + capacity benefit)
          foregone by delaying project start.
        </p>
      </div>
    </div>
  );
}
