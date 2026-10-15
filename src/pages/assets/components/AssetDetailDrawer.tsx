import type { FC } from 'react';
import type { LivingEntity } from '../../../types';
import type { AssetDrawerTab } from '../assets.types';
import { BitemporalHistoryTab } from './BitemporalHistoryTab';
import { DrawerHeader } from './DrawerHeader';
import { DrawerTabs } from './DrawerTabs';
import { IdentityContextTab } from './IdentityContextTab';

interface AssetDetailDrawerProps {
  entity: LivingEntity;
  activeTab: AssetDrawerTab;
  onTabChange: (tab: AssetDrawerTab) => void;
  onClose: () => void;
  onPivotToIncident: () => void;
}

export const AssetDetailDrawer: FC<AssetDetailDrawerProps> = ({
  entity,
  activeTab,
  onTabChange,
  onClose,
  onPivotToIncident,
}) => (
  <div className="fixed inset-0 z-50 flex justify-end">
    <div className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity" onClick={onClose} />

    <div className="relative w-full max-w-xl bg-[#0b0e13] border-l border-[#20242a] text-[#e6edf3] p-5 flex flex-col h-full shadow-2xl z-10 overflow-y-auto font-sans">
      <DrawerHeader entity={entity} onClose={onClose} />
      <DrawerTabs activeTab={activeTab} onTabChange={onTabChange} />

      {activeTab === 'CONTEXT' && <IdentityContextTab entity={entity} onPivotToIncident={onPivotToIncident} />}

      {activeTab === 'BITEMPORAL' && <BitemporalHistoryTab entity={entity} />}
    </div>
  </div>
);
