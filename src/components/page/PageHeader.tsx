import type React from 'react';
import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description: string;
  actions?: ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, description, actions }) => (
  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#20242a]">
    <div>
      <h1 className="text-lg font-semibold text-zinc-100 tracking-tight">{title}</h1>
      <p className="text-xs text-zinc-400 mt-0.5">{description}</p>
    </div>

    {actions}
  </div>
);
