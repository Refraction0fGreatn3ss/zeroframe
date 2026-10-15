import { ChevronRight, type LucideIcon } from 'lucide-react';
import type { FC, ReactNode } from 'react';

interface TruthSegmentProps {
  label: string;
  icon: LucideIcon;
  iconColorClassName: string;
  borderClassName: string;
  isStale: boolean;
  onClick: () => void;
  children: ReactNode;
}

export const TruthSegment: FC<TruthSegmentProps> = ({
  label,
  icon: Icon,
  iconColorClassName,
  borderClassName,
  isStale,
  onClick,
  children,
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex items-center justify-between p-2 rounded bg-[var(--zf-surface-card)] hover:bg-[var(--zf-surface-card-hover)] border text-left transition-colors cursor-pointer group ${borderClassName}`}
  >
    <div className="space-y-0.5 min-w-0">
      <div className="flex items-center gap-1.5 text-[10px] font-semibold text-[var(--zf-text-muted)] uppercase tracking-wider">
        <Icon className={`w-3 h-3 shrink-0 ${iconColorClassName}`} />
        <span>{label}</span>
        {isStale && <span className="text-[9px] font-mono text-amber-400 font-normal">STALE</span>}
      </div>
      {children}
    </div>
    <ChevronRight className="w-3.5 h-3.5 text-[var(--zf-text-muted)] opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
  </button>
);

export const TruthSegmentHeadline: FC<{ dotClassName: string; children: ReactNode }> = ({ dotClassName, children }) => (
  <div className="flex items-center gap-1.5 font-semibold text-xs text-[var(--zf-text-primary)]">
    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotClassName}`} />
    <span>{children}</span>
  </div>
);

export const TruthSegmentCaption: FC<{ children: ReactNode }> = ({ children }) => (
  <div className="text-[10px] text-[var(--zf-text-secondary)] truncate">{children}</div>
);
