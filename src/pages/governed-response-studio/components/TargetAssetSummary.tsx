import type { FC } from 'react';
import type { ResponseTarget } from '../governed-response-studio.types';

interface TargetAssetSummaryProps {
  incident: ResponseTarget;
}

export const TargetAssetSummary: FC<TargetAssetSummaryProps> = ({ incident }) => (
  <div className="p-3 bg-[#131518] rounded border border-[#20242a] space-y-1">
    <span className="text-zinc-500 text-[11px] block font-medium">TARGET ASSET</span>
    <div className="text-sm font-semibold text-zinc-200">
      {incident.primaryVictim.hostname} ({incident.primaryVictim.ip})
    </div>
    <div className="text-zinc-400 text-xs">
      Classification: {incident.primaryVictim.criticality} ·{' '}
      {incident.primaryVictim.isProtected ? (
        <span className="text-amber-400 font-medium">Protected Critical Asset</span>
      ) : (
        <span className="text-zinc-300">Standard Workstation</span>
      )}
    </div>
  </div>
);
