import type React from 'react';
import { INCIDENT_STATE_OPTIONS } from '../incidents.data';
import type { IncidentState } from '../incidents.types';

interface IncidentStateSelectProps {
  state: IncidentState;
  onChange: (state: IncidentState) => void;
}

export const IncidentStateSelect: React.FC<IncidentStateSelectProps> = ({ state, onChange }) => (
  <div className="flex items-center gap-1.5 bg-[#060911] border border-slate-700 rounded px-2.5 py-1 text-xs font-mono">
    <span className="text-slate-400">State:</span>
    <select
      value={state}
      onChange={(e) => onChange(e.target.value as IncidentState)}
      className="bg-transparent text-slate-200 cursor-pointer outline-hidden"
    >
      {INCIDENT_STATE_OPTIONS.map((option) => (
        <option key={option.value} value={option.value} className="bg-[#0b121e]">
          {option.label}
        </option>
      ))}
    </select>
  </div>
);
