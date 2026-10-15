import type { FC } from 'react';
import type { ThreatCategory } from './security-charts.types';

const ACTIVE_SWATCH_SCALE = 'scale(1.2)';

interface DonutLegendProps {
  categories: ThreatCategory[];
  activeId: string | null;
  onActiveChange: (id: string | null) => void;
}

export const DonutLegend: FC<DonutLegendProps> = ({ categories, activeId, onActiveChange }) => (
  <div className="flex-1 w-full space-y-1.5 min-w-0">
    {categories.map((cat) => {
      const isActive = activeId === cat.id;
      return (
        <div
          key={cat.id}
          onMouseEnter={() => onActiveChange(cat.id)}
          onMouseLeave={() => onActiveChange(null)}
          className={`flex items-center justify-between p-1.5 rounded transition-all cursor-pointer text-xs ${
            isActive
              ? 'bg-[var(--zf-surface-card-hover)] text-[var(--zf-text-primary)] font-semibold shadow-xs'
              : 'text-[var(--zf-text-secondary)] hover:bg-[var(--zf-surface-subtle)]'
          }`}
        >
          <div className="flex items-center gap-2 truncate pr-2 min-w-0">
            <span
              className="w-2.5 h-2.5 rounded-xs shrink-0 transition-transform"
              style={{
                backgroundColor: cat.color,
                transform: isActive ? ACTIVE_SWATCH_SCALE : 'none',
              }}
            />
            <span className="truncate text-[11px]">{cat.label}</span>
          </div>

          <div className="flex items-center gap-2 font-mono text-[11px] shrink-0">
            <span className="text-[var(--zf-text-primary)] font-bold">{cat.count}</span>
            <span className="text-[var(--zf-text-muted)] w-8 text-right text-[10px]">{cat.percentage}%</span>
          </div>
        </div>
      );
    })}
  </div>
);
