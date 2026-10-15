import { Search } from 'lucide-react';
import type React from 'react';

interface CommandSearchButtonProps {
  onOpen: () => void;
}

export const CommandSearchButton: React.FC<CommandSearchButtonProps> = ({ onOpen }) => (
  <div className="flex-1 max-w-sm lg:max-w-md mx-3 hidden md:block">
    <button
      type="button"
      onClick={onOpen}
      className="w-full h-8 px-3 rounded bg-[var(--zf-surface-subtle)] border border-[var(--zf-border-subtle)] hover:border-slate-700 text-[var(--zf-text-muted)] flex items-center justify-between text-xs cursor-pointer transition-colors group"
    >
      <div className="flex items-center gap-2 truncate">
        <Search className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition-colors shrink-0" />
        <span className="text-slate-500 group-hover:text-slate-300 transition-colors truncate">
          Search entities, IP, alerts, hunt, SCADA...
        </span>
      </div>
      <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono rounded bg-[var(--zf-surface-tertiary)] border border-[var(--zf-border-subtle)] text-slate-400 shrink-0">
        ⌘K
      </kbd>
    </button>
  </div>
);
