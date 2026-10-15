import type { FC } from 'react';
import { ChartSummaryBar } from './ChartSummaryBar';
import type { TrendTimeRange } from './security-charts.types';

interface TrendSummaryProps {
  peakEvents: number;
  timeRange: TrendTimeRange;
  anomaly?: string;
}

export const TrendSummary: FC<TrendSummaryProps> = ({ peakEvents, timeRange, anomaly }) => (
  <ChartSummaryBar>
    <div className="flex items-center gap-3">
      <div>
        <span className="text-[var(--zf-text-muted)]">Peak Ingest: </span>
        <span className="font-bold text-[var(--zf-text-primary)]">{peakEvents}k/hr</span>
      </div>
      <span className="text-[var(--zf-border-subtle)]">·</span>
      <div>
        <span className="text-[var(--zf-text-muted)]">Window: </span>
        <span className="text-sky-400 font-semibold">{timeRange}</span>
      </div>
    </div>

    {anomaly ? (
      <div className="flex items-center gap-1.5 text-amber-400 font-medium">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
        <span className="truncate max-w-[280px]">{anomaly}</span>
      </div>
    ) : (
      <div className="text-emerald-400 flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        <span>Nominal Trend Baseline</span>
      </div>
    )}
  </ChartSummaryBar>
);
