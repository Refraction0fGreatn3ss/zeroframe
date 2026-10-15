import type { FC } from 'react';
import { ExportButton } from '../../../components/shared/ExportButton';
import type { LivingEntity } from '../../../types';

interface AssetsHeaderProps {
  entities: LivingEntity[];
}

export const AssetsHeader: FC<AssetsHeaderProps> = ({ entities }) => (
  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#20242a]">
    <div>
      <div className="flex items-center gap-2">
        <h1 className="text-base font-semibold text-zinc-100 tracking-tight">Living Identity & Asset Inventory</h1>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-medium">
          Bitemporal Truth Graph
        </span>
      </div>
      <p className="text-xs text-zinc-400 mt-0.5">
        Authoritative asset graph tracking IT, IoT, and OT infrastructure, discovered wire protocols, DHCP churn, and
        bitemporal ledger provenance.
      </p>
    </div>

    <div className="flex items-center gap-2">
      <ExportButton resourceName="Living Entities" recordCount={entities.length} data={entities} />
    </div>
  </div>
);
