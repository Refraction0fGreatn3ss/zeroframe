import { Lock } from 'lucide-react';
import type React from 'react';
import { SecurityStatusBadge } from '../../../components/shared/SecurityStatusBadge';
import type { EvidenceItem } from '../evidence-center.types';
import { formatMegabytes } from '../evidence-center.utils';

interface EvidenceRowProps {
  item: EvidenceItem;
}

export const EvidenceRow: React.FC<EvidenceRowProps> = ({ item }) => (
  <tr className="hover:bg-[#15181e] transition-colors">
    <td className="py-2.5 px-3 font-mono font-medium text-zinc-200">{item.id}</td>
    <td className="py-2.5 px-3 font-medium text-zinc-100">{item.title}</td>
    <td className="py-2.5 px-3">
      <SecurityStatusBadge state={item.state} size="sm" />
    </td>
    <td className="py-2.5 px-3 font-mono text-[11px] text-zinc-300">{item.incidentRef}</td>
    <td className="py-2.5 px-3 text-zinc-400">{item.capturedBy}</td>
    <td className="py-2.5 px-3 font-mono text-[11px] text-zinc-400">{formatMegabytes(item.sizeBytes)}</td>
    <td className="py-2.5 px-3 font-mono text-[10px] text-zinc-500 max-w-[140px] truncate" title={item.sha256}>
      {item.sha256}
    </td>
    <td className="py-2.5 px-3 text-right">
      {item.sealedInVault ? (
        <span className="text-emerald-400 text-xs font-medium inline-flex items-center gap-1">
          <Lock className="w-3 h-3" /> Sealed
        </span>
      ) : (
        <span className="text-amber-400 text-xs font-medium inline-flex items-center gap-1">Validating</span>
      )}
    </td>
  </tr>
);
