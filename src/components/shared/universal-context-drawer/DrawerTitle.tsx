import type React from 'react';

interface DrawerTitleProps {
  title: string;
  subtitle?: string;
}

export const DrawerTitle: React.FC<DrawerTitleProps> = ({ title, subtitle }) => (
  <div className="px-5 py-4 border-b border-[var(--zf-border-subtle)] bg-[var(--zf-surface-card)]">
    <h2 className="text-base font-semibold text-[var(--zf-text-primary)] tracking-tight break-all">{title}</h2>
    {subtitle && <p className="text-xs text-[var(--zf-text-muted)] mt-0.5 font-mono">{subtitle}</p>}
  </div>
);
