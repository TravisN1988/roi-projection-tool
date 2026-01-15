import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts';
import type { ChartDataPoint } from '../../types';
import { formatCurrency } from '../../utils/format';

interface RoiChartProps {
  data: ChartDataPoint[];
  breakEvenMonth: number | null;
}

export function RoiChart({ data, breakEvenMonth }: RoiChartProps) {
  // X-axis ticks every 6 months
  const xTicks = [0, 6, 12, 18, 24, 30, 36, 42, 48, 54, 60];

  return (
    <div className="card p-4">
      <h3 className="section-header mb-4">ROI Projection</h3>

      <div className="h-[300px] md:h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--color-chart-grid)"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              ticks={xTicks}
              tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
              axisLine={{ stroke: 'var(--color-border)' }}
              tickLine={{ stroke: 'var(--color-border)' }}
              label={{
                value: 'Month',
                position: 'insideBottom',
                offset: -5,
                fill: 'var(--color-text-muted)',
                fontSize: 12,
              }}
            />
            <YAxis
              tickFormatter={(value) => {
                if (value >= 1000000 || value <= -1000000) {
                  return `$${(value / 1000000).toFixed(1)}M`;
                }
                if (value >= 1000 || value <= -1000) {
                  return `$${(value / 1000).toFixed(0)}K`;
                }
                return `$${value}`;
              }}
              tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
              axisLine={{ stroke: 'var(--color-border)' }}
              tickLine={{ stroke: 'var(--color-border)' }}
              width={70}
            />
            <Tooltip
              formatter={(value) => formatCurrency(value as number)}
              labelFormatter={(label) => `Month ${label}`}
              contentStyle={{
                backgroundColor: 'var(--color-bg-secondary)',
                border: '1px solid var(--color-border)',
                borderRadius: '0.375rem',
                color: 'var(--color-text-primary)',
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="line"
              wrapperStyle={{ paddingTop: '10px' }}
            />

            {/* Zero reference line */}
            <ReferenceLine
              y={0}
              stroke="var(--color-chart-zero)"
              strokeDasharray="5 5"
              strokeWidth={1}
            />

            {/* Break-even vertical line */}
            {breakEvenMonth !== null && (
              <ReferenceLine
                x={breakEvenMonth}
                stroke="var(--color-chart-net)"
                strokeDasharray="5 5"
                strokeWidth={1}
                label={{
                  value: `Break-even: Mo. ${breakEvenMonth}`,
                  position: 'top',
                  fill: 'var(--color-chart-net)',
                  fontSize: 11,
                }}
              />
            )}

            {/* Cumulative Benefits - Green */}
            <Line
              type="monotone"
              dataKey="cumulativeBenefits"
              name="Cumulative Benefits"
              stroke="var(--color-chart-benefit)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />

            {/* Cumulative Costs - Red */}
            <Line
              type="monotone"
              dataKey="cumulativeCosts"
              name="Cumulative Costs"
              stroke="var(--color-chart-cost)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />

            {/* Cumulative Net - Blue */}
            <Line
              type="monotone"
              dataKey="cumulativeNet"
              name="Cumulative Net"
              stroke="var(--color-chart-net)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
