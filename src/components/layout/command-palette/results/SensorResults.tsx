import { Cpu } from 'lucide-react';
import type React from 'react';
import type { IndexedSensorInterface } from '../command-palette.data';
import { PaletteResultRow } from '../PaletteResultRow';
import { PaletteSection } from '../PaletteSection';

interface SensorResultsProps {
  items: IndexedSensorInterface[];
  onNavigate: (path: string) => void;
}

export const SensorResults: React.FC<SensorResultsProps> = ({ items, onNavigate }) => (
  <PaletteSection title="Sensor Interfaces & Fleet TAPs" matchCount={items.length} accentClassName="text-emerald-400">
    {items.map((s) => (
      <PaletteResultRow
        key={s.id}
        onSelect={() => onNavigate('/fleet/sensors')}
        trailing={<span className="font-mono text-[10px] text-zinc-500">{s.rate}</span>}
      >
        <div className="flex items-center gap-2 truncate">
          <Cpu className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="font-mono text-[11px] text-emerald-300 font-semibold">{s.id}</span>
          <span className="text-zinc-400 text-[10px]">[{s.site}]</span>
          <span className="truncate text-zinc-300">{s.type}</span>
        </div>
      </PaletteResultRow>
    ))}
  </PaletteSection>
);
