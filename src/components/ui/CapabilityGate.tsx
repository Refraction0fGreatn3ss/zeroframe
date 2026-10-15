import { Ban, HelpCircle, Loader2 } from 'lucide-react';
import type { FC, ReactNode } from 'react';
import type { CapabilityState } from '../../lib/capability-state';
import { useCapability } from '../../stores/capability-store';

interface CapabilityGateProps {
  capability?: string;
  children: ReactNode;
}

const NOTICES: Partial<Record<CapabilityState, { text: string; className: string }>> = {
  UNAVAILABLE: {
    text: 'This capability is reported as unavailable or degraded by the backend. Data shown may be incomplete.',
    className: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
  },
  UNKNOWN: {
    text: 'The backend has not confirmed support for this capability. Nothing here is assumed to be supported.',
    className: 'border-slate-500/30 bg-slate-500/10 text-slate-300',
  },
  STALE: {
    text: 'The capability manifest is stale. Support state may have changed.',
    className: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
  },
};

export const CapabilityGate: FC<CapabilityGateProps> = ({ capability, children }) => {
  const state = useCapability(capability);

  if (state === 'LOADING') {
    return (
      <div role="status" className="flex items-center gap-2 p-6 text-xs text-[var(--zf-text-muted)]">
        <Loader2 className="w-4 h-4 animate-spin motion-reduce:animate-none" aria-hidden="true" /> Checking backend
        capability…
      </div>
    );
  }

  if (state === 'UNSUPPORTED') {
    return (
      <div
        role="status"
        className="m-6 p-6 border border-dashed border-[var(--zf-border-subtle)] rounded text-center space-y-1"
      >
        <Ban className="w-5 h-5 mx-auto text-[var(--zf-text-muted)]" aria-hidden="true" />
        <p className="text-xs font-semibold text-[var(--zf-text-primary)]">Not supported by this backend</p>
        <p className="text-[11px] text-[var(--zf-text-secondary)]">
          The capability manifest does not include <span className="font-mono">{capability}</span>.
        </p>
      </div>
    );
  }

  const notice = NOTICES[state];
  return (
    <>
      {notice && (
        <div
          role="status"
          className={`mx-4 mt-3 px-3 py-1.5 rounded border text-[11px] flex items-center gap-2 ${notice.className}`}
        >
          <HelpCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          <span>
            <span className="font-mono">{capability}</span>: {notice.text}
          </span>
        </div>
      )}
      {children}
    </>
  );
};
