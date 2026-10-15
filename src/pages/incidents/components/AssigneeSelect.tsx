import { UserCheck } from 'lucide-react';
import type React from 'react';
import { OPERATOR_OPTIONS } from '../incidents.data';

interface AssigneeSelectProps {
  assignee: string;
  onAssign: (operator: string) => void;
}

export const AssigneeSelect: React.FC<AssigneeSelectProps> = ({ assignee, onAssign }) => (
  <div className="flex items-center gap-1.5 bg-[#060911] border border-slate-700 rounded px-2.5 py-1 text-xs font-mono">
    <UserCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
    <span className="text-slate-400">Assignee:</span>
    <select
      value={assignee}
      onChange={(e) => onAssign(e.target.value)}
      className="bg-transparent text-slate-200 outline-hidden cursor-pointer"
      title="Assign incident to SOC Operator"
    >
      {OPERATOR_OPTIONS.map((operator) => (
        <option
          key={operator.name}
          value={operator.name}
          className={`bg-[#0b121e] ${operator.muted ? 'text-slate-400' : 'text-slate-200'}`}
        >
          {operator.name}
        </option>
      ))}
    </select>
  </div>
);
