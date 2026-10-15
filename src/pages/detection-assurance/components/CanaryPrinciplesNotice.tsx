import { ShieldCheck } from 'lucide-react';
import type React from 'react';

const CANARY_PRINCIPLES: readonly string[] = [
  'Canaries are strictly non-destructive and rate-limited.',
  'Canaries are signed by the Witness Notary and never trigger destructive containment actions.',
  'If mirror port drops packets or telemetry stalls, assurance status degrades automatically.',
];

export const CanaryPrinciplesNotice: React.FC = () => (
  <div className="p-4 rounded-lg bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-400 space-y-1">
    <div className="flex items-center gap-2 font-bold text-emerald-400">
      <ShieldCheck className="w-4 h-4" />
      <span>ZEROFLASH CANARY ASSURANCE PRINCIPLES</span>
    </div>
    {CANARY_PRINCIPLES.map((principle) => (
      <div key={principle}>• {principle}</div>
    ))}
  </div>
);
