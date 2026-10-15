import type React from 'react';
import { MITRE_KILL_CHAIN } from '../command-center.data';
import { KillChainStageCard } from './KillChainStageCard';

interface KillChainFunnelProps {
  selectedStage: string | null;
  onToggleStage: (stage: string) => void;
  onClearStage: () => void;
}

export const KillChainFunnel: React.FC<KillChainFunnelProps> = ({ selectedStage, onToggleStage, onClearStage }) => (
  <div className="p-3.5 bg-[var(--zf-surface-card)] border border-[var(--zf-border-subtle)] rounded space-y-3 shadow-xs">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <h2 className="text-xs font-semibold text-[var(--zf-text-primary)] uppercase tracking-wider">
          Cross-Layer Attack Kill Chain & Detection Progression
        </h2>
        {selectedStage && (
          <button
            type="button"
            onClick={onClearStage}
            className="text-[11px] text-[var(--zf-brand-accent)] hover:underline font-mono cursor-pointer"
          >
            (Clear filter: {selectedStage})
          </button>
        )}
      </div>
      <span className="text-[11px] font-mono text-[var(--zf-text-muted)]">
        Click any stage to filter correlated incident queue
      </span>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2">
      {MITRE_KILL_CHAIN.map((item, idx) => (
        <KillChainStageCard
          key={item.stage}
          item={item}
          index={idx}
          isSelected={selectedStage === item.stage}
          onToggle={onToggleStage}
        />
      ))}
    </div>
  </div>
);
