import { FileText } from 'lucide-react';
import type React from 'react';
import type { IndexedEvidencePcap } from '../command-palette.data';
import { PaletteResultRow } from '../PaletteResultRow';
import { PaletteSection } from '../PaletteSection';

interface EvidenceResultsProps {
  items: IndexedEvidencePcap[];
  onNavigate: (path: string) => void;
}

export const EvidenceResults: React.FC<EvidenceResultsProps> = ({ items, onNavigate }) => (
  <PaletteSection title="Evidence Records & Sealed PCAPs" matchCount={items.length} accentClassName="text-rose-400">
    {items.map((e) => (
      <PaletteResultRow key={e.evidenceId} onSelect={() => onNavigate('/evidence/vault')}>
        <div className="flex items-center gap-2 truncate">
          <FileText className="w-3.5 h-3.5 text-rose-400 shrink-0" />
          <span className="font-mono text-[11px] text-rose-300 font-semibold">{e.evidenceId}</span>
          <span className="font-mono text-[11px] text-zinc-300">{e.pcapId}</span>
          <span className="text-[10px] text-zinc-400 truncate">{e.desc}</span>
        </div>
      </PaletteResultRow>
    ))}
  </PaletteSection>
);
