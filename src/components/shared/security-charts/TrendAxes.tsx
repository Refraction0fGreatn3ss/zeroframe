import type { FC } from 'react';
import type { TrendDataPoint } from './security-charts.types';
import {
  EVENT_GRID_TICKS,
  TREND_CHART_HEIGHT,
  TREND_CHART_PADDING,
  TREND_CHART_WIDTH,
  type TrendChartScale,
} from './trend-chart.utils';

const Y_LABEL_OFFSET_X = 6;
const Y_LABEL_OFFSET_Y = 3;
const X_LABEL_BOTTOM_OFFSET = 6;

interface TrendAxesProps {
  data: TrendDataPoint[];
  scale: TrendChartScale;
}

export const TrendAxes: FC<TrendAxesProps> = ({ data, scale }) => (
  <>
    {EVENT_GRID_TICKS.map((val) => {
      const y = scale.getYEvents(val);
      return (
        <g key={val}>
          <line
            x1={TREND_CHART_PADDING.left}
            y1={y}
            x2={TREND_CHART_WIDTH - TREND_CHART_PADDING.right}
            y2={y}
            stroke="currentColor"
            className="text-[var(--zf-border-subtle)] opacity-60"
            strokeDasharray="2 3"
            strokeWidth="0.8"
          />
          <text
            x={TREND_CHART_PADDING.left - Y_LABEL_OFFSET_X}
            y={y + Y_LABEL_OFFSET_Y}
            textAnchor="end"
            className="fill-[var(--zf-text-muted)] text-[9px] font-mono"
          >
            {val}k
          </text>
        </g>
      );
    })}

    {data.map((d, i) => (
      <text
        key={d.time}
        x={scale.getX(i)}
        y={TREND_CHART_HEIGHT - X_LABEL_BOTTOM_OFFSET}
        textAnchor="middle"
        className="fill-[var(--zf-text-muted)] text-[9px] font-mono"
      >
        {d.time}
      </text>
    ))}
  </>
);
