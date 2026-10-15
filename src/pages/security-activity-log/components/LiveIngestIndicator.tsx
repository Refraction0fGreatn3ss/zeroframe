import type React from 'react';

export const LiveIngestIndicator: React.FC = () => (
  <span className="text-[11px] font-mono text-emerald-400 font-semibold flex items-center gap-1">
    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
    Live Ingesting
  </span>
);
