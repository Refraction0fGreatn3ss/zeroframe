import type { FC } from 'react';

export const OutcomeSection: FC = () => (
  <div className="p-3.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 space-y-1">
    <span className="text-[10px] font-semibold uppercase tracking-wider block font-sans">
      5. Final Outcome & Open Recommendations
    </span>
    <p className="text-xs leading-relaxed text-[var(--zf-text-secondary)]">
      Host isolation permit PERMIT-2026-0041 approved by Approver 1. Micro-segmentation quarantine rule is active with a
      60-minute automatic rollback window. Accounting database integrity remains 100% intact.
    </p>
  </div>
);
