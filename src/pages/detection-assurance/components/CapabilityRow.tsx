import type React from 'react';
import { SecurityStatusBadge } from '../../../components/shared/SecurityStatusBadge';
import { timeAgo } from '../../../lib/utils';
import type { DetectionCapability } from '../../../types';

interface CapabilityRowProps {
  capability: DetectionCapability;
  isCanaryRunning: boolean;
  onAudit: (detectorKey: string) => void;
}

export const CapabilityRow: React.FC<CapabilityRowProps> = ({ capability, isCanaryRunning, onAudit }) => (
  <tr className="hover:bg-zinc-900/40">
    <td className="py-3 px-4 font-sans font-semibold text-zinc-100">
      <div>{capability.name}</div>
      <div className="text-[11px] font-mono text-zinc-500 font-normal">{capability.detectorKey}</div>
      {capability.degradationReason && (
        <div className="text-[10px] text-amber-400 font-mono mt-1">⚠ {capability.degradationReason}</div>
      )}
    </td>
    <td className="py-3 px-4 text-zinc-400">{capability.category}</td>
    <td className="py-3 px-4">
      <SecurityStatusBadge state={capability.assuranceState} size="sm" />
    </td>
    <td className="py-3 px-4">
      <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-900 text-emerald-400 border border-zinc-800">
        {capability.requiredTelemetry}
      </span>
    </td>
    <td className="py-3 px-4 text-zinc-400 text-[11px]">
      <div>{capability.lastCanaryTimestamp ? timeAgo(capability.lastCanaryTimestamp) : 'Pending'}</div>
      <div className="text-[10px] text-zinc-600 truncate max-w-[140px]">{capability.lastCanarySignedHash}</div>
    </td>
    <td className="py-3 px-4 text-right">
      <button
        type="button"
        onClick={() => onAudit(capability.detectorKey)}
        disabled={isCanaryRunning}
        className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 text-zinc-300 text-xs font-mono cursor-pointer transition-colors"
      >
        Audit Now
      </button>
    </td>
  </tr>
);
