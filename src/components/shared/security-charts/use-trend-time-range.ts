import { useState } from 'react';
import { DEFAULT_TREND_TIME_RANGE } from './security-charts.data';
import type { TrendTimeRange } from './security-charts.types';

/** Supports both controlled (`timeRange` + `onChange`) and uncontrolled usage. */
export const useTrendTimeRange = (
  controlledRange: TrendTimeRange | undefined,
  onChange: ((range: TrendTimeRange) => void) | undefined,
) => {
  const [internalRange, setInternalRange] = useState<TrendTimeRange>(DEFAULT_TREND_TIME_RANGE);

  const activeRange = controlledRange || internalRange;

  const setRange = (range: TrendTimeRange) => {
    if (onChange) {
      onChange(range);
    } else {
      setInternalRange(range);
    }
  };

  return { activeRange, setRange };
};
