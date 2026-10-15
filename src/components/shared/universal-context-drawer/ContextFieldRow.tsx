import type React from 'react';

interface ContextFieldRowProps {
  label: string;
  children: React.ReactNode;
}

export const ContextFieldRow: React.FC<ContextFieldRowProps> = ({ label, children }) => (
  <div className="flex items-center justify-between">
    <span className="text-[10px] text-[var(--zf-text-muted)] uppercase">{label}</span>
    {children}
  </div>
);
