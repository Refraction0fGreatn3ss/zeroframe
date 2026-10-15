import type { FC } from 'react';
import type { TrendDataPoint } from './security-charts.types';

interface TrendTooltipProps {
  point: TrendDataPoint;
  leftPercent: number;
}

export const TrendTooltip: FC<TrendTooltipProps> = ({ point, leftPercent }) => (
  <div
    className="absolute top-1 pointer-events-none p-2 rounded shadow-lg bg-[var(--zf-surface-card)] border border-[var(--zf-border-medium)] text-[11px] font-mono z-30 space-y-1 backdrop-blur-xs min-w-[170px]"
    style={{ left: `${leftPercent}%` }}
  >
    <div className="font-semibold text-[var(--zf-text-primary)] border-b border-[var(--zf-border-subtle)] pb-1 flex items-center justify-between">
      <span>Timestamp:</span>
      <span className="text-[var(--zf-brand-accent)]">{point.time}</span>
    </div>
    <div className="text-sky-400 flex items-center justify-between gap-3">
      <span>Ingest Events:</span>
      <span className="font-bold">{point.totalEvents}k</span>
    </div>
    <div className="text-amber-400 flex items-center justify-between gap-3">
      <span>Detections:</span>
      <span className="font-bold">{point.detections}</span>
    </div>
    {point.incidents > 0 && (
      <div className="text-rose-400 flex items-center justify-between gap-3 font-bold">
        <span>Incidents:</span>
        <span>{point.incidents} active</span>
      </div>
    )}
    {point.anomaly && (
      <div className="pt-1 border-t border-[var(--zf-border-subtle)] text-[10px] text-amber-300 font-sans leading-tight">
        ⚠️ {point.anomaly}
      </div>
    )}
  </div>
);
