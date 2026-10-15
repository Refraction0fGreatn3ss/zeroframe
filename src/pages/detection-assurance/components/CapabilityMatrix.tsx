import type React from 'react';
import type { DetectionCapability } from '../../../types';
import { CapabilityRow } from './CapabilityRow';

const CAPABILITY_COLUMNS: readonly { label: string; className: string }[] = [
  { label: 'DETECTION CAPABILITY', className: 'py-3 px-4' },
  { label: 'CATEGORY', className: 'py-3 px-4' },
  { label: 'ASSURANCE STATE', className: 'py-3 px-4' },
  { label: 'REQUIRED FIDELITY', className: 'py-3 px-4' },
  { label: 'LAST CANARY AUDIT', className: 'py-3 px-4' },
  { label: 'ACTION', className: 'py-3 px-4 text-right' },
];

interface CapabilityMatrixProps {
  capabilities: DetectionCapability[];
  isCanaryRunning: boolean;
  onAudit: (detectorKey: string) => void;
}

export const CapabilityMatrix: React.FC<CapabilityMatrixProps> = ({ capabilities, isCanaryRunning, onAudit }) => (
  <div className="bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden">
    <div className="p-3 bg-zinc-900/60 border-b border-zinc-800 flex items-center justify-between text-xs font-mono">
      <span className="font-bold text-zinc-200">ACTIVE CAPABILITY MATRIX</span>
      <span className="text-zinc-500">{capabilities.length} Stateful Behavioral Detectors</span>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs font-mono">
        <thead className="bg-zinc-900/40 border-b border-zinc-800 text-zinc-400 text-[11px]">
          <tr>
            {CAPABILITY_COLUMNS.map((column) => (
              <th key={column.label} className={column.className}>
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-900 text-zinc-300">
          {capabilities.map((capability) => (
            <CapabilityRow
              key={capability.id}
              capability={capability}
              isCanaryRunning={isCanaryRunning}
              onAudit={onAudit}
            />
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
