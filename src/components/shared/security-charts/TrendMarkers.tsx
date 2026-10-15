import type { FC } from 'react';
import type { TrendDataPoint } from './security-charts.types';
import { DETECTIONS_COLOR, INCIDENT_COLOR, type TrendChartScale } from './trend-chart.utils';

const INCIDENT_LABEL_OFFSET_Y = 7;

interface TrendMarkersProps {
  data: TrendDataPoint[];
  scale: TrendChartScale;
}

export const TrendMarkers: FC<TrendMarkersProps> = ({ data, scale }) => (
  <>
    {data.map((d, i) => {
      if (d.incidents === 0) return null;
      const x = scale.getX(i);
      const y = scale.getYDetections(d.detections);
      return (
        <g key={`inc-${i}`}>
          <circle cx={x} cy={y} r="4.5" fill={INCIDENT_COLOR} stroke="var(--zf-surface-card)" strokeWidth="1.5" />
          <text
            x={x}
            y={y - INCIDENT_LABEL_OFFSET_Y}
            textAnchor="middle"
            className="fill-rose-400 text-[8px] font-mono font-bold"
          >
            !
          </text>
        </g>
      );
    })}

    {data.map((d, i) => {
      if (!d.anomaly) return null;
      const x = scale.getX(i);
      const y = scale.getYEvents(d.totalEvents);
      return (
        <g key={`anomaly-marker-${i}`}>
          <circle
            cx={x}
            cy={y}
            r="6"
            fill="rgba(245, 158, 11, 0.15)"
            stroke={DETECTIONS_COLOR}
            strokeWidth="1"
            strokeDasharray="2 2"
          />
          <circle cx={x} cy={y} r="3.5" fill={DETECTIONS_COLOR} stroke="var(--zf-surface-card)" strokeWidth="1.5" />
        </g>
      );
    })}
  </>
);
