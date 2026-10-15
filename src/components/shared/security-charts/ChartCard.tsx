import type { FC, ReactNode } from 'react';

interface ChartCardProps {
  bare: boolean;
  className: string;
  children: ReactNode;
}

export const ChartCard: FC<ChartCardProps> = ({ bare, className, children }) => {
  const content = <div className="flex flex-col h-full justify-between space-y-3 font-sans">{children}</div>;

  if (bare) {
    return <div className={className}>{content}</div>;
  }

  return (
    <div
      className={`p-4 rounded-lg bg-[var(--zf-surface-card)] border border-[var(--zf-border-medium)] flex flex-col justify-between h-full ${className}`}
    >
      {content}
    </div>
  );
};
