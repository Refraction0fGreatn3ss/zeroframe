import { AlertTriangle, ShieldCheck } from 'lucide-react';
import type { FC } from 'react';
import { timeAgo } from '../../../lib/utils';
import type { LivingEntity } from '../../../types';
import { getIdentityConfidence, getProtocolBadgeClassName, hasVlanConflict } from '../assets.utils';
import { EntityIcon } from './EntityIcon';

interface AssetTableRowProps {
  entity: LivingEntity;
  onSelect: (entity: LivingEntity) => void;
}

export const AssetTableRow: FC<AssetTableRowProps> = ({ entity: ent, onSelect }) => (
  <tr onClick={() => onSelect(ent)} className="hover:bg-[#15181e] cursor-pointer transition-colors">
    <td className="py-2.5 px-3">
      <div className="font-medium text-zinc-100 flex items-center gap-2">
        <EntityIcon type={ent.entityType} />
        <span className="font-semibold text-zinc-200">{ent.hostname}</span>
        {ent.isProtected && (
          <span title="Tier-1 Protected Asset">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          </span>
        )}
        {ent.activeIncidents && ent.activeIncidents.length > 0 && (
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" title="Active Incident Involved" />
        )}
      </div>
      <div className="font-mono text-[10px] text-zinc-500 pl-5">{ent.id}</div>
    </td>
    <td className="py-2.5 px-3 font-mono text-zinc-200">{ent.currentIp}</td>
    <td className="py-2.5 px-3 font-mono text-zinc-400 text-[11px]">{ent.mac}</td>
    <td className="py-2.5 px-3">
      <span className="text-[11px] px-1.5 py-0.5 rounded bg-slate-800/80 border border-slate-700 font-mono text-slate-300">
        {ent.entityType}
      </span>
    </td>
    <td className="py-2.5 px-3">
      <div className="flex flex-wrap gap-1">
        {ent.discoveredProtocols && ent.discoveredProtocols.length > 0 ? (
          ent.discoveredProtocols.map((p) => (
            <span
              key={p}
              className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${getProtocolBadgeClassName(p)}`}
            >
              {p}
            </span>
          ))
        ) : (
          <span className="text-zinc-600 text-[10px] font-mono">Standard L4</span>
        )}
      </div>
    </td>
    <td className="py-2.5 px-3">
      {hasVlanConflict(ent) ? (
        <span className="text-amber-400 font-mono text-[11px] flex items-center gap-1">
          <AlertTriangle className="w-3 h-3 text-amber-400" />
          <span>
            Conflict: Declared {ent.vlanDeclared} / Observed {ent.vlanObserved}
          </span>
        </span>
      ) : (
        <span className="font-mono text-[11px] text-zinc-400">VLAN {ent.vlanObserved || 'Default'}</span>
      )}
    </td>
    <td className="py-2.5 px-3 font-mono text-[11px]">
      <span className="text-emerald-400 font-medium">{getIdentityConfidence(ent)}%</span>
    </td>
    <td className="py-2.5 px-3">
      {ent.isProtected ? (
        <span className="text-[11px] text-emerald-400 font-medium">Tier-1 Hardened</span>
      ) : (
        <span className="text-[11px] text-zinc-500">Standard</span>
      )}
    </td>
    <td className="py-2.5 px-3 text-right font-mono text-[11px] text-zinc-500">{timeAgo(ent.lastSeen)}</td>
  </tr>
);
