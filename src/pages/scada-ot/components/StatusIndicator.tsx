import type { FC } from 'react';
import type { StatusIndicatorStyle } from '../scada-ot.types';

interface StatusIndicatorProps {
  style: StatusIndicatorStyle;
}

export const StatusIndicator: FC<StatusIndicatorProps> = ({ style }) => (
  <span className={style.className}>
    <span className={style.dotClassName} />
    <span>{style.label}</span>
  </span>
);
