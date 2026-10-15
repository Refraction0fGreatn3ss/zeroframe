import { Clock } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import type { ClockMode } from './top-bar.data';
import { CLOCK_MODE_CYCLE } from './top-bar.data';
import { formatLocalTime24, formatUtcTime24 } from './top-bar.utils';

interface OperationsClockProps {
  now: Date;
}

export const OperationsClock: React.FC<OperationsClockProps> = ({ now }) => {
  const [clockMode, setClockMode] = useState<ClockMode>('UTC');
  const utcTime24 = formatUtcTime24(now);
  const localTime24 = formatLocalTime24(now);

  return (
    <button
      type="button"
      onClick={() => {
        setClockMode((prev) => CLOCK_MODE_CYCLE[prev]);
      }}
      className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[var(--zf-surface-tertiary)] border border-[var(--zf-border-subtle)] hover:border-[var(--zf-border-medium)] text-[var(--zf-text-primary)] transition-colors cursor-pointer text-xs font-mono tabular-nums shadow-xs"
      title="24-Hour Operations Clock (Click to toggle UTC / Local / Dual)"
    >
      <Clock className="w-3.5 h-3.5 text-[var(--zf-brand-accent)] shrink-0" />
      {clockMode === 'UTC' && (
        <span className="font-semibold text-[var(--zf-text-primary)]">
          {utcTime24} <span className="text-[10px] text-[var(--zf-brand-accent)] font-bold">UTC</span>
        </span>
      )}
      {clockMode === 'LOCAL' && (
        <span className="font-semibold text-[var(--zf-text-primary)]">
          {localTime24} <span className="text-[10px] text-[var(--zf-text-muted)] font-bold">LOC</span>
        </span>
      )}
      {clockMode === 'DUAL' && (
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-[var(--zf-text-primary)]">
            {utcTime24} <span className="text-[10px] text-[var(--zf-brand-accent)] font-bold">UTC</span>
          </span>
          <span className="text-[var(--zf-text-muted)] hidden sm:inline">·</span>
          <span className="text-[var(--zf-text-secondary)] hidden sm:inline">
            {localTime24} <span className="text-[10px] text-[var(--zf-text-muted)] font-bold">LOC</span>
          </span>
        </div>
      )}
    </button>
  );
};
