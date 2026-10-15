import type { FC } from 'react';
import type { LivingEntity } from '../../../types';
import { AssetTableRow } from './AssetTableRow';

interface AssetsTableProps {
  entities: LivingEntity[];
  onSelect: (entity: LivingEntity) => void;
}

export const AssetsTable: FC<AssetsTableProps> = ({ entities, onSelect }) => (
  <div className="bg-[#101215] border border-[#20242a] rounded overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs font-sans">
        <thead className="bg-[#14171c] border-b border-[#20242a] text-zinc-400 text-[11px] font-medium">
          <tr>
            <th className="py-2.5 px-3">Hostname & Identity</th>
            <th className="py-2.5 px-3">Current IP</th>
            <th className="py-2.5 px-3">Hardware MAC</th>
            <th className="py-2.5 px-3">Type</th>
            <th className="py-2.5 px-3">Discovered Protocols</th>
            <th className="py-2.5 px-3">VLAN Status</th>
            <th className="py-2.5 px-3">Confidence</th>
            <th className="py-2.5 px-3">Protection</th>
            <th className="py-2.5 px-3 text-right">Last Observed</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#181b20] text-zinc-300">
          {entities.map((ent) => (
            <AssetTableRow key={ent.id} entity={ent} onSelect={onSelect} />
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
