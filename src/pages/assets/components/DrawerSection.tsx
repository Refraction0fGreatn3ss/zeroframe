import type { FC, ReactNode } from 'react';

interface DrawerSectionProps {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}

export const DrawerSection: FC<DrawerSectionProps> = ({ icon, title, children }) => (
  <div className="space-y-1.5">
    <span className="font-semibold text-zinc-300 block text-xs flex items-center gap-1.5">
      {icon}
      <span>{title}</span>
    </span>
    {children}
  </div>
);
