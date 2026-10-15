import type React from 'react';
import type { ActivitySeverity } from '../../../types/activity-log';
import { SEVERITY_BADGE_CLASS } from './activity-log.data';

export const SeverityBadge: React.FC<{ severity: ActivitySeverity }> = ({ severity }) => (
  <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${SEVERITY_BADGE_CLASS[severity]}`}>{severity}</span>
);
