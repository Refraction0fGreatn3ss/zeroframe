import type React from 'react';
import type { ReactNode } from 'react';

interface SnapshotStatProps {
  label: string;
  value: ReactNode;
}

export const SnapshotStat: React.FC<SnapshotStatProps> = ({ label, value }) => (
  <div className="p-3 bg-[#131518] rounded border border-[#20242a]">
    <span className="text-zinc-500 text-[10px] block font-medium">{label}</span>
    <div className="font-mono text-sm font-semibold text-zinc-200 mt-0.5">{value}</div>
  </div>
);
