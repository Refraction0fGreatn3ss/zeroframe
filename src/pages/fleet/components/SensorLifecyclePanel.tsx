import type { FC } from 'react';
import type { SensorNode } from '../../../types/fleet';
import { COMPLETED_STAGE_COUNT, LIFECYCLE_STAGES } from '../fleet.data';

interface SensorLifecyclePanelProps {
  sensor: SensorNode;
}

export const SensorLifecyclePanel: FC<SensorLifecyclePanelProps> = ({ sensor }) => (
  <div className="space-y-3 text-xs">
    <div className="p-3 bg-[#131518] rounded border border-[#23272e] space-y-1.5 font-mono text-[11px]">
      <span className="font-sans font-semibold text-zinc-300 text-xs block">Active Lifecycle Transition</span>
      <div className="text-emerald-400 font-bold">STATE: VERIFIED_NOMINAL (Stage 10/14)</div>
      <div className="text-zinc-400 text-[10px]">
        Attestation Validated: {new Date(sensor.lastHeartbeat).toLocaleString()}
      </div>
    </div>

    <div className="space-y-1.5 max-h-96 overflow-y-auto">
      {LIFECYCLE_STAGES.slice(0, COMPLETED_STAGE_COUNT).map((stg) => (
        <div
          key={stg.id}
          className="p-2 rounded bg-[#11141a] border border-slate-800 flex items-center justify-between"
        >
          <div>
            <span className="font-mono text-[10px] text-zinc-500 mr-2">#{stg.step}</span>
            <span className="text-zinc-200 font-medium text-xs">{stg.label}</span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 px-1.5 py-0.2 rounded bg-emerald-500/10 border border-emerald-500/30">
            COMPLETED
          </span>
        </div>
      ))}
    </div>
  </div>
);
