import { Check, Cpu, Download, ShieldAlert } from 'lucide-react';
import type React from 'react';

interface ResponseActionRailProps {
  isContained: boolean;
  processKilled: boolean;
  isExtractingPcap: boolean;
  onRequestIsolation: () => void;
  onExtractPcap: () => void;
}

export const ResponseActionRail: React.FC<ResponseActionRailProps> = ({
  isContained,
  processKilled,
  isExtractingPcap,
  onRequestIsolation,
  onExtractPcap,
}) => (
  <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={onRequestIsolation}
        className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors ${
          isContained
            ? 'bg-emerald-950/80 border border-emerald-500/40 text-emerald-300'
            : 'bg-rose-950/70 hover:bg-rose-900/80 border border-rose-500/50 text-rose-200'
        }`}
        title="Route to Governed Response Studio for dual-custody authorization permit"
      >
        {isContained ? (
          <>
            <Check className="w-3.5 h-3.5" />
            <span>Host Isolated (Dual-Custody Permit)</span>
          </>
        ) : (
          <>
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Request Governed Host Isolation</span>
          </>
        )}
      </button>

      <button
        type="button"
        onClick={onRequestIsolation}
        className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors ${
          processKilled
            ? 'bg-slate-800 text-slate-400 border border-slate-700'
            : 'bg-amber-950/70 hover:bg-amber-900/80 border border-amber-500/50 text-amber-200'
        }`}
        title="Route to Governed Response Studio for dual-operator execution permit"
      >
        <Cpu className="w-3.5 h-3.5" />
        <span>{processKilled ? 'Process Tree Terminated' : 'Request Process Kill Permit'}</span>
      </button>

      <button
        type="button"
        disabled={isExtractingPcap}
        onClick={onExtractPcap}
        className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer text-slate-200 transition-colors disabled:opacity-50"
        title="Wire directly to evidenceService.startPcapCapture()"
      >
        <Download className={`w-3.5 h-3.5 text-cyan-400 ${isExtractingPcap ? 'animate-bounce' : ''}`} />
        <span>{isExtractingPcap ? 'Extracting Buffer...' : 'Extract 100MB PCAP Slice'}</span>
      </button>
    </div>

    <span className="text-[11px] font-mono text-slate-500">Evidence Ledger: Block #8819 Verified</span>
  </div>
);
