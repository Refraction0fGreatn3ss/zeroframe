import type { FC } from 'react';
import { BLAST_RADIUS_POLICY_LINES } from '../governed-response-studio.data';

export const BlastRadiusPolicySummary: FC = () => (
  <div className="p-3 bg-[#131518] rounded border border-[#20242a] text-xs space-y-1 text-zinc-400">
    <span className="font-semibold text-zinc-300 block">Blast-Radius Policy Evaluation:</span>
    {BLAST_RADIUS_POLICY_LINES.map((line) => (
      <div key={line}>• {line}</div>
    ))}
  </div>
);
