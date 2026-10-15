import type { FC } from 'react';

export const TrendChartLegend: FC = () => (
  <div className="hidden sm:flex items-center gap-2.5 text-[11px] font-mono pl-1 border-l border-[var(--zf-border-subtle)]">
    <div className="flex items-center gap-1">
      <span className="w-2.5 h-0.5 bg-sky-400 rounded-sm" />
      <span className="text-[var(--zf-text-muted)] text-[10px]">Events</span>
    </div>
    <div className="flex items-center gap-1">
      <span className="w-2.5 h-0.5 bg-amber-400 rounded-sm" />
      <span className="text-[var(--zf-text-muted)] text-[10px]">Detections</span>
    </div>
    <div className="flex items-center gap-1">
      <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
      <span className="text-[var(--zf-text-muted)] text-[10px]">Incidents</span>
    </div>
  </div>
);
