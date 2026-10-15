import type React from 'react';
import type { KillChainStage } from '../command-center.types';
import { formatStageNumber, getKillChainCardClass, getKillChainHitsClass } from '../command-center.utils';

interface KillChainStageCardProps {
  item: KillChainStage;
  index: number;
  isSelected: boolean;
  onToggle: (stage: string) => void;
}

export const KillChainStageCard: React.FC<KillChainStageCardProps> = ({ item, index, isSelected, onToggle }) => (
  <button
    type="button"
    onClick={() => onToggle(item.stage)}
    className={`p-2.5 rounded border text-left transition-all cursor-pointer relative ${getKillChainCardClass(item.severity, isSelected)}`}
  >
    <div className="flex items-center justify-between text-[10px] font-mono text-[var(--zf-text-muted)]">
      <span>{formatStageNumber(index)}</span>
      <span className={`font-semibold ${getKillChainHitsClass(item.severity)}`}>{item.hits} Hits</span>
    </div>
    <div className="text-xs font-semibold text-[var(--zf-text-primary)] mt-1 truncate">{item.stage}</div>
    <div className="text-[11px] font-mono text-[var(--zf-text-secondary)] truncate mt-0.5">{item.technique}</div>
  </button>
);
