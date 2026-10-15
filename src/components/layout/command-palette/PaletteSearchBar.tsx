import { Search, X } from 'lucide-react';
import type React from 'react';

interface PaletteSearchBarProps {
  query: string;
  onQueryChange: (query: string) => void;
  onClose: () => void;
}

export const PaletteSearchBar: React.FC<PaletteSearchBarProps> = ({ query, onQueryChange, onClose }) => (
  <div className="p-3 border-b border-[#20242a] flex items-center gap-2.5">
    <Search className="w-4 h-4 text-zinc-400 shrink-0" />
    <input
      autoFocus
      type="text"
      value={query}
      onChange={(e) => onQueryChange(e.target.value)}
      placeholder="Search IP, MAC, hostname, user, email, incident, alert, sensor, VLAN, subnet, PCAP, or permit..."
      className="w-full bg-transparent text-xs text-zinc-100 focus:outline-hidden placeholder:text-zinc-500 font-sans"
    />
    <button type="button" onClick={onClose} className="text-zinc-500 hover:text-zinc-300 cursor-pointer">
      <X className="w-4 h-4" />
    </button>
  </div>
);
