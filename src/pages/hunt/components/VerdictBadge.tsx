import type React from 'react';
import type { FlowVerdict } from '../hunt.types';

interface VerdictBadgeProps {
  verdict: FlowVerdict;
}

export const VerdictBadge: React.FC<VerdictBadgeProps> = ({ verdict }) => {
  if (verdict === 'MALICIOUS') {
    return (
      <span className="text-rose-400 font-semibold text-[10px] flex items-center justify-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
        <span>MAL</span>
      </span>
    );
  }
  if (verdict === 'SUSPICIOUS') {
    return (
      <span className="text-amber-400 font-semibold text-[10px] flex items-center justify-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
        <span>SUSP</span>
      </span>
    );
  }
  return (
    <span className="text-slate-500 text-[10px] flex items-center justify-center gap-1">
      <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
      <span>NOM</span>
    </span>
  );
};
