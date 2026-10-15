import { Crosshair } from 'lucide-react';
import type React from 'react';
import { VECTRA_QUADRANT_ENTITIES } from '../hunt.data';
import type { QuadrantEntity } from '../hunt.types';
import { clampQuadrantPosition, quadrantDotClass } from '../hunt.utils';

interface ThreatQuadrantProps {
  selectedEntityId: string | null;
  onSelectEntity: (entity: QuadrantEntity) => void;
}

export const ThreatQuadrant: React.FC<ThreatQuadrantProps> = ({ selectedEntityId, onSelectEntity }) => (
  <div className="p-3.5 bg-[#090d16] border border-slate-800 rounded flex flex-col justify-between space-y-2">
    <div className="flex items-center justify-between text-xs">
      <div className="flex items-center gap-1.5">
        <Crosshair className="w-3.5 h-3.5 text-rose-400" />
        <span className="font-semibold text-slate-200">Vectra AI Threat vs. Certainty Matrix</span>
      </div>
      <span className="text-[10px] font-mono text-slate-500">Host Risk 2D</span>
    </div>

    <div className="h-44 w-full bg-[#060911] border border-slate-800/80 rounded relative p-2 overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-full h-[1px] bg-slate-800/80" />
      </div>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="h-full w-[1px] bg-slate-800/80" />
      </div>

      <span className="absolute top-1 right-2 text-[9px] font-mono text-rose-500 font-bold uppercase">
        Critical Urgent
      </span>
      <span className="absolute top-1 left-2 text-[9px] font-mono text-amber-500 uppercase">High Threat</span>
      <span className="absolute bottom-1 right-2 text-[9px] font-mono text-cyan-500 uppercase">High Certainty</span>
      <span className="absolute bottom-1 left-2 text-[9px] font-mono text-slate-600 uppercase">Low / Info</span>

      {VECTRA_QUADRANT_ENTITIES.map((ent) => {
        const isSelected = selectedEntityId === ent.id;
        return (
          <div
            key={ent.id}
            onClick={() => onSelectEntity(ent)}
            style={{
              left: `${clampQuadrantPosition(ent.certainty)}%`,
              bottom: `${clampQuadrantPosition(ent.threat)}%`,
            }}
            className="absolute transform -translate-x-1/2 translate-y-1/2 cursor-pointer group"
            title={`${ent.name} (${ent.id})\nThreat: ${ent.threat}/100 · Certainty: ${ent.certainty}%`}
          >
            <div
              className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all ${quadrantDotClass(
                ent.quadrant,
              )} ${isSelected ? 'ring-2 ring-cyan-400 scale-125' : 'group-hover:scale-125'}`}
            />
            <span className="absolute left-4 top-0 text-[9px] font-mono text-slate-300 whitespace-nowrap opacity-0 group-hover:opacity-100 bg-[#080c14] px-1 py-0.5 rounded border border-slate-700 z-10">
              {ent.name}
            </span>
          </div>
        );
      })}
    </div>

    <div className="text-[10px] font-mono text-slate-500 flex justify-between">
      <span>Threat Score (Y)</span>
      <span className="text-rose-400 font-semibold">2 Critical Entities Identified</span>
      <span>Certainty (X)</span>
    </div>
  </div>
);
