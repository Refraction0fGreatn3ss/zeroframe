import type React from 'react';

interface CorrelationToggleProps {
  enabled: boolean;
  onToggle: () => void;
}

export const CorrelationToggle: React.FC<CorrelationToggleProps> = ({ enabled, onToggle }) => (
  <div className="flex items-center gap-2 text-xs">
    <span className="text-[var(--zf-text-muted)]">Correlated Clustering:</span>
    <button
      type="button"
      onClick={onToggle}
      className={`px-2.5 py-1 rounded border text-xs font-medium cursor-pointer transition-colors ${
        enabled
          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
          : 'bg-[var(--zf-surface-tertiary)] border-[var(--zf-border-subtle)] text-[var(--zf-text-muted)]'
      }`}
    >
      {enabled ? 'Enabled (Fatigue Reduction)' : 'Raw (Uncorrelated)'}
    </button>
  </div>
);
