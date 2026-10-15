import type { FC } from 'react';
import { PRESSURE_METERS } from '../inspection-integrity.data';
import type { GovernorState } from '../inspection-integrity.types';
import { BrowserProtectionPanel } from './BrowserProtectionPanel';
import { GovernorStateBanner } from './GovernorStateBanner';
import { PressureMeterCard } from './PressureMeterCard';

interface GovernorViewProps {
  governorState: GovernorState;
  onGovernorStateChange: (state: GovernorState) => void;
}

export const GovernorView: FC<GovernorViewProps> = ({ governorState, onGovernorStateChange }) => (
  <div className="space-y-4">
    <GovernorStateBanner governorState={governorState} onChange={onGovernorStateChange} />

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {PRESSURE_METERS.map((meter) => (
        <PressureMeterCard key={meter.name} meter={meter} />
      ))}
    </div>

    <BrowserProtectionPanel />
  </div>
);
