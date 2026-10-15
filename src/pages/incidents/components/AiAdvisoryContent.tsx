import { Download, Search, Server } from 'lucide-react';
import type React from 'react';

interface AiAdvisoryContentProps {
  victimHostname: string;
  isExtractingPcap: boolean;
  onPivotToNetwork: () => void;
  onPivotToEntities: () => void;
  onExtractPcap: () => void;
}

export const AiAdvisoryContent: React.FC<AiAdvisoryContentProps> = ({
  victimHostname,
  isExtractingPcap,
  onPivotToNetwork,
  onPivotToEntities,
  onExtractPcap,
}) => (
  <div className="p-3 space-y-2.5 text-slate-300 font-sans">
    <div>
      <span className="text-[11px] font-mono font-semibold text-indigo-300 uppercase tracking-wide block mb-0.5">
        1. Incident Explanation
      </span>
      <p className="text-xs leading-relaxed text-slate-300">
        The adversary leveraged a web exploitation vector targeting the IIS Worker Process (
        <code className="text-slate-200 bg-slate-900 px-1 py-0.5 rounded font-mono">w3wp.exe</code>), spawning an
        obfuscated PowerShell execution tree. The malware acquired SYSTEM tokens and established persistent outbound TLS
        beaconing over TCP 443 with a 60-second jitter cadence matching known Cobalt Strike malleable C2 profiles.
      </p>
    </div>

    <div>
      <span className="text-[11px] font-mono font-semibold text-indigo-300 uppercase tracking-wide block mb-0.5">
        2. Evidence Summarization
      </span>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 font-mono text-[11px]">
        <div className="p-2 rounded bg-[#090e1a] border border-slate-800/80">
          <span className="text-slate-500 block text-[10px]">JA4 Fingerprint:</span>
          <code className="text-cyan-300 break-all">t13d1516h2_8daaf6152771_0278457224b8</code>
        </div>
        <div className="p-2 rounded bg-[#090e1a] border border-slate-800/80">
          <span className="text-slate-500 block text-[10px]">Wire Footprint:</span>
          <span className="text-slate-200">48KB Outbound Beacon / 14 Packets</span>
        </div>
        <div className="p-2 rounded bg-[#090e1a] border border-slate-800/80">
          <span className="text-slate-500 block text-[10px]">Lateral Pipe:</span>
          <code className="text-rose-300">\pipe\svcctl (PsExec RPC)</code>
        </div>
      </div>
    </div>

    <div>
      <span className="text-[11px] font-mono font-semibold text-indigo-300 uppercase tracking-wide block mb-1">
        3. Suggested Tactical Pivots
      </span>
      <div className="flex flex-wrap gap-2 font-mono text-[11px]">
        <button
          type="button"
          onClick={onPivotToNetwork}
          className="px-2.5 py-1 rounded bg-[#101728] hover:bg-[#18233c] border border-cyan-800/50 text-cyan-300 flex items-center gap-1.5 cursor-pointer transition-colors"
        >
          <Search className="w-3 h-3" />
          <span>Pivot to Network Flow (JA4: t13d1516h2...)</span>
        </button>
        <button
          type="button"
          onClick={onPivotToEntities}
          className="px-2.5 py-1 rounded bg-[#101728] hover:bg-[#18233c] border border-purple-800/50 text-purple-300 flex items-center gap-1.5 cursor-pointer transition-colors"
        >
          <Server className="w-3 h-3" />
          <span>Pivot to Entity Graph ({victimHostname})</span>
        </button>
        <button
          type="button"
          onClick={onExtractPcap}
          disabled={isExtractingPcap}
          className="px-2.5 py-1 rounded bg-[#101728] hover:bg-[#18233c] border border-slate-700 text-slate-300 flex items-center gap-1.5 cursor-pointer transition-colors"
        >
          <Download className="w-3 h-3 text-cyan-400" />
          <span>Extract 100MB Ring Buffer PCAP</span>
        </button>
      </div>
    </div>

    <div>
      <span className="text-[11px] font-mono font-semibold text-indigo-300 uppercase tracking-wide block mb-0.5">
        4. Governed Response Rationale
      </span>
      <p className="text-xs leading-relaxed text-slate-400">
        Immediate host quarantine via dual-operator permit is recommended to sever active outbound C2 socket
        communication while preserving volatile memory on the target host for root-cause forensic acquisition. Automated
        unilateral action is suppressed under strict governed response rules.
      </p>
    </div>
  </div>
);
