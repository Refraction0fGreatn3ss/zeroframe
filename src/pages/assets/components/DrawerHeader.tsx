import { X } from 'lucide-react';
import type { FC } from 'react';
import type { LivingEntity } from '../../../types';
import { EntityIcon } from './EntityIcon';

interface DrawerHeaderProps {
  entity: LivingEntity;
  onClose: () => void;
}

export const DrawerHeader: FC<DrawerHeaderProps> = ({ entity, onClose }) => (
  <div className="flex items-start justify-between pb-3 border-b border-[#20242a]">
    <div className="flex items-center gap-2.5">
      <div className="p-2 rounded bg-slate-800 border border-slate-700">
        <EntityIcon type={entity.entityType} />
      </div>
      <div>
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-zinc-100">{entity.hostname}</h3>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-cyan-400 border border-slate-700">
            {entity.entityType}
          </span>
        </div>
        <span className="font-mono text-[11px] text-zinc-400">{entity.currentIp}</span>
      </div>
    </div>
    <button type="button" onClick={onClose} className="p-1 text-zinc-400 hover:text-white cursor-pointer">
      <X className="w-4 h-4" />
    </button>
  </div>
);
