import type { FC, ReactNode } from 'react';

export const REPORT_SECTION_LABEL_CLASS =
  'text-[10px] font-semibold text-[var(--zf-brand-accent)] uppercase tracking-wider';

export const ReportSection: FC<{ title: string; children: ReactNode }> = ({ title, children }) => (
  <div className="space-y-2">
    <span className={`${REPORT_SECTION_LABEL_CLASS} block`}>{title}</span>
    {children}
  </div>
);
