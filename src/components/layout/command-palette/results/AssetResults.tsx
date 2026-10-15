import { Laptop } from 'lucide-react';
import type React from 'react';
import type { LivingEntity } from '../../../../types';
import { PaletteResultRow } from '../PaletteResultRow';
import { PaletteSection } from '../PaletteSection';

interface AssetResultsProps {
  items: LivingEntity[];
  onNavigate: (path: string) => void;
}

export const AssetResults: React.FC<AssetResultsProps> = ({ items, onNavigate }) => (
  <PaletteSection title={`Assets & Hostnames (${items.length})`}>
    {items.map((ent) => (
      <PaletteResultRow key={ent.id} onSelect={() => onNavigate('/investigate/assets')}>
        <div className="flex items-center gap-2">
          <Laptop className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
          <span className="font-medium text-zinc-200">{ent.hostname}</span>
          <span className="font-mono text-[11px] text-zinc-400">{ent.currentIp}</span>
          <span className="font-mono text-[10px] text-zinc-500">{ent.mac}</span>
        </div>
      </PaletteResultRow>
    ))}
  </PaletteSection>
);
