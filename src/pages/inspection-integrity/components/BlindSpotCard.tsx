import { Wrench } from 'lucide-react';
import type { FC } from 'react';
import type { BlindSpot } from '../inspection-integrity.types';

interface BlindSpotCardProps {
  blindSpot: BlindSpot;
}

export const BlindSpotCard: FC<BlindSpotCardProps> = ({ blindSpot: bsp }) => (
  <div className="p-4 bg-[#101215] border border-[#20242a] rounded space-y-2.5 text-xs font-sans">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#181b20] pb-2">
      <div className="flex items-center gap-2">
        <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded">
          {bsp.id}
        </span>
        <h3 className="font-semibold text-zinc-100 text-sm">{bsp.name}</h3>
      </div>
      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
        {bsp.status}
      </span>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-[11px] bg-[#0b0e13] p-2.5 rounded border border-[#181b20]">
      <div>
        <span className="text-zinc-500 block text-[10px]">Affected Site & Domain:</span>
        <span className="text-zinc-200">{bsp.affectedDomain}</span>
      </div>
      <div>
        <span className="text-zinc-500 block text-[10px]">Assigned Sensor:</span>
        <span className="text-cyan-400">{bsp.sensor}</span>
      </div>
      <div>
        <span className="text-zinc-500 block text-[10px]">Visibility Domain:</span>
        <span className="text-zinc-200">{bsp.visibilityDomain}</span>
      </div>
    </div>

    <div className="space-y-1.5 text-xs">
      <div>
        <span className="text-zinc-400 font-medium">Missing Wire Telemetry: </span>
        <span className="text-zinc-300">{bsp.missingTelemetry}</span>
      </div>
      <div>
        <span className="text-zinc-400 font-medium">Detector Impact: </span>
        <span className="text-rose-300">{bsp.detectorImpact}</span>
      </div>
      <div>
        <span className="text-zinc-400 font-medium">Root Cause: </span>
        <span className="text-zinc-300">{bsp.rootCause}</span>
      </div>
    </div>

    <div className="pt-2 border-t border-[#181b20] flex items-start gap-2 text-cyan-300 bg-cyan-950/15 p-2 rounded border border-cyan-800/30 text-[11px]">
      <Wrench className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
      <div>
        <strong className="text-cyan-200">Required Engineering Remediation: </strong>
        <span>{bsp.requiredRemediation}</span>
      </div>
    </div>
  </div>
);
