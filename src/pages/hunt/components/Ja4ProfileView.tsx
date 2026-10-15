import { Check, Copy } from 'lucide-react';
import type React from 'react';
import type { WireFlow } from '../hunt.types';

const DEFAULT_ATTRIBUTION = 'Cobalt Strike C2 Profile';

interface Ja4ProfileViewProps {
  flow: WireFlow;
  copied: boolean;
  onCopy: () => void;
}

export const Ja4ProfileView: React.FC<Ja4ProfileViewProps> = ({ flow, copied, onCopy }) => (
  <div className="font-mono text-xs space-y-2 text-slate-300">
    <div className="p-2.5 rounded bg-[#090d16] border border-slate-800 space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-slate-400">Client JA4 Fingerprint:</span>
        <button
          type="button"
          onClick={onCopy}
          className="text-cyan-400 hover:text-cyan-300 text-[10px] flex items-center gap-1 cursor-pointer"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          <span>{copied ? 'Copied' : 'Copy JA4'}</span>
        </button>
      </div>
      <code className="text-rose-400 break-all text-[11px] block">{flow.ja4}</code>
    </div>

    <div className="p-2.5 rounded bg-[#090d16] border border-slate-800 space-y-1">
      <span className="text-slate-400">Server JA4S Fingerprint:</span>
      <code className="text-cyan-300 break-all text-[11px] block">{flow.ja4s}</code>
    </div>

    <div className="p-2.5 rounded bg-[#090d16] border border-slate-800 space-y-1">
      <span className="text-slate-400">Attribution & MITRE ATT&CK:</span>
      <div className="text-amber-300 font-semibold text-[11px]">{flow.mitreTactic || DEFAULT_ATTRIBUTION}</div>
    </div>
  </div>
);
