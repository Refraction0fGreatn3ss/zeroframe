import type { ThreatCategory } from './security-charts.types';

export const DONUT_SIZE = 160;
export const DONUT_CENTER = DONUT_SIZE / 2;
export const DONUT_RADIUS = 54;
export const DONUT_STROKE_WIDTH = 18;
export const DONUT_HOVER_STROKE_BOOST = 4;
export const DONUT_CIRCUMFERENCE = 2 * Math.PI * DONUT_RADIUS;

const SEGMENT_GAP = 1.5;

export interface DonutSegment {
  category: ThreatCategory;
  dashArray: string;
  dashOffset: number;
}

export const computeDonutSegments = (categories: ThreatCategory[]): DonutSegment[] => {
  let accumulatedLength = 0;

  return categories.map((category) => {
    const dashLength = (category.percentage / 100) * DONUT_CIRCUMFERENCE;
    const dashOffset = -accumulatedLength;
    accumulatedLength += dashLength;

    const visibleLength = Math.max(0, dashLength - SEGMENT_GAP);
    return {
      category,
      dashArray: `${visibleLength} ${DONUT_CIRCUMFERENCE - visibleLength}`,
      dashOffset,
    };
  });
};

export const sumCategoryCounts = (categories: ThreatCategory[]): number =>
  categories.reduce((acc, c) => acc + c.count, 0);
