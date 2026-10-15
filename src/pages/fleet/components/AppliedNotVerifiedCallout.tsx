import { AlertTriangle } from 'lucide-react';
import type { FC } from 'react';

export const AppliedNotVerifiedCallout: FC = () => (
  <div className="p-4 bg-amber-950/20 border border-amber-600/40 rounded space-y-2">
    <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs">
      <AlertTriangle className="w-4 h-4 shrink-0" />
      <span>CRITICAL ARCHITECTURE MANDATE: Applied != Verified</span>
    </div>
    <p className="text-xs text-zinc-300 leading-relaxed font-sans">
      A sensor node that has successfully applied an eBPF / AF_XDP wire policy is{' '}
      <strong className="text-amber-300">not considered authoritative</strong> until the autonomous verification canary
      loops have injected, captured, and cryptographically verified test vectors across that specific observation point.
      Premature certainty is strictly prohibited.
    </p>
  </div>
);
