import type { FC } from 'react';
import { SecurityStatusBadge } from '../../../components/shared/SecurityStatusBadge';

interface StudioHeaderProps {
  killSwitchEngaged: boolean;
}

export const StudioHeader: FC<StudioHeaderProps> = ({ killSwitchEngaged }) => (
  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#20242a]">
    <div>
      <h1 className="text-lg font-semibold text-zinc-100 tracking-tight">Governed Response Studio</h1>
      <p className="text-xs text-zinc-400 mt-0.5">
        Scoped containment with mandatory dual-custody authorization and post-action wire verification.
      </p>
    </div>

    <SecurityStatusBadge state={killSwitchEngaged ? 'RESPONSE_DISABLED' : 'GOVERNED'} size="md" />
  </div>
);
