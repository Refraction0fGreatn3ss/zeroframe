import type { TrendDataPoint } from './security-charts.types';

export const TREND_CHART_WIDTH = 640;
export const TREND_CHART_HEIGHT = 180;
export const TREND_CHART_PADDING = {
  left: 40,
  right: 24,
  top: 20,
  bottom: 26,
} as const;

export const MAX_EVENTS_SCALE = 600;
export const MAX_DETECTIONS_SCALE = 70;
export const EVENT_GRID_TICKS = [0, 150, 300, 450, 600];

export const EVENTS_COLOR = '#38bdf8';
export const DETECTIONS_COLOR = '#f59e0b';
export const INCIDENT_COLOR = '#f43f5e';

const TOOLTIP_MIN_LEFT_PCT = 6;
const TOOLTIP_TRACK_PCT = 78;
const TOOLTIP_MAX_LEFT_PCT = 70;

export interface TrendChartScale {
  chartWidth: number;
  chartHeight: number;
  baselineY: number;
  getX: (index: number) => number;
  getYEvents: (value: number) => number;
  getYDetections: (value: number) => number;
}

export const createTrendChartScale = (pointCount: number): TrendChartScale => {
  const { left, right, top, bottom } = TREND_CHART_PADDING;
  const chartWidth = TREND_CHART_WIDTH - left - right;
  const chartHeight = TREND_CHART_HEIGHT - top - bottom;

  const projectY = (value: number, max: number) => top + chartHeight - (Math.min(value, max) / max) * chartHeight;

  return {
    chartWidth,
    chartHeight,
    baselineY: top + chartHeight,
    getX: (index) => left + (index / Math.max(1, pointCount - 1)) * chartWidth,
    getYEvents: (value) => projectY(value, MAX_EVENTS_SCALE),
    getYDetections: (value) => projectY(value, MAX_DETECTIONS_SCALE),
  };
};

export interface TrendSeriesPaths {
  eventsPath: string;
  eventsArea: string;
  detectionsPath: string;
  detectionsArea: string;
}

export const buildTrendSeriesPaths = (data: TrendDataPoint[], scale: TrendChartScale): TrendSeriesPaths => {
  const { getX, getYEvents, getYDetections, baselineY } = scale;
  const areaClosure = ` L ${getX(data.length - 1)},${baselineY} L ${getX(0)},${baselineY} Z`;

  const eventsPath = `M ${data.map((d, i) => `${getX(i)},${getYEvents(d.totalEvents)}`).join(' L ')}`;
  const detectionsPath = `M ${data.map((d, i) => `${getX(i)},${getYDetections(d.detections)}`).join(' L ')}`;

  return {
    eventsPath,
    eventsArea: `${eventsPath}${areaClosure}`,
    detectionsPath,
    detectionsArea: `${detectionsPath}${areaClosure}`,
  };
};

export const getTooltipLeftPercent = (index: number, pointCount: number): number =>
  Math.min(
    Math.max(TOOLTIP_MIN_LEFT_PCT, (index / Math.max(1, pointCount - 1)) * TOOLTIP_TRACK_PCT),
    TOOLTIP_MAX_LEFT_PCT,
  );
