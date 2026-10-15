import type React from 'react';
import { AdminSectionCard } from './AdminSectionCard';

export const SessionsPanel: React.FC = () => (
  <AdminSectionCard title="Active Operator Sessions">
    <div className="space-y-2">
      <div className="p-3 bg-[#131518] rounded border border-[#20242a] flex justify-between items-center">
        <div>
          <span className="font-medium text-zinc-100">Aria Vesper (Administrator)</span>
          <div className="text-[11px] text-zinc-400">IP: 10.140.0.99 · Browser: Chrome / Linux x86_64</div>
        </div>
        <span className="text-emerald-400 text-xs font-medium">Current Active Session</span>
      </div>
    </div>
  </AdminSectionCard>
);
