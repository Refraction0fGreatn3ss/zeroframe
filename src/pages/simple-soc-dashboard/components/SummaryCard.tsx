import type React from 'react';
import type { ReactNode } from 'react';

interface SummaryCardProps {
  label: string;
  valueClassName: string;
  value: ReactNode;
  description: ReactNode;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ label, valueClassName, value, description }) => (
  <div className="p-4 rounded bg-[var(--zf-surface-card)] border border-[var(--zf-border-subtle)] space-y-1.5 shadow-xs">
    <span className="text-[11px] font-semibold text-[var(--zf-text-muted)] uppercase tracking-wider block">
      {label}
    </span>
    <div className={valueClassName}>{value}</div>
    <p className="text-xs text-[var(--zf-text-muted)] leading-relaxed">{description}</p>
  </div>
);
