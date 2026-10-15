import { type FC, useState } from 'react';
import { ChartCard } from './ChartCard';
import { ChartHeader } from './ChartHeader';
import { ChartSummaryBar } from './ChartSummaryBar';
import { DonutLegend } from './DonutLegend';
import { DonutRing } from './DonutRing';
import { sumCategoryCounts } from './donut-chart.utils';
import { SegmentedControl } from './SegmentedControl';
import {
  DEFAULT_CATEGORIES_BY_VIEW_MODE,
  THREAT_VIEW_MODE_OPTIONS,
  THREAT_VIEW_MODE_SCOPE_LABELS,
} from './security-charts.data';
import type { ThreatCategory, ThreatViewMode } from './security-charts.types';

export interface ThreatDistributionDonutChartProps {
  className?: string;
  categories?: ThreatCategory[];
  bare?: boolean;
}

export const ThreatDistributionDonutChart: FC<ThreatDistributionDonutChartProps> = ({
  className = '',
  categories: customCategories,
  bare = false,
}) => {
  const [viewMode, setViewMode] = useState<ThreatViewMode>('VECTORS');
  const [activeId, setActiveId] = useState<string | null>(null);

  const categories = customCategories || DEFAULT_CATEGORIES_BY_VIEW_MODE[viewMode];
  const totalCount = sumCategoryCounts(categories);

  const changeViewMode = (mode: ThreatViewMode) => {
    setViewMode(mode);
    setActiveId(null);
  };

  return (
    <ChartCard bare={bare} className={className}>
      {!bare && (
        <ChartHeader
          title="Tactical Vectors & Threat Distribution"
          subtitle="Active kill-chain classifications & alert severity"
          accentDotClassName="bg-amber-400"
        >
          <SegmentedControl options={THREAT_VIEW_MODE_OPTIONS} value={viewMode} onChange={changeViewMode} />
        </ChartHeader>
      )}

      <ChartSummaryBar>
        <div>
          <span className="text-[var(--zf-text-muted)]">Active Scope: </span>
          <span className="font-bold text-[var(--zf-text-primary)]">{THREAT_VIEW_MODE_SCOPE_LABELS[viewMode]}</span>
        </div>
        <div>
          <span className="text-[var(--zf-text-muted)]">Total Classified: </span>
          <span className="text-amber-400 font-bold">{totalCount} signals</span>
        </div>
      </ChartSummaryBar>

      <div className="flex flex-col sm:flex-row items-center gap-4 py-1 flex-1 justify-center min-h-[170px]">
        <DonutRing categories={categories} totalCount={totalCount} activeId={activeId} onActiveChange={setActiveId} />
        <DonutLegend categories={categories} activeId={activeId} onActiveChange={setActiveId} />
      </div>
    </ChartCard>
  );
};
