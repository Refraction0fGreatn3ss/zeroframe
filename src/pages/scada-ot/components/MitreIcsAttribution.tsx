import type { FC } from 'react';

interface MitreIcsAttributionProps {
  tactic: string;
}

export const MitreIcsAttribution: FC<MitreIcsAttributionProps> = ({ tactic }) => (
  <div className="p-3 bg-[#0f111a] border border-rose-900/60 rounded space-y-1.5">
    <div className="flex items-center justify-between text-[10px] uppercase font-bold text-rose-400 tracking-wider">
      <span>MITRE ATT&CK for ICS</span>
      <span className="px-1 py-0.5 rounded bg-rose-500/20 text-rose-300">T0855</span>
    </div>
    <div className="text-xs font-semibold text-slate-100">{tactic}</div>
    <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
      Adversary injected a direct Function Code 05 command from an unauthenticated IP address (192.168.100.99) outside
      of scheduled maintenance window.
    </p>
  </div>
);
