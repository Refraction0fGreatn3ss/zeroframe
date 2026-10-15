import type React from 'react';
import type { OperatingMode } from '../../../types';
import { OPERATING_MODE_OPTIONS } from './top-bar.data';
import { getOperatingModeSelectClass, toSelectableOperatingMode } from './top-bar.utils';

interface OperatingModeSelectProps {
  operatingMode: OperatingMode;
  onChange: (mode: OperatingMode) => void;
}

export const OperatingModeSelect: React.FC<OperatingModeSelectProps> = ({ operatingMode, onChange }) => (
  <div className="hidden lg:flex items-center gap-1.5 pl-2 sm:pl-2.5 border-l border-[var(--zf-border-subtle)]">
    <select
      value={toSelectableOperatingMode(operatingMode)}
      onChange={(e) => onChange(e.target.value as OperatingMode)}
      className={`border text-[11px] rounded px-2 py-1 outline-hidden cursor-pointer font-sans font-medium transition-colors ${getOperatingModeSelectClass(
        operatingMode,
      )}`}
      title="Operating Mode: Active Protection, Monitor Only, Maintenance, or Stopped"
    >
      {OPERATING_MODE_OPTIONS.map((option) => (
        <option key={option.value} value={option.value} className={option.optionClassName}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);
