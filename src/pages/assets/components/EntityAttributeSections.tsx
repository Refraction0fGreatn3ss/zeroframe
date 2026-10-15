import { Cloud, Radio, Tag, User } from 'lucide-react';
import type { FC } from 'react';
import type { LivingEntity } from '../../../types';
import { DrawerSection } from './DrawerSection';

interface EntityAttributeSectionsProps {
  entity: LivingEntity;
}

export const EntityAttributeSections: FC<EntityAttributeSectionsProps> = ({ entity }) => (
  <>
    {entity.users && entity.users.length > 0 && (
      <DrawerSection
        icon={<User className="w-3.5 h-3.5 text-amber-400" />}
        title="Associated Identities & Service Principals"
      >
        <div className="flex flex-wrap gap-1.5">
          {entity.users.map((u) => (
            <span
              key={u}
              className="px-2 py-0.5 rounded bg-slate-800 text-amber-300 border border-slate-700 font-mono text-[11px]"
            >
              {u}
            </span>
          ))}
        </div>
      </DrawerSection>
    )}

    {entity.cloudIds && entity.cloudIds.length > 0 && (
      <DrawerSection icon={<Cloud className="w-3.5 h-3.5 text-blue-400" />} title="Cloud ARNs & Fabric IDs">
        <div className="space-y-1">
          {entity.cloudIds.map((cid) => (
            <div
              key={cid}
              className="p-1.5 rounded bg-[#11141a] border border-[#20242a] font-mono text-[10px] text-blue-300 break-all"
            >
              {cid}
            </div>
          ))}
        </div>
      </DrawerSection>
    )}

    {entity.discoveredProtocols && entity.discoveredProtocols.length > 0 && (
      <DrawerSection
        icon={<Radio className="w-3.5 h-3.5 text-cyan-400" />}
        title="Discovered Wire Protocols & Signatures"
      >
        <div className="flex flex-wrap gap-1.5">
          {entity.discoveredProtocols.map((p) => (
            <span
              key={p}
              className="px-2 py-1 rounded bg-[#151922] text-cyan-300 border border-cyan-500/30 font-mono text-[11px]"
            >
              {p}
            </span>
          ))}
        </div>
      </DrawerSection>
    )}

    {entity.tags && entity.tags.length > 0 && (
      <DrawerSection icon={<Tag className="w-3.5 h-3.5 text-zinc-400" />} title="Classification Tags">
        <div className="flex flex-wrap gap-1.5">
          {entity.tags.map((t) => (
            <span
              key={t}
              className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 text-[10px]"
            >
              #{t}
            </span>
          ))}
        </div>
      </DrawerSection>
    )}
  </>
);
