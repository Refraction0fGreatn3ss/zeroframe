import type React from 'react';
import { timeAgo } from '../../../lib/utils';
import type { SecurityIncident } from '../../../types';
import { getPrimaryTechnique, getSeverityDotClass, getSeverityTextClass } from '../incidents.utils';

interface IncidentQueueItemProps {
  incident: SecurityIncident;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export const IncidentQueueItem: React.FC<IncidentQueueItemProps> = ({ incident, isSelected, onSelect }) => (
  <div
    onClick={() => onSelect(incident.id)}
    className={`p-3 cursor-pointer transition-colors text-xs font-mono space-y-1.5 ${
      isSelected ? 'bg-[#101728] border-l-2 border-cyan-400 text-slate-100' : 'hover:bg-slate-800/30 text-slate-300'
    }`}
  >
    <div className="flex items-center justify-between text-[11px]">
      <div className="flex items-center gap-2">
        <span className={`font-semibold flex items-center gap-1.5 ${getSeverityTextClass(incident.severity)}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${getSeverityDotClass(incident.severity)}`} />
          <span>{incident.severity}</span>
        </span>
        <span className="text-slate-600">·</span>
        <span className="text-slate-400 font-bold">{incident.id}</span>
      </div>
      <span className="text-[10px] text-slate-500">{timeAgo(incident.firstSeen)}</span>
    </div>

    <div className="font-sans font-semibold text-xs text-slate-100 truncate">{incident.title}</div>

    <div className="flex items-center justify-between text-[11px] text-slate-400">
      <span className="truncate">{incident.primaryVictim.hostname}</span>
      <span className="text-slate-500">{incident.primaryVictim.ip}</span>
    </div>

    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-800/40">
      <span>{getPrimaryTechnique(incident)}</span>
      <span className="text-emerald-400 font-medium">{incident.confidenceScore}% Confidence</span>
    </div>
  </div>
);
