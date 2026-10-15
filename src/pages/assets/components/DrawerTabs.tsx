import { History } from 'lucide-react';
import type { FC } from 'react';
import type { AssetDrawerTab } from '../assets.types';

interface DrawerTabsProps {
  activeTab: AssetDrawerTab;
  onTabChange: (tab: AssetDrawerTab) => void;
}

const getTabClassName = (isActive: boolean): string =>
  isActive ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-zinc-400 hover:text-zinc-200';

export const DrawerTabs: FC<DrawerTabsProps> = ({ activeTab, onTabChange }) => (
  <div className="flex items-center gap-2 border-b border-[#20242a] pt-3 pb-2 text-xs">
    <button
      type="button"
      onClick={() => onTabChange('CONTEXT')}
      className={`pb-1 px-2 font-medium border-b-2 transition-colors cursor-pointer ${getTabClassName(activeTab === 'CONTEXT')}`}
    >
      Current Identity & Context
    </button>
    <button
      type="button"
      onClick={() => onTabChange('BITEMPORAL')}
      className={`pb-1 px-2 font-medium border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${getTabClassName(activeTab === 'BITEMPORAL')}`}
    >
      <History className="w-3.5 h-3.5" />
      <span>Bitemporal Identity History</span>
    </button>
  </div>
);
