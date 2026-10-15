import type React from 'react';
import type { AdminTab } from '../admin.data';
import { ADMIN_TAB_OPTIONS } from '../admin.data';

interface AdminTabNavProps {
  activeTab: AdminTab;
  onSelect: (tab: AdminTab) => void;
}

export const AdminTabNav: React.FC<AdminTabNavProps> = ({ activeTab, onSelect }) => (
  <div className="flex items-center gap-1.5 border-b border-[#20242a] pb-1 text-xs">
    {ADMIN_TAB_OPTIONS.map((tab) => (
      <button
        type="button"
        key={tab.id}
        onClick={() => onSelect(tab.id)}
        className={`px-3 py-1.5 rounded transition-colors cursor-pointer ${
          activeTab === tab.id
            ? 'bg-[#181c22] text-white font-medium border border-[#2b323c]'
            : 'text-zinc-400 hover:text-zinc-200'
        }`}
      >
        {tab.label}
      </button>
    ))}
  </div>
);
