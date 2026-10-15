import { AlertTriangle, CheckCircle, ShieldAlert } from 'lucide-react';
import type React from 'react';
import type { OperationalStatus } from '../simple-soc-dashboard.utils';

const STATUS_ICON_CLASS = 'w-5 h-5 shrink-0 mt-0.5';

interface OperationalStatusIconProps {
  status: OperationalStatus;
}

export const OperationalStatusIcon: React.FC<OperationalStatusIconProps> = ({ status }) => {
  if (status === 'STALE') return <AlertTriangle className={`${STATUS_ICON_CLASS} text-amber-400`} />;
  if (status === 'UNDER_ATTACK') return <ShieldAlert className={`${STATUS_ICON_CLASS} text-rose-400`} />;
  return <CheckCircle className={`${STATUS_ICON_CLASS} text-emerald-400`} />;
};
