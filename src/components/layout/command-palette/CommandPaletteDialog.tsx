import type React from 'react';
import { useMemo } from 'react';
import type { LivingEntity, SecurityIncident } from '../../../types';
import type { QuickAction } from './command-palette.data';
import { searchCommandIndex } from './command-palette.utils';
import { PaletteSearchBar } from './PaletteSearchBar';
import { AssetResults } from './results/AssetResults';
import { EvidenceResults } from './results/EvidenceResults';
import { FlowResults } from './results/FlowResults';
import { IncidentResults } from './results/IncidentResults';
import { PermitResults } from './results/PermitResults';
import { QuickActions } from './results/QuickActions';
import { SensorResults } from './results/SensorResults';
import { UserResults } from './results/UserResults';
import { VlanResults } from './results/VlanResults';
import { WitnessResults } from './results/WitnessResults';

interface CommandPaletteDialogProps {
  query: string;
  onQueryChange: (query: string) => void;
  incidents: SecurityIncident[];
  entities: LivingEntity[];
  onNavigate: (path: string) => void;
  onRunQuickAction: (action: QuickAction) => void;
  onClose: () => void;
}

export const CommandPaletteDialog: React.FC<CommandPaletteDialogProps> = ({
  query,
  onQueryChange,
  incidents,
  entities,
  onNavigate,
  onRunQuickAction,
  onClose,
}) => {
  const results = useMemo(() => searchCommandIndex(query, incidents, entities), [query, incidents, entities]);
  // Static index sections only appear once the operator has typed something.
  const hasQuery = query.trim() !== '';

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 p-4 bg-black/70 font-sans">
      <div className="bg-[#0e1013] border border-[#23272e] rounded-lg max-w-lg w-full text-[#e6edf3] shadow-2xl overflow-hidden animate-in fade-in-50 zoom-in-95 duration-100">
        <PaletteSearchBar query={query} onQueryChange={onQueryChange} onClose={onClose} />

        <div className="max-h-80 overflow-y-auto p-1.5 divide-y divide-[#181b20] text-xs">
          {results.incidents.length > 0 && <IncidentResults items={results.incidents} onNavigate={onNavigate} />}
          {results.entities.length > 0 && <AssetResults items={results.entities} onNavigate={onNavigate} />}
          {results.users.length > 0 && hasQuery && <UserResults items={results.users} onNavigate={onNavigate} />}
          {results.flows.length > 0 && hasQuery && <FlowResults items={results.flows} onNavigate={onNavigate} />}
          {results.sensors.length > 0 && hasQuery && <SensorResults items={results.sensors} onNavigate={onNavigate} />}
          {results.vlans.length > 0 && hasQuery && <VlanResults items={results.vlans} onNavigate={onNavigate} />}
          {results.evidencePcaps.length > 0 && hasQuery && (
            <EvidenceResults items={results.evidencePcaps} onNavigate={onNavigate} />
          )}
          {results.permits.length > 0 && hasQuery && <PermitResults items={results.permits} onNavigate={onNavigate} />}
          {results.witness.length > 0 && hasQuery && <WitnessResults items={results.witness} onNavigate={onNavigate} />}
          <QuickActions onRunAction={onRunQuickAction} />
        </div>

        <div className="p-2.5 bg-[#0a0c0e] border-t border-[#20242a] text-[10px] text-zinc-500 flex items-center justify-between">
          <span>Search assets, incidents, and detection controls</span>
          <span>ESC to dismiss</span>
        </div>
      </div>
    </div>
  );
};
