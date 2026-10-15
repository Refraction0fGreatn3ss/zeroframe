import { Radio } from 'lucide-react';
import type React from 'react';
import type { IndexedNetworkFlow } from '../command-palette.data';
import { PaletteResultRow } from '../PaletteResultRow';
import { PaletteSection } from '../PaletteSection';

interface FlowResultsProps {
  items: IndexedNetworkFlow[];
  onNavigate: (path: string) => void;
}

export const FlowResults: React.FC<FlowResultsProps> = ({ items, onNavigate }) => (
  <PaletteSection title="Network Wire Flows" matchCount={items.length} accentClassName="text-cyan-400">
    {items.map((flw) => (
      <PaletteResultRow key={flw.flowId} onSelect={() => onNavigate('/investigate/hunt')}>
        <div className="flex items-center gap-2 truncate">
          <Radio className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span className="font-mono text-[11px] text-cyan-300 font-semibold">{flw.flowId}</span>
          <span className="font-mono text-[10px] text-zinc-400">{flw.proto}</span>
          <span className="truncate text-zinc-300">
            {flw.src} &rarr; {flw.dst}
          </span>
        </div>
      </PaletteResultRow>
    ))}
  </PaletteSection>
);
