import type { FC } from 'react';
import type { TrendDataPoint } from './security-charts.types';
import { DETECTIONS_COLOR, EVENTS_COLOR, TREND_CHART_PADDING, type TrendChartScale } from './trend-chart.utils';

interface TrendHoverTargetsProps {
  data: TrendDataPoint[];
  scale: TrendChartScale;
  hoveredIndex: number | null;
  onHoverChange: (index: number | null) => void;
}

export const TrendHoverTargets: FC<TrendHoverTargetsProps> = ({ data, scale, hoveredIndex, onHoverChange }) => {
  const { chartWidth, chartHeight } = scale;
  const top = TREND_CHART_PADDING.top;

  return (
    <>
      {data.map((d, i) => {
        const x = scale.getX(i);
        const isHovered = hoveredIndex === i;
        return (
          <g
            key={`interactive-${i}`}
            onMouseEnter={() => onHoverChange(i)}
            onMouseLeave={() => onHoverChange(null)}
            className="cursor-pointer"
          >
            <rect
              x={x - chartWidth / (data.length * 2)}
              y={top}
              width={chartWidth / data.length}
              height={chartHeight}
              fill="transparent"
            />

            {isHovered && (
              <>
                <line
                  x1={x}
                  y1={top}
                  x2={x}
                  y2={top + chartHeight}
                  stroke="currentColor"
                  className="text-[var(--zf-brand-accent)]"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                />
                <circle
                  cx={x}
                  cy={scale.getYEvents(d.totalEvents)}
                  r="4"
                  fill={EVENTS_COLOR}
                  stroke="var(--zf-surface-card)"
                  strokeWidth="1.5"
                />
                <circle
                  cx={x}
                  cy={scale.getYDetections(d.detections)}
                  r="4"
                  fill={DETECTIONS_COLOR}
                  stroke="var(--zf-surface-card)"
                  strokeWidth="1.5"
                />
              </>
            )}
          </g>
        );
      })}
    </>
  );
};
