import type React from 'react';
import { ContextStatTile } from '../ContextStatTile';
import type { SensorContextData } from '../universal-context-drawer.data';
import { DEFAULT_CAPTURE_DRIVER } from '../universal-context-drawer.data';

interface SensorContextProps {
  data: SensorContextData;
}

export const SensorContext: React.FC<SensorContextProps> = ({ data }) => (
  <div className="space-y-4">
    <div className="grid grid-cols-2 gap-2.5">
      <ContextStatTile label="Driver" valueClassName="font-semibold text-xs font-mono text-[var(--zf-text-primary)]">
        {data.captureDriver || DEFAULT_CAPTURE_DRIVER}
      </ContextStatTile>
      <ContextStatTile label="mTLS Expiry" valueClassName="font-semibold text-xs font-mono text-emerald-400">
        2027-04-15
      </ContextStatTile>
    </div>
  </div>
);
