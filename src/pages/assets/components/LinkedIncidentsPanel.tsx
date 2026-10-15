import { ExternalLink, ShieldAlert } from 'lucide-react';
import type { FC } from 'react';

interface LinkedIncidentsPanelProps {
  incidentIds: string[];
  onPivotToIncident: () => void;
}

export const LinkedIncidentsPanel: FC<LinkedIncidentsPanelProps> = ({ incidentIds, onPivotToIncident }) => (
  <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded space-y-1.5">
    <div className="flex items-center gap-2 text-rose-400 font-semibold text-xs">
      <ShieldAlert className="w-4 h-4" />
      <span>Linked Active Security Incidents</span>
    </div>
    {incidentIds.map((incId) => (
      <div key={incId} className="flex items-center justify-between font-mono text-[11px]">
        <span className="text-rose-300 font-bold">{incId}</span>
        <button
          type="button"
          onClick={onPivotToIncident}
          className="text-xs text-rose-400 underline hover:text-rose-200 cursor-pointer flex items-center gap-1"
        >
          <span>Pivot to Dossier</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>
    ))}
  </div>
);
