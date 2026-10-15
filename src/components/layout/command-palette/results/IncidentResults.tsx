import { Shield } from 'lucide-react';
import type React from 'react';
import type { SecurityIncident } from '../../../../types';
import { PaletteResultRow } from '../PaletteResultRow';
import { PaletteSection } from '../PaletteSection';

interface IncidentResultsProps {
  items: SecurityIncident[];
  onNavigate: (path: string) => void;
}

export const IncidentResults: React.FC<IncidentResultsProps> = ({ items, onNavigate }) => (
  <PaletteSection title="Security Incidents">
    {items.map((inc) => (
      <PaletteResultRow key={inc.id} onSelect={() => onNavigate('/investigate/incidents')}>
        <div className="flex items-center gap-2 truncate">
          <Shield className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
          <span className="font-mono text-[11px] text-zinc-400">{inc.id}</span>
          <span className="truncate">{inc.title}</span>
        </div>
      </PaletteResultRow>
    ))}
  </PaletteSection>
);
