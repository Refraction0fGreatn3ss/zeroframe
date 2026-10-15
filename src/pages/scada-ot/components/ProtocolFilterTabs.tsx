import type { FC } from 'react';
import { PROTOCOL_FILTERS } from '../scada-ot.data';
import type { ProtocolFilter } from '../scada-ot.types';

interface ProtocolFilterTabsProps {
  activeFilter: ProtocolFilter;
  onFilterChange: (filter: ProtocolFilter) => void;
}

export const ProtocolFilterTabs: FC<ProtocolFilterTabsProps> = ({ activeFilter, onFilterChange }) => (
  <div className="flex items-center gap-1 bg-[#060911] border border-slate-800 rounded p-0.5 text-[10px]">
    {PROTOCOL_FILTERS.map((f) => (
      <button
        key={f}
        type="button"
        onClick={() => onFilterChange(f)}
        className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
          activeFilter === f ? 'bg-slate-800 text-cyan-300 font-bold' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        {f}
      </button>
    ))}
  </div>
);
