import type { FC } from 'react';
import type { LivingEntity } from '../../../types';
import { DEFAULT_OS_LABEL, DEFAULT_OWNER_LABEL } from '../assets.data';

interface IdentityMetadataListProps {
  entity: LivingEntity;
}

export const IdentityMetadataList: FC<IdentityMetadataListProps> = ({ entity }) => (
  <div className="p-3.5 bg-[#11141a] rounded border border-[#20242a] space-y-2 font-mono text-[11px]">
    <div className="flex justify-between">
      <span className="text-zinc-500">Hardware MAC:</span>
      <span className="text-zinc-200">{entity.mac}</span>
    </div>
    <div className="flex justify-between">
      <span className="text-zinc-500">Operating System / Firmware:</span>
      <span className="text-zinc-300 font-sans">{entity.os || DEFAULT_OS_LABEL}</span>
    </div>
    <div className="flex justify-between">
      <span className="text-zinc-500">Asset Owner:</span>
      <span className="text-zinc-300 font-sans">{entity.owner || DEFAULT_OWNER_LABEL}</span>
    </div>
    <div className="flex justify-between">
      <span className="text-zinc-500">Observation Source:</span>
      <span className="text-zinc-200">{entity.observationSource}</span>
    </div>
    <div className="flex justify-between">
      <span className="text-zinc-500">Provenance Method:</span>
      <span className="text-cyan-400">{entity.provenance}</span>
    </div>
  </div>
);
