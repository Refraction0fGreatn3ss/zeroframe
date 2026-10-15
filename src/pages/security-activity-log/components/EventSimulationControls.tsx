import type React from 'react';
import { Fragment } from 'react';
import type { SimulationKind } from '../security-activity-log.data';
import { SIMULATION_BUTTONS } from '../security-activity-log.data';

interface EventSimulationControlsProps {
  onSimulate: (kind: SimulationKind) => void;
}

export const EventSimulationControls: React.FC<EventSimulationControlsProps> = ({ onSimulate }) => (
  <div className="flex items-center bg-[var(--zf-surface-card)] border border-[var(--zf-border-subtle)] rounded p-0.5 text-xs font-mono">
    {SIMULATION_BUTTONS.map((button, index) => (
      <Fragment key={button.kind}>
        {index > 0 && <span className="text-[var(--zf-border-subtle)]">|</span>}
        <button
          type="button"
          onClick={() => onSimulate(button.kind)}
          className={`px-2 py-1 rounded text-[11px] ${button.toneClassName} transition-colors cursor-pointer`}
          title={button.title}
        >
          {button.label}
        </button>
      </Fragment>
    ))}
  </div>
);
