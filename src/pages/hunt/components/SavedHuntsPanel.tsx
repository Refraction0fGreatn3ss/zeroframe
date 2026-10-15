import { Bookmark, Trash2 } from 'lucide-react';
import type React from 'react';
import { CUSTOM_HUNT_ID_PREFIX } from '../hooks/use-saved-hunts';
import type { SavedHunt } from '../hunt.types';

interface SavedHuntsPanelProps {
  savedHunts: SavedHunt[];
  activeQuery: string;
  onSelect: (query: string) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
}

export const SavedHuntsPanel: React.FC<SavedHuntsPanelProps> = ({ savedHunts, activeQuery, onSelect, onDelete }) => (
  <div className="space-y-1.5 pt-1 border-t border-slate-800/80">
    <div className="flex items-center justify-between text-[11px] font-mono">
      <span className="text-slate-400 flex items-center gap-1.5 font-semibold uppercase tracking-wider">
        <Bookmark className="w-3 h-3 text-cyan-400" />
        <span>Saved Hunts ({savedHunts.length})</span>
      </span>
      <span className="text-slate-500 text-[10px]">Click any saved hunt to populate query</span>
    </div>
    <div className="flex flex-wrap items-center gap-1.5">
      {savedHunts.map((hunt) => (
        <div
          key={hunt.id}
          onClick={() => onSelect(hunt.query)}
          className={`px-2 py-1 text-[11px] font-mono rounded border flex items-center gap-1.5 transition-colors cursor-pointer group ${
            activeQuery === hunt.query
              ? 'bg-cyan-950/90 border-cyan-400 text-cyan-200 font-semibold shadow-xs'
              : 'bg-[#0b101c] border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
          }`}
          title={hunt.query}
        >
          <span>{hunt.label}</span>
          {hunt.id.startsWith(CUSTOM_HUNT_ID_PREFIX) && (
            <button
              type="button"
              onClick={(e) => onDelete(hunt.id, e)}
              className="text-slate-500 hover:text-rose-400 p-0.5 ml-0.5"
              title="Delete saved hunt"
            >
              <Trash2 className="w-2.5 h-2.5" />
            </button>
          )}
        </div>
      ))}
    </div>
  </div>
);
