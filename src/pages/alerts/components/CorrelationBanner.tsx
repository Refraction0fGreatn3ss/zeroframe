import { Layers } from 'lucide-react';
import type React from 'react';

export const CorrelationBanner: React.FC = () => (
  <div className="p-3 bg-[var(--zf-surface-subtle)] border border-[var(--zf-border-subtle)] rounded-md flex items-center justify-between text-xs">
    <div className="flex items-center gap-2">
      <Layers className="w-4 h-4 text-[var(--zf-brand-accent)] shrink-0" />
      <span className="text-[var(--zf-text-secondary)]">
        Alert Correlation Active: Repetitive authentication signals grouped into parent cluster{' '}
        <span className="font-mono font-semibold text-[var(--zf-text-primary)]">ALT-CLUSTER-0881</span>.
      </span>
    </div>
    <span className="text-[10px] font-mono text-emerald-400 shrink-0">
      34 signals correlated into 1 active investigation
    </span>
  </div>
);
