import type React from 'react';

export const WireTapStatus: React.FC = () => (
  <div className="flex items-center gap-2 text-xs">
    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[var(--zf-surface-subtle)] border border-[var(--zf-border-subtle)] font-mono text-[10px] text-cyan-400">
      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
      <span>10G WIRE TAP</span>
    </div>
    <span className="text-[var(--zf-text-muted)] text-[11px] hidden xl:inline">Enterprise NDR/XDR</span>
  </div>
);
