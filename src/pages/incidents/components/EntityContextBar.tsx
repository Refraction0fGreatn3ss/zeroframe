import { Activity, Radio, Server } from 'lucide-react';
import type React from 'react';
import type { ContextItem } from '../../../stores/context-drawer-store';
import type { SecurityIncident } from '../../../types';
import { FALLBACK_C2_COUNTRY, FALLBACK_C2_IP } from '../incidents.data';

interface EntityContextBarProps {
  incident: SecurityIncident;
  onOpenContext: (item: ContextItem) => void;
}

export const EntityContextBar: React.FC<EntityContextBarProps> = ({ incident, onOpenContext }) => (
  <div className="p-2.5 rounded bg-[#060911] border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
    <div className="flex items-center gap-2 text-slate-400">
      <Server className="w-3.5 h-3.5 text-cyan-400" />
      <span>Victim Host:</span>
      <button
        type="button"
        onClick={() =>
          onOpenContext({
            type: 'ASSET',
            id: incident.primaryVictim.hostname,
            title: incident.primaryVictim.hostname,
            subtitle: `IP: ${incident.primaryVictim.ip} · Criticality: ${incident.primaryVictim.criticality}`,
          })
        }
        className="text-slate-100 hover:text-cyan-300 underline font-semibold cursor-pointer"
      >
        {incident.primaryVictim.hostname} ({incident.primaryVictim.ip})
      </button>
    </div>

    <div className="flex items-center gap-2 text-slate-400">
      <Radio className="w-3.5 h-3.5 text-rose-400" />
      <span>External C2:</span>
      <span className="text-rose-400 font-semibold">
        {incident.threatActor?.ip || FALLBACK_C2_IP} ({incident.threatActor?.country || FALLBACK_C2_COUNTRY})
      </span>
    </div>

    <div className="flex items-center gap-2 text-slate-400">
      <Activity className="w-3.5 h-3.5 text-amber-400" />
      <span>Wire Tap:</span>
      <span className="text-slate-300">tap-core-01 (10G Fiber)</span>
    </div>
  </div>
);
