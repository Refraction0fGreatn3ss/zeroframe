import { ChevronRight } from 'lucide-react';
import type React from 'react';
import type { SecurityIncident } from '../../../types';
import { ThreatQueueRow } from './ThreatQueueRow';

interface PriorityThreatQueueProps {
  incidents: SecurityIncident[];
  onOpenWorkbench: () => void;
  onOpenIncident: (incidentId: string) => void;
  onExtractPcap: (incidentId: string) => void;
  onIsolateHost: (incidentId: string) => void;
}

export const PriorityThreatQueue: React.FC<PriorityThreatQueueProps> = ({
  incidents,
  onOpenWorkbench,
  onOpenIncident,
  onExtractPcap,
  onIsolateHost,
}) => (
  <div className="lg:col-span-8 bg-[#090d16] border border-slate-800/90 rounded flex flex-col overflow-hidden">
    <div className="p-3 bg-[#0d121f] border-b border-slate-800 flex items-center justify-between text-xs">
      <div className="flex items-center gap-2">
        <span className="font-semibold text-slate-100">Priority Threat Queue</span>
        <span className="text-slate-600">·</span>
        <span className="font-mono text-slate-400">{incidents.length} Multi-Stage Attacks Requiring Triage</span>
      </div>
      <button
        type="button"
        onClick={onOpenWorkbench}
        className="text-cyan-400 hover:text-cyan-300 font-mono text-[11px] flex items-center gap-1 cursor-pointer"
      >
        <span>Open Investigation Workbench</span>
        <ChevronRight className="w-3 h-3" />
      </button>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs font-mono">
        <thead className="bg-[#060911] border-b border-slate-800 text-slate-500 text-[10px] uppercase font-semibold">
          <tr>
            <th className="py-2.5 px-3">Severity</th>
            <th className="py-2.5 px-3">Case ID</th>
            <th className="py-2.5 px-3">Incident Description & Vector</th>
            <th className="py-2.5 px-3">Affected Asset</th>
            <th className="py-2.5 px-3">Primary MITRE</th>
            <th className="py-2.5 px-3 text-right">Quick Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60 text-slate-300 text-[11px]">
          {incidents.map((incident) => (
            <ThreatQueueRow
              key={incident.id}
              incident={incident}
              onOpen={onOpenIncident}
              onExtractPcap={onExtractPcap}
              onIsolateHost={onIsolateHost}
            />
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
