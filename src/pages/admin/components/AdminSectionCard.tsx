import type React from 'react';
import type { ReactNode } from 'react';

interface AdminSectionCardProps {
  title: string;
  children: ReactNode;
}

export const AdminSectionCard: React.FC<AdminSectionCardProps> = ({ title, children }) => (
  <div className="bg-[#101215] border border-[#20242a] rounded p-4 text-xs space-y-3 font-sans">
    <h3 className="font-semibold text-zinc-200 text-xs">{title}</h3>
    {children}
  </div>
);
