import type { FC } from 'react';
import {
  computeDonutSegments,
  DONUT_CENTER,
  DONUT_HOVER_STROKE_BOOST,
  DONUT_RADIUS,
  DONUT_SIZE,
  DONUT_STROKE_WIDTH,
} from './donut-chart.utils';
import type { ThreatCategory } from './security-charts.types';

interface DonutRingProps {
  categories: ThreatCategory[];
  totalCount: number;
  activeId: string | null;
  onActiveChange: (id: string | null) => void;
}

export const DonutRing: FC<DonutRingProps> = ({ categories, totalCount, activeId, onActiveChange }) => {
  const segments = computeDonutSegments(categories);
  const activeCategory = activeId ? categories.find((c) => c.id === activeId) : undefined;

  return (
    <div className="relative w-36 h-36 shrink-0 flex items-center justify-center select-none">
      <svg
        role="img"
        aria-label="Threat distribution"
        width={DONUT_SIZE}
        height={DONUT_SIZE}
        viewBox={`0 0 ${DONUT_SIZE} ${DONUT_SIZE}`}
        className="rotate-[-90deg] w-full h-full overflow-visible"
      >
        <circle
          cx={DONUT_CENTER}
          cy={DONUT_CENTER}
          r={DONUT_RADIUS}
          fill="none"
          stroke="currentColor"
          className="text-[var(--zf-border-subtle)] opacity-40"
          strokeWidth={DONUT_STROKE_WIDTH}
        />

        {segments.map(({ category, dashArray, dashOffset }) => (
          <circle
            key={category.id}
            cx={DONUT_CENTER}
            cy={DONUT_CENTER}
            r={DONUT_RADIUS}
            fill="none"
            stroke={category.color}
            strokeWidth={activeId === category.id ? DONUT_STROKE_WIDTH + DONUT_HOVER_STROKE_BOOST : DONUT_STROKE_WIDTH}
            strokeDasharray={dashArray}
            strokeDashoffset={dashOffset}
            className="transition-all duration-150 cursor-pointer"
            onMouseEnter={() => onActiveChange(category.id)}
            onMouseLeave={() => onActiveChange(null)}
          />
        ))}
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center select-none">
        <span className="text-xl font-mono font-bold text-[var(--zf-text-primary)] leading-none">
          {activeId ? activeCategory?.count : totalCount}
        </span>
        <span className="text-[10px] text-[var(--zf-text-muted)] uppercase tracking-wider font-sans mt-1">
          {activeId ? `${activeCategory?.percentage}%` : 'Total'}
        </span>
      </div>
    </div>
  );
};
