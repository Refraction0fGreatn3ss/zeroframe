import { Layers } from 'lucide-react';
import type { FC } from 'react';
import { CONFIG_APPLIED_STAGE_ID, LIFECYCLE_STAGES, VERIFIED_STAGE_ID } from '../fleet.data';

export const LifecyclePipeline: FC = () => (
  <div className="bg-[#101215] border border-[#20242a] rounded p-4 space-y-3">
    <div className="flex items-center justify-between border-b border-[#20242a] pb-2">
      <span className="text-xs font-semibold text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
        <Layers className="w-3.5 h-3.5 text-cyan-400" />
        <span>Authoritative 14-Stage Sensor Lifecycle Pipeline</span>
      </span>
      <span className="text-[11px] font-mono text-zinc-400">State Progression: Left to Right</span>
    </div>

    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
      {LIFECYCLE_STAGES.map((stg) => {
        const isConfigApplied = stg.id === CONFIG_APPLIED_STAGE_ID;
        const isVerified = stg.id === VERIFIED_STAGE_ID;

        return (
          <div
            key={stg.id}
            className={`p-2.5 rounded border text-xs flex flex-col justify-between ${
              isConfigApplied
                ? 'bg-amber-950/20 border-amber-500/50 text-amber-300'
                : isVerified
                  ? 'bg-emerald-950/20 border-emerald-500/50 text-emerald-300'
                  : 'bg-[#14171d] border-slate-800 text-slate-300'
            }`}
          >
            <div>
              <div className="flex items-center justify-between font-mono text-[10px] text-zinc-500">
                <span>#{stg.step}</span>
                {isConfigApplied && <span className="text-amber-400 font-bold">APPLIED</span>}
                {isVerified && <span className="text-emerald-400 font-bold">VERIFIED</span>}
              </div>
              <div className="font-semibold text-xs mt-1">{stg.label}</div>
              <p className="text-[10px] text-zinc-400 mt-1 line-clamp-2">{stg.desc}</p>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);
