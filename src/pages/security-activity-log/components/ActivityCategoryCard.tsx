import type { LucideIcon } from 'lucide-react';
import type React from 'react';
import type { ReactNode } from 'react';

export interface ActivityCategoryCardProps {
  icon: LucideIcon;
  iconToneClassName: string;
  title: string;
  tag: string;
  tagClassName: string;
  value: number;
  valueToneClassName: string;
  aside: ReactNode;
  footer: string;
  hoverBorderClassName: string;
  onSelect: () => void;
}

export const ActivityCategoryCard: React.FC<ActivityCategoryCardProps> = ({
  icon: Icon,
  iconToneClassName,
  title,
  tag,
  tagClassName,
  value,
  valueToneClassName,
  aside,
  footer,
  hoverBorderClassName,
  onSelect,
}) => (
  <div
    onClick={onSelect}
    className={`p-3.5 bg-[var(--zf-surface-card)] border border-[var(--zf-border-subtle)] ${hoverBorderClassName} rounded flex flex-col justify-between cursor-pointer transition-all shadow-xs`}
  >
    <div className="flex items-center justify-between text-xs text-[var(--zf-text-secondary)] font-medium">
      <span className="flex items-center gap-1.5">
        <Icon className={`w-3.5 h-3.5 ${iconToneClassName}`} />
        <span>{title}</span>
      </span>
      <span className={tagClassName}>{tag}</span>
    </div>
    <div className="my-1.5 flex items-baseline gap-2">
      <div className={`text-2xl font-mono font-bold ${valueToneClassName} tabular-nums`}>{value}</div>
      {aside}
    </div>
    <div className="text-[11px] text-[var(--zf-text-muted)] font-mono">{footer}</div>
  </div>
);
