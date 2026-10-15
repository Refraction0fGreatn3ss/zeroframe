import type React from 'react';

export const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--zf-text-muted)] block">
    {children}
  </span>
);
