import { AlertCircle, CheckCircle } from 'lucide-react';
import type React from 'react';
import type { ResultState } from '../hunt.types';

interface ResultStateBannerProps {
  resultState: ResultState;
  flowCount: number;
  onToggle: () => void;
}

export const ResultStateBanner: React.FC<ResultStateBannerProps> = ({ resultState, flowCount, onToggle }) => {
  const isComplete = resultState === 'COMPLETE';

  return (
    <div
      className={`p-2.5 rounded border text-xs font-mono flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-xs ${
        isComplete
          ? 'bg-[#061410] border-emerald-800/60 text-emerald-300'
          : 'bg-[#180e0c] border-amber-800/60 text-amber-300'
      }`}
    >
      <div className="flex items-center gap-2">
        {isComplete ? (
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
        ) : (
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
        )}
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold tracking-tight">
              {isComplete ? 'Result State: COMPLETE' : 'Result State: PARTIAL / TRUNCATED'}
            </span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/40 border border-current font-semibold">
              {isComplete ? 'AUTHORITATIVE 100%' : 'BUFFER CEILING'}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {isComplete
              ? `All ${flowCount} wire flows in query window fully indexed · 0 packets dropped · Deterministic capture`
              : `Result limit ceiling reached (showing ${flowCount} flows of 14,208 total matching packets in interval) · High-load ring buffer truncation active on tap-core-01`}
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={onToggle}
        className="px-2.5 py-1 rounded text-[10px] font-mono bg-black/50 hover:bg-black/70 border border-slate-700 text-slate-300 shrink-0 cursor-pointer self-start sm:self-center"
        title="Toggle between Complete and Truncated result states"
      >
        Toggle Result State ({isComplete ? 'Simulate Truncated' : 'Simulate Complete'})
      </button>
    </div>
  );
};
