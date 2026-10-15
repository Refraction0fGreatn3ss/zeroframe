import { Lock } from 'lucide-react';
import type React from 'react';
import type { IndexedPermit } from '../command-palette.data';
import { PaletteResultRow } from '../PaletteResultRow';
import { PaletteSection } from '../PaletteSection';

interface PermitResultsProps {
  items: IndexedPermit[];
  onNavigate: (path: string) => void;
}

export const PermitResults: React.FC<PermitResultsProps> = ({ items, onNavigate }) => (
  <PaletteSection
    title="Governed Response Permits & Quarantine"
    matchCount={items.length}
    accentClassName="text-orange-400"
  >
    {items.map((p) => (
      <PaletteResultRow
        key={p.permitId}
        onSelect={() => onNavigate('/respond/permits')}
        trailing={
          <span className="text-[10px] font-mono text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">
            {p.status}
          </span>
        }
      >
        <div className="flex items-center gap-2 truncate">
          <Lock className="w-3.5 h-3.5 text-orange-400 shrink-0" />
          <span className="font-mono text-[11px] text-orange-300 font-semibold">{p.permitId}</span>
          <span className="font-mono text-[10px] text-zinc-300 font-medium">{p.action}</span>
          <span className="font-mono text-[10px] text-zinc-400 truncate">Target: {p.target}</span>
        </div>
      </PaletteResultRow>
    ))}
  </PaletteSection>
);
