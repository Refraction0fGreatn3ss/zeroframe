import { Bookmark, Search, Terminal } from 'lucide-react';
import type React from 'react';

interface HuntQueryBarProps {
  query: string;
  onQueryChange: (query: string) => void;
  onToggleSave: () => void;
}

export const HuntQueryBar: React.FC<HuntQueryBarProps> = ({ query, onQueryChange, onToggleSave }) => (
  <>
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
        <Terminal className="w-3.5 h-3.5 text-cyan-400" />
        <span>Berkeley Packet Filter (BPF) & L7 Wire Search Query</span>
      </div>
      <span className="text-[11px] font-mono text-slate-500">
        Click any chart bar or quadrant entity below to auto-inject filter
      </span>
    </div>

    <div className="flex items-center gap-2">
      <div className="relative flex-1">
        <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          className="w-full pl-8 pr-3 py-1.5 bg-[#060911] border border-slate-800 rounded font-mono text-xs text-slate-200 focus:outline-hidden focus:border-cyan-500/60 placeholder:text-slate-600"
          placeholder='e.g. proto=TCP AND dst_port=443 AND ja4="t13d*"'
        />
      </div>
      <button
        type="button"
        className="px-4 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs cursor-pointer transition-colors shadow-xs"
      >
        Execute Hunt
      </button>
      <button
        type="button"
        onClick={onToggleSave}
        className="px-3 py-1.5 rounded bg-[#101726] hover:bg-[#18233c] border border-cyan-800/40 text-cyan-300 font-medium text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
        title="Save current query to Saved Hunts repository"
      >
        <Bookmark className="w-3.5 h-3.5 text-cyan-400" />
        <span>Save Query</span>
      </button>
    </div>
  </>
);
