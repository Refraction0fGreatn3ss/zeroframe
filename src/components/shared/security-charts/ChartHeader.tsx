import type { FC, ReactNode } from 'react';

interface ChartHeaderProps {
  title: string;
  subtitle: string;
  accentDotClassName: string;
  children: ReactNode;
}

export const ChartHeader: FC<ChartHeaderProps> = ({ title, subtitle, accentDotClassName, children }) => (
  <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-[var(--zf-border-subtle)]">
    <div className="min-w-0">
      <div className="flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${accentDotClassName}`} />
        <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--zf-text-primary)]">{title}</h2>
      </div>
      <p className="text-[11px] text-[var(--zf-text-muted)] truncate mt-0.5">{subtitle}</p>
    </div>

    {children}
  </div>
);
