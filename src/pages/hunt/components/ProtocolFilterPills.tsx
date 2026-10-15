import type React from 'react';
import { PROTOCOL_FILTERS } from '../hunt.data';
import type { ProtocolFilter } from '../hunt.types';

interface ProtocolFilterPillsProps {
  selectedProtocol: ProtocolFilter;
  onSelect: (protocol: ProtocolFilter) => void;
}

export const ProtocolFilterPills: React.FC<ProtocolFilterPillsProps> = ({ selectedProtocol, onSelect }) => (
  <div className="space-y-1 pt-1.5 border-t border-slate-800/80">
    <div className="flex items-center justify-between text-[11px] font-mono">
      <span className="text-slate-500 uppercase tracking-wider text-[10px]">Protocol Filter:</span>
      <span className="text-slate-500 text-[10px]">Filter by L4/L7 wire protocol</span>
    </div>
    <div className="flex flex-wrap items-center gap-1">
      {PROTOCOL_FILTERS.map((proto) => (
        <button
          key={proto}
          type="button"
          onClick={() => onSelect(proto)}
          className={`px-2.5 py-0.5 text-[11px] font-mono rounded transition-colors cursor-pointer ${
            selectedProtocol === proto
              ? 'bg-cyan-600 text-white font-semibold'
              : 'bg-[#090e18] border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
          }`}
        >
          {proto}
        </button>
      ))}
    </div>
  </div>
);
