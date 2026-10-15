import type { FC } from 'react';
import type { AssetCategoryFilter } from '../assets.types';
import { getCategoryFilterTabs } from '../assets.utils';

interface AssetFilterBarProps {
  totalCount: number;
  categoryFilter: AssetCategoryFilter;
  onCategoryChange: (filter: AssetCategoryFilter) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export const AssetFilterBar: FC<AssetFilterBarProps> = ({
  totalCount,
  categoryFilter,
  onCategoryChange,
  searchTerm,
  onSearchChange,
}) => (
  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#0d1014] p-2.5 rounded border border-[#20242a]">
    <div className="flex items-center gap-1.5 flex-wrap">
      {getCategoryFilterTabs(totalCount).map((tab) => (
        <button
          type="button"
          key={tab.id}
          onClick={() => onCategoryChange(tab.id)}
          className={`px-2.5 py-1 text-xs rounded font-medium transition-colors cursor-pointer ${
            categoryFilter === tab.id
              ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40'
              : 'bg-transparent text-zinc-400 hover:text-zinc-200 border border-transparent hover:border-slate-800'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>

    <div className="flex items-center gap-2">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Filter hostname, IP, MAC, protocol (e.g. Modbus, ONVIF)..."
        className="w-full sm:w-72 bg-[#14171d] border border-slate-800 rounded px-2.5 py-1 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-hidden focus:border-cyan-500"
      />
    </div>
  </div>
);
