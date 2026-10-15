import { Network } from 'lucide-react';
import type React from 'react';
import type { IndexedVlanSubnet } from '../command-palette.data';
import { PaletteResultRow } from '../PaletteResultRow';
import { PaletteSection } from '../PaletteSection';

interface VlanResultsProps {
  items: IndexedVlanSubnet[];
  onNavigate: (path: string) => void;
}

export const VlanResults: React.FC<VlanResultsProps> = ({ items, onNavigate }) => (
  <PaletteSection title="VLAN Enclaves & Subnets" matchCount={items.length} accentClassName="text-sky-400">
    {items.map((v) => (
      <PaletteResultRow key={v.vlan} onSelect={() => onNavigate('/investigate/hunt')}>
        <div className="flex items-center gap-2 truncate">
          <Network className="w-3.5 h-3.5 text-sky-400 shrink-0" />
          <span className="font-mono text-[11px] text-sky-300 font-semibold">{v.vlan}</span>
          <span className="font-mono text-[11px] text-zinc-300">{v.subnet}</span>
          <span className="text-[10px] text-zinc-400">[{v.site}]</span>
          <span className="text-[10px] text-zinc-500 truncate">{v.qinq}</span>
        </div>
      </PaletteResultRow>
    ))}
  </PaletteSection>
);
