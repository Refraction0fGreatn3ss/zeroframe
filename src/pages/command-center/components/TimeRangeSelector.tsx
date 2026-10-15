import type React from 'react';
import { TIME_RANGE_OPTIONS } from '../command-center.data';
import type { TimeRange } from '../command-center.types';

interface TimeRangeSelectorProps {
  value: TimeRange;
  onChange: (range: TimeRange) => void;
}

export const TimeRangeSelector: React.FC<TimeRangeSelectorProps> = ({ value, onChange }) => (
  <div className="flex items-center bg-[#080c14] border border-slate-800 rounded p-0.5 text-xs font-mono">
    {TIME_RANGE_OPTIONS.map((range) => (
      <button
        type="button"
        key={range}
        onClick={() => onChange(range)}
        className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
          value === range ? 'bg-slate-800 text-cyan-300 font-semibold shadow-xs' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        {range}
      </button>
    ))}
  </div>
);
