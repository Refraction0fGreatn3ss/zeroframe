import type React from 'react';
import type { SecurityIncident } from '../../../types';
import type { IncidentState } from '../incidents.types';
import { getSeverityDotClass, getSeverityTextClass } from '../incidents.utils';
import { AssigneeSelect } from './AssigneeSelect';
import { IncidentStateSelect } from './IncidentStateSelect';

interface DossierTitleProps {
  incident: SecurityIncident;
  assignee: string;
  onAssign: (operator: string) => void;
  onStateChange: (state: IncidentState) => void;
}

export const DossierTitle: React.FC<DossierTitleProps> = ({ incident, assignee, onAssign, onStateChange }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
    <div className="space-y-1">
      <div className="flex items-center gap-2 text-xs font-mono">
        <span className={`font-semibold flex items-center gap-1.5 ${getSeverityTextClass(incident.severity)}`}>
          <span className={`w-2 h-2 rounded-full ${getSeverityDotClass(incident.severity)}`} />
          <span>{incident.severity} THREAT</span>
        </span>
        <span className="text-slate-600">·</span>
        <span className="text-slate-400">{incident.id}</span>
        <span className="text-slate-600">·</span>
        <span className="text-emerald-400">{incident.confidenceScore}% Verified</span>
      </div>

      <h2 className="text-base font-bold text-slate-100 font-sans tracking-tight">{incident.title}</h2>
    </div>

    <div className="flex flex-wrap items-center gap-2 shrink-0">
      <AssigneeSelect assignee={assignee} onAssign={onAssign} />
      <IncidentStateSelect state={incident.state} onChange={onStateChange} />
    </div>
  </div>
);
