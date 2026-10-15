import type React from 'react';
import type { ActivityCategory } from '../../../types/activity-log';
import { CATEGORY_CONFIG } from './activity-log.data';

export const CategoryIcon: React.FC<{ category: ActivityCategory }> = ({ category }) => {
  const { icon: Icon, textClassName } = CATEGORY_CONFIG[category];
  return <Icon className={`w-3.5 h-3.5 ${textClassName} shrink-0`} />;
};
