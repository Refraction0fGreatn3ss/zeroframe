import type { FC, ReactNode } from 'react';

export const ChartSummaryBar: FC<{ children: ReactNode }> = ({ children }) => (
  <div className="flex items-center justify-between px-2.5 py-1.5 rounded bg-[var(--zf-surface-subtle)] border border-[var(--zf-border-subtle)] text-[11px] font-mono">
    {children}
  </div>
);
