import { type FC, useState } from 'react';
import type { TrendDataPoint } from './security-charts.types';
import { TrendAxes } from './TrendAxes';
import { TrendHoverTargets } from './TrendHoverTargets';
import { TrendMarkers } from './TrendMarkers';
import { TrendTooltip } from './TrendTooltip';
import {
  buildTrendSeriesPaths,
  createTrendChartScale,
  DETECTIONS_COLOR,
  EVENTS_COLOR,
  getTooltipLeftPercent,
  TREND_CHART_HEIGHT,
  TREND_CHART_WIDTH,
} from './trend-chart.utils';

interface TrendChartCanvasProps {
  data: TrendDataPoint[];
}

export const TrendChartCanvas: FC<TrendChartCanvasProps> = ({ data }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const scale = createTrendChartScale(data.length);
  const { eventsPath, eventsArea, detectionsPath, detectionsArea } = buildTrendSeriesPaths(data, scale);
  const hoveredPoint = hoveredIndex !== null ? data[hoveredIndex] : null;

  return (
    <div className="relative w-full aspect-[3/1] max-h-56 min-h-[170px] select-none overflow-hidden">
      <svg
        viewBox={`0 0 ${TREND_CHART_WIDTH} ${TREND_CHART_HEIGHT}`}
        className="w-full h-full"
        role="img"
        aria-label="Security event trend"
      >
        <defs>
          <linearGradient id="zf-events-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={EVENTS_COLOR} stopOpacity="0.22" />
            <stop offset="100%" stopColor={EVENTS_COLOR} stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id="zf-detections-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={DETECTIONS_COLOR} stopOpacity="0.24" />
            <stop offset="100%" stopColor={DETECTIONS_COLOR} stopOpacity="0.0" />
          </linearGradient>
        </defs>

        <TrendAxes data={data} scale={scale} />

        <path d={eventsArea} fill="url(#zf-events-gradient)" />
        <path d={detectionsArea} fill="url(#zf-detections-gradient)" />

        <path d={eventsPath} fill="none" stroke={EVENTS_COLOR} strokeWidth="1.8" strokeLinecap="round" />
        <path d={detectionsPath} fill="none" stroke={DETECTIONS_COLOR} strokeWidth="1.8" strokeLinecap="round" />

        <TrendMarkers data={data} scale={scale} />

        <TrendHoverTargets data={data} scale={scale} hoveredIndex={hoveredIndex} onHoverChange={setHoveredIndex} />
      </svg>

      {hoveredPoint && hoveredIndex !== null && (
        <TrendTooltip point={hoveredPoint} leftPercent={getTooltipLeftPercent(hoveredIndex, data.length)} />
      )}
    </div>
  );
};
