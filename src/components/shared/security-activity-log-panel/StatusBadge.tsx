import type React from 'react';
import type { ActivityStatus } from '../../../types/activity-log';
import { STATUS_CONFIG } from './activity-log.data';

export const StatusBadge: React.FC<{ status: ActivityStatus }> = ({ status }) => {
  const { icon: Icon, className } = STATUS_CONFIG[status];
  return (
    <span className={`${className} flex items-center gap-1`}>
      <Icon className="w-2.5 h-2.5" />
      <span>{status}</span>
    </span>
  );
};
