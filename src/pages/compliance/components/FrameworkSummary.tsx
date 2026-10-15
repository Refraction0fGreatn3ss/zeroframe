import type React from 'react';
import type { ComplianceFrameworkSummary } from '../../../types/compliance';

interface FrameworkSummaryProps {
  framework: ComplianceFrameworkSummary;
}

export const FrameworkSummary: React.FC<FrameworkSummaryProps> = ({ framework }) => (
  <div className="p-3 bg-[#101215] border border-[#20242a] rounded flex flex-wrap items-center justify-between gap-3 text-xs">
    <div className="flex items-center gap-4 text-zinc-400">
      <div>
        Total Technical Controls: <span className="font-medium text-zinc-200">{framework.totalControls}</span>
      </div>
      <div>
        Evidenced on Wire: <span className="font-medium text-emerald-400">{framework.evidencedCount}</span>
      </div>
      <div>
        Stale / Partial Evidence: <span className="font-medium text-amber-400">{framework.staleCount}</span>
      </div>
      <div>
        Missing Evidence: <span className="font-medium text-rose-400">{framework.missingCount}</span>
      </div>
    </div>

    <div className="text-zinc-400">
      Readiness index: <span className="font-semibold text-emerald-400">{framework.readinessPercentage}%</span>
    </div>
  </div>
);
