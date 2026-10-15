import type { FC } from 'react';
import { timeAgo } from '../../../lib/utils';
import type { LivingEntity } from '../../../types';

interface DhcpLeaseHistoryProps {
  leases: LivingEntity['historicalIps'];
}

export const DhcpLeaseHistory: FC<DhcpLeaseHistoryProps> = ({ leases }) => (
  <div className="space-y-2 pt-2 border-t border-[#20242a]">
    <span className="font-semibold text-zinc-300 block text-xs">Historical DHCP Leases</span>
    <div className="space-y-1.5 font-mono text-[11px]">
      {leases.map((lease, idx) => (
        <div key={idx} className="p-2.5 bg-[#131518] rounded border border-[#20242a] flex justify-between items-center">
          <div>
            <span className="text-zinc-200 font-medium">{lease.ip}</span>
            <span className="text-zinc-500 ml-2">({lease.leaseOrigin})</span>
          </div>
          <span className="text-zinc-500 text-[10px]">{timeAgo(lease.lastSeen)}</span>
        </div>
      ))}
    </div>
  </div>
);
