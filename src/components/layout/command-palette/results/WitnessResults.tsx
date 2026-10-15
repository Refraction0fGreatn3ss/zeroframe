import { FileCheck } from 'lucide-react';
import type React from 'react';
import type { IndexedWitnessTransaction } from '../command-palette.data';
import { PaletteResultRow } from '../PaletteResultRow';
import { PaletteSection } from '../PaletteSection';

interface WitnessResultsProps {
  items: IndexedWitnessTransaction[];
  onNavigate: (path: string) => void;
}

export const WitnessResults: React.FC<WitnessResultsProps> = ({ items, onNavigate }) => (
  <PaletteSection title="Witness Consensus Transactions" matchCount={items.length} accentClassName="text-purple-400">
    {items.map((w) => (
      <PaletteResultRow
        key={w.txId}
        onSelect={() => onNavigate('/evidence/witness')}
        trailing={<span className="font-mono text-[10px] text-zinc-500">Block #{w.blockNumber}</span>}
      >
        <div className="flex items-center gap-2 truncate">
          <FileCheck className="w-3.5 h-3.5 text-purple-400 shrink-0" />
          <span className="font-mono text-[11px] text-purple-300 font-semibold">{w.txId}</span>
          <span className="text-[10px] text-zinc-400 truncate">{w.type}</span>
        </div>
      </PaletteResultRow>
    ))}
  </PaletteSection>
);
