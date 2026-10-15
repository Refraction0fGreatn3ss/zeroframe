import { ChevronRight } from 'lucide-react';
import type React from 'react';

interface ContextLinkButtonProps {
  onClick: () => void;
  /** Extra classes appended after the shared link styles. */
  className?: string;
  trailing?: React.ReactNode;
  children: React.ReactNode;
}

const BASE_CLASS =
  'w-full p-2.5 rounded bg-[var(--zf-surface-card)] hover:bg-[var(--zf-surface-card-hover)] border border-[var(--zf-border-subtle)] text-left flex items-center justify-between cursor-pointer group';

export const ContextLinkButton: React.FC<ContextLinkButtonProps> = ({ onClick, className, trailing, children }) => (
  <button type="button" onClick={onClick} className={className ? `${BASE_CLASS} ${className}` : BASE_CLASS}>
    {children}
    {trailing ?? (
      <ChevronRight className="w-3.5 h-3.5 text-[var(--zf-text-muted)] group-hover:translate-x-0.5 transition-transform" />
    )}
  </button>
);
