import { ArrowRight } from 'lucide-react';
import type React from 'react';

interface SocDashboardHeaderProps {
  realtimeConnected: boolean;
  onViewIncidents: () => void;
}

export const SocDashboardHeader: React.FC<SocDashboardHeaderProps> = ({ realtimeConnected, onViewIncidents }) => (
  <div className="pb-3 border-b border-[var(--zf-border-subtle)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
    <div>
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-semibold text-[var(--zf-text-primary)] tracking-tight">Security Overview</h1>
        <span className="text-[11px] font-sans px-2 py-0.5 rounded bg-[var(--zf-surface-tertiary)] border border-[var(--zf-border-subtle)] text-[var(--zf-text-secondary)] font-medium">
          Simple SOC
        </span>
        {!realtimeConnected && (
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 font-semibold">
            STALE STREAM
          </span>
        )}
      </div>
      <p className="text-xs text-[var(--zf-text-muted)] mt-1">
        Operational answers in plain language based on verified network telemetry truth.
      </p>
    </div>

    <button
      type="button"
      onClick={onViewIncidents}
      className="px-3 py-1.5 rounded bg-[var(--zf-surface-card)] border border-[var(--zf-border-subtle)] hover:border-[var(--zf-border-medium)] text-[var(--zf-text-primary)] text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors"
    >
      <span>View Incident Details</span>
      <ArrowRight className="w-3.5 h-3.5 text-[var(--zf-brand-accent)]" />
    </button>
  </div>
);
