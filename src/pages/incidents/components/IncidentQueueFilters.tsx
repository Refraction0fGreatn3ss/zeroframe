import { Search } from 'lucide-react';
import type React from 'react';
import { SEVERITY_FILTER_OPTIONS } from '../incidents.data';
import type { SeverityFilter } from '../incidents.types';

interface IncidentQueueFiltersProps {
  searchFilter: string;
  onSearchChange: (value: string) => void;
  severityFilter: SeverityFilter;
  onSeverityChange: (severity: SeverityFilter) => void;
}

export const IncidentQueueFilters: React.FC<IncidentQueueFiltersProps> = ({
  searchFilter,
  onSearchChange,
  severityFilter,
  onSeverityChange,
}) => (
  <div className="p-3 bg-[#0d121f] border-b border-slate-800 space-y-2.5">
    <div className="relative">
      <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
      <input
        type="text"
        placeholder="Search by case ID, host, or vector..."
        value={searchFilter}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full bg-[#060911] border border-slate-800 rounded pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-cyan-500"
      />
    </div>

    <div className="flex items-center bg-[#060911] border border-slate-800 rounded p-0.5 text-[11px] font-mono">
      {SEVERITY_FILTER_OPTIONS.map((sev) => (
        <button
          key={sev}
          type="button"
          onClick={() => onSeverityChange(sev)}
          className={`flex-1 py-1 text-center rounded transition-colors cursor-pointer ${
            severityFilter === sev
              ? 'bg-slate-800 text-slate-100 font-semibold shadow-xs'
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          {sev}
        </button>
      ))}
    </div>
  </div>
);
