import type React from 'react';
import type { ContextItem } from '../../../stores/context-drawer-store';
import type { SecurityIncident } from '../../../types';
import type { IncidentState } from '../incidents.types';
import { AiAdvisoryPanel } from './AiAdvisoryPanel';
import { DetectionStateCard } from './DetectionStateCard';
import { DossierTitle } from './DossierTitle';
import { EntityContextBar } from './EntityContextBar';
import { ResponseActionRail } from './ResponseActionRail';

interface DossierHeaderProps {
  incident: SecurityIncident;
  assignee: string;
  onAssign: (operator: string) => void;
  onStateChange: (state: IncidentState) => void;
  onOpenContext: (item: ContextItem) => void;
  processKilled: boolean;
  isExtractingPcap: boolean;
  onRequestIsolation: () => void;
  onExtractPcap: () => void;
  onPivotToNetwork: () => void;
  onPivotToEntities: () => void;
}

export const DossierHeader: React.FC<DossierHeaderProps> = ({
  incident,
  assignee,
  onAssign,
  onStateChange,
  onOpenContext,
  processKilled,
  isExtractingPcap,
  onRequestIsolation,
  onExtractPcap,
  onPivotToNetwork,
  onPivotToEntities,
}) => (
  <div className="p-4 bg-[#0d121f] border-b border-slate-800 space-y-3">
    <DossierTitle incident={incident} assignee={assignee} onAssign={onAssign} onStateChange={onStateChange} />

    <p className="text-xs text-slate-300 font-sans leading-relaxed">{incident.plainEnglishSummary}</p>

    <EntityContextBar incident={incident} onOpenContext={onOpenContext} />

    <DetectionStateCard detectedAt={incident.firstSeen} />

    <AiAdvisoryPanel
      victimHostname={incident.primaryVictim.hostname}
      isExtractingPcap={isExtractingPcap}
      onPivotToNetwork={onPivotToNetwork}
      onPivotToEntities={onPivotToEntities}
      onExtractPcap={onExtractPcap}
    />

    <ResponseActionRail
      isContained={incident.state === 'CONTAINED'}
      processKilled={processKilled}
      isExtractingPcap={isExtractingPcap}
      onRequestIsolation={onRequestIsolation}
      onExtractPcap={onExtractPcap}
    />
  </div>
);
