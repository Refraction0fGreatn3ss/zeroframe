import { Download, ShieldAlert } from 'lucide-react';
import type React from 'react';
import type { SecurityIncident } from '../../../types';
import {
  getIncidentSeverityDotClass,
  getIncidentSeverityTextClass,
  getPrimaryTechnique,
} from '../command-center.utils';

interface ThreatQueueRowProps {
  incident: SecurityIncident;
  onOpen: (incidentId: string) => void;
  onExtractPcap: (incidentId: string) => void;
  onIsolateHost: (incidentId: string) => void;
}

export const ThreatQueueRow: React.FC<ThreatQueueRowProps> = ({ incident, onOpen, onExtractPcap, onIsolateHost }) => (
  <tr onClick={() => onOpen(incident.id)} className="hover:bg-slate-800/30 transition-colors cursor-pointer group">
    <td className="py-3 px-3 whitespace-nowrap">
      <span
        className={`font-semibold text-[11px] flex items-center gap-1.5 ${getIncidentSeverityTextClass(incident.severity)}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${getIncidentSeverityDotClass(incident.severity)}`} />
        <span>{incident.severity}</span>
      </span>
    </td>

    <td className="py-3 px-3 whitespace-nowrap font-bold text-slate-200 group-hover:text-cyan-300">{incident.id}</td>

    <td className="py-3 px-3">
      <div className="font-semibold text-slate-100 group-hover:text-cyan-300 font-sans text-xs">{incident.title}</div>
      <div className="text-[11px] text-slate-500 truncate max-w-sm mt-0.5">{incident.plainEnglishSummary}</div>
    </td>

    <td className="py-3 px-3 whitespace-nowrap">
      <div className="text-slate-200">{incident.primaryVictim.hostname}</div>
      <div className="text-[10px] text-slate-500">
        {incident.primaryVictim.ip} · {incident.primaryVictim.criticality}
      </div>
    </td>

    <td className="py-3 px-3 whitespace-nowrap text-cyan-300 text-[11px]">{getPrimaryTechnique(incident)}</td>

    <td className="py-3 px-3 text-right whitespace-nowrap">
      <div className="flex items-center justify-end gap-1.5">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onExtractPcap(incident.id);
          }}
          className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-300 transition-colors"
          title="Extract targeted PCAP"
        >
          <Download className="w-3 h-3" />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onIsolateHost(incident.id);
          }}
          className="p-1.5 rounded bg-rose-950/60 hover:bg-rose-900/60 border border-rose-500/30 text-rose-300 transition-colors"
          title="Isolate host from network"
        >
          <ShieldAlert className="w-3 h-3" />
        </button>
      </div>
    </td>
  </tr>
);
