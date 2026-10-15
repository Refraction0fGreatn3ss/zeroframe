import { AlertTriangle } from 'lucide-react';
import type { FC } from 'react';
import { BLIND_SPOTS } from '../inspection-integrity.data';
import { BlindSpotCard } from './BlindSpotCard';

export const BlindSpotsView: FC = () => (
  <div className="space-y-4">
    <div className="p-3 bg-amber-950/20 border border-amber-500/40 rounded text-xs text-amber-200 space-y-1">
      <div className="font-semibold flex items-center gap-1.5 text-amber-300">
        <AlertTriangle className="w-4 h-4 shrink-0" />
        <span>Authoritative Blind Spot Disclosure (No Synthetic Risk Scores)</span>
      </div>
      <p className="text-zinc-400 leading-relaxed font-sans text-xs">
        ZeroFrame explicitly maps where wire telemetry is unmonitored, masked by encryption, or constrained by physical
        unidirectional diodes. We report exact observation gaps and engineering remediations rather than generating
        arbitrary risk points.
      </p>
    </div>

    <div className="space-y-3">
      {BLIND_SPOTS.map((bsp) => (
        <BlindSpotCard key={bsp.id} blindSpot={bsp} />
      ))}
    </div>
  </div>
);
