import type React from 'react';

interface ContextStatTileProps {
  label: string;
  valueClassName: string;
  children: React.ReactNode;
}

export const ContextStatTile: React.FC<ContextStatTileProps> = ({ label, valueClassName, children }) => (
  <div className="p-2.5 rounded bg-[var(--zf-surface-subtle)] border border-[var(--zf-border-subtle)]">
    <span className="text-[10px] text-[var(--zf-text-muted)] uppercase block">{label}</span>
    <span className={valueClassName}>{children}</span>
  </div>
);
