import type { FC } from 'react';
import type { LivingEntity } from '../../../types';
import { ELEVATED_BLAST_RADIUS_THRESHOLD } from '../assets.data';
import { getIdentityConfidence } from '../assets.utils';

interface IdentityScoreCardsProps {
  entity: LivingEntity;
}

export const IdentityScoreCards: FC<IdentityScoreCardsProps> = ({ entity }) => {
  const isElevatedBlastRadius = entity.blastRadiusScore > ELEVATED_BLAST_RADIUS_THRESHOLD;

  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="p-3 bg-[#11141a] rounded border border-[#20242a] space-y-1">
        <div className="flex justify-between text-zinc-400 text-[11px]">
          <span>Identity Confidence:</span>
          <span className="text-emerald-400 font-mono font-semibold">{getIdentityConfidence(entity)}%</span>
        </div>
        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${getIdentityConfidence(entity)}%` }} />
        </div>
        <span className="text-[10px] text-zinc-500 font-mono">Multi-sensor wire correlation: {entity.provenance}</span>
      </div>

      <div className="p-3 bg-[#11141a] rounded border border-[#20242a] space-y-1">
        <div className="flex justify-between text-zinc-400 text-[11px]">
          <span>Blast Radius Score:</span>
          <span className={`font-mono font-semibold ${isElevatedBlastRadius ? 'text-rose-400' : 'text-zinc-200'}`}>
            {entity.blastRadiusScore} / 100
          </span>
        </div>
        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${isElevatedBlastRadius ? 'bg-rose-500' : 'bg-cyan-400'}`}
            style={{ width: `${entity.blastRadiusScore}%` }}
          />
        </div>
        <span className="text-[10px] text-zinc-500 font-mono">
          {entity.isProtected ? 'Tier-1 Enclave Protection Active' : 'Standard Exposure Profile'}
        </span>
      </div>
    </div>
  );
};
