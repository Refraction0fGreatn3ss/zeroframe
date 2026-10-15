import type { FC } from 'react';
import { ChartCard } from './ChartCard';
import { ChartHeader } from './ChartHeader';
import { SegmentedControl } from './SegmentedControl';
import { TREND_DATA_BY_RANGE, TREND_TIME_RANGES } from './security-charts.data';
import type { TrendDataPoint, TrendTimeRange } from './security-charts.types';
import { TrendChartCanvas } from './TrendChartCanvas';
import { TrendChartLegend } from './TrendChartLegend';
import { TrendSummary } from './TrendSummary';
import { useTrendTimeRange } from './use-trend-time-range';

export interface SecurityEventTrendLineChartProps {
  className?: string;
  data?: TrendDataPoint[];
  timeRange?: TrendTimeRange;
  onTimeRangeChange?: (range: TrendTimeRange) => void;
  bare?: boolean;
}

const TIME_RANGE_OPTIONS = TREND_TIME_RANGES.map((range) => ({ value: range, label: range }));

export const SecurityEventTrendLineChart: FC<SecurityEventTrendLineChartProps> = ({
  className = '',
  data: customData,
  timeRange: controlledTimeRange,
  onTimeRangeChange,
  bare = false,
}) => {
  const { activeRange, setRange } = useTrendTimeRange(controlledTimeRange, onTimeRangeChange);

  const chartData = customData || TREND_DATA_BY_RANGE[activeRange];
  const peakEvents = Math.max(...chartData.map((d) => d.totalEvents));
  const activeAnomaly = chartData.find((d) => Boolean(d.anomaly));

  return (
    <ChartCard bare={bare} className={className}>
      {!bare && (
        <ChartHeader
          title="Security Activity & Telemetry Velocity"
          subtitle="Ingest flow rate, behavioral detections, and anomaly timeline"
          accentDotClassName="bg-sky-400"
        >
          <div className="flex items-center gap-2.5">
            <SegmentedControl options={TIME_RANGE_OPTIONS} value={activeRange} onChange={setRange} />
            <TrendChartLegend />
          </div>
        </ChartHeader>
      )}

      <TrendSummary peakEvents={peakEvents} timeRange={activeRange} anomaly={activeAnomaly?.anomaly} />

      <TrendChartCanvas data={chartData} />
    </ChartCard>
  );
};
