import type { FC } from 'react';
import { useNow } from '../../hooks/use-now';
import { computeFreshness, DEFAULT_FRESHNESS_POLICY, type FreshnessPolicy } from '../../lib/freshness';
import type { LoadState } from '../../lib/load-state';
import { StatusChip } from './StatusChip';
import { FRESHNESS_TONES } from './status-tones';

const REFRESH_INTERVAL_MS = 15_000;

interface FreshnessIndicatorProps {
  lastUpdated: string | null;
  loadState?: LoadState;
  policy?: FreshnessPolicy;
  label?: string;
}

function formatAge(lastUpdated: string | null, now: number): string {
  if (!lastUpdated) return 'never updated';
  const seconds = Math.max(0, Math.round((now - Date.parse(lastUpdated)) / 1000));
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.round(seconds / 60)}m ago`;
  return `${Math.round(seconds / 3600)}h ago`;
}

export const FreshnessIndicator: FC<FreshnessIndicatorProps> = ({
  lastUpdated,
  loadState,
  policy = DEFAULT_FRESHNESS_POLICY,
  label = 'Data',
}) => {
  const now = useNow(REFRESH_INTERVAL_MS);
  const freshness = computeFreshness(lastUpdated, policy, loadState, now);

  return (
    <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-[var(--zf-text-muted)]">
      <StatusChip label={freshness} tone={FRESHNESS_TONES[freshness]} />
      <span>
        {label} updated <time dateTime={lastUpdated ?? undefined}>{formatAge(lastUpdated, now)}</time>
      </span>
    </span>
  );
};
