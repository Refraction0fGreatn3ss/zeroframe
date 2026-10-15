import type { FC } from 'react';
import type { KillSwitchState } from '../../../stores/kill-switch-store';

const RESPONSE_LABELS: Record<KillSwitchState, string> = {
  ENGAGED: 'Blocked',
  DISENGAGED: 'Standby',
  UNKNOWN: 'Unknown',
};

interface OperationalStateStripProps {
  killSwitch: KillSwitchState;
}

export const OperationalStateStrip: FC<OperationalStateStripProps> = ({ killSwitch }) => (
  <div className="w-full max-w-md p-3.5 bg-[var(--zf-surface-card)] border border-[var(--zf-border-subtle)] rounded flex items-center justify-around text-xs font-sans">
    <div className="flex items-center gap-1.5">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
      <span className="text-[var(--zf-text-muted)]">Monitoring</span>
      <span className="font-medium text-emerald-400">Active</span>
    </div>

    <div className="h-4 w-px bg-[var(--zf-border-subtle)]" />

    <div className="flex items-center gap-1.5">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
      <span className="text-[var(--zf-text-muted)]">Detection</span>
      <span className="font-medium text-emerald-400">Active</span>
    </div>

    <div className="h-4 w-px bg-[var(--zf-border-subtle)]" />

    <div className="flex items-center gap-1.5">
      <span className={`w-1.5 h-1.5 rounded-full ${killSwitch === 'ENGAGED' ? 'bg-amber-400' : 'bg-zinc-400'}`} />
      <span className="text-[var(--zf-text-muted)]">Response</span>
      <span
        className={`font-medium ${killSwitch === 'ENGAGED' ? 'text-amber-400' : 'text-[var(--zf-text-secondary)]'}`}
      >
        {RESPONSE_LABELS[killSwitch]}
      </span>
    </div>
  </div>
);
