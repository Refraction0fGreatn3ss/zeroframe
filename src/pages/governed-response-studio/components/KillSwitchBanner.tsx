import { AlertTriangle } from 'lucide-react';
import type { FC } from 'react';

export const KillSwitchBanner: FC = () => (
  <div className="p-3 bg-[#1a140a] border border-[#3d2c14] rounded text-amber-300 text-xs flex items-center gap-2">
    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
    <span>
      Autonomous response kill-switch is engaged. Active containment commands are physically blocked at the sensor
      controller.
    </span>
  </div>
);
