import type { FC } from 'react';
import { GOVERNOR_STATES } from '../inspection-integrity.data';
import type { GovernorState } from '../inspection-integrity.types';
import { getGovernorStateClassName } from '../inspection-integrity.utils';

interface GovernorStateBannerProps {
  governorState: GovernorState;
  onChange: (state: GovernorState) => void;
}

export const GovernorStateBanner: FC<GovernorStateBannerProps> = ({ governorState, onChange }) => (
  <div className="p-4 bg-[#101215] border border-[#20242a] rounded flex flex-col sm:flex-row sm:items-center justify-between gap-3">
    <div>
      <div className="flex items-center gap-2">
        <span className="text-xs uppercase font-semibold text-zinc-400">Current Governor State:</span>
        <span
          className={`font-mono text-xs font-bold px-2.5 py-0.5 rounded border ${getGovernorStateClassName(governorState)}`}
        >
          {governorState}
        </span>
      </div>
      <p className="text-xs text-zinc-400 mt-1">
        Dynamic telemetry throttling protects kernel ring buffers and browser DOM responsiveness without silent event
        loss.
      </p>
    </div>

    <div className="flex items-center gap-1.5 flex-wrap">
      {GOVERNOR_STATES.map((st) => (
        <button
          type="button"
          key={st}
          onClick={() => onChange(st)}
          className={`px-2 py-1 text-[10px] font-mono rounded cursor-pointer transition-colors ${
            governorState === st ? 'bg-cyan-500 text-black font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          {st}
        </button>
      ))}
    </div>
  </div>
);
