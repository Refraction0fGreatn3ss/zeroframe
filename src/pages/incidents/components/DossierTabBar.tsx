import { Clock, Layers, MessageSquare, Terminal } from 'lucide-react';
import type React from 'react';
import type { DossierTab } from '../incidents.types';
import { DossierTabButton } from './DossierTabButton';

interface DossierTabBarProps {
  activeTab: DossierTab;
  onTabChange: (tab: DossierTab) => void;
  noteCount: number;
}

export const DossierTabBar: React.FC<DossierTabBarProps> = ({ activeTab, onTabChange, noteCount }) => (
  <div className="flex items-center px-4 border-b border-slate-800 bg-[#080c14] text-xs font-mono">
    <DossierTabButton icon={Layers} isActive={activeTab === 'TREE'} onClick={() => onTabChange('TREE')}>
      Causality Lineage & Process Tree
    </DossierTabButton>
    <DossierTabButton icon={Clock} isActive={activeTab === 'TIMELINE'} onClick={() => onTabChange('TIMELINE')}>
      Correlated Wire & Host Timeline
    </DossierTabButton>
    <DossierTabButton icon={Terminal} isActive={activeTab === 'FORENSICS'} onClick={() => onTabChange('FORENSICS')}>
      Forensic Artifacts & Hashes
    </DossierTabButton>
    <DossierTabButton icon={MessageSquare} isActive={activeTab === 'NOTES'} onClick={() => onTabChange('NOTES')}>
      Analyst Notes ({noteCount})
    </DossierTabButton>
  </div>
);
