import type { FC } from 'react';

export const RingBufferStatusBar: FC = () => (
  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
    <div className="p-3 bg-[#0b101d] border border-slate-800 rounded flex items-center justify-between">
      <div className="space-y-0.5">
        <div className="text-[10px] font-mono uppercase text-slate-500 font-semibold">Kernel Ring Buffer</div>
        <div className="text-sm font-mono font-bold text-slate-100">256 MB AF_XDP</div>
      </div>
      <span className="text-[10px] font-mono text-emerald-400 font-semibold">94.2% Headroom</span>
    </div>

    <div className="p-3 bg-[#0b101d] border border-slate-800 rounded flex items-center justify-between">
      <div className="space-y-0.5">
        <div className="text-[10px] font-mono uppercase text-slate-500 font-semibold">Sensor Interface</div>
        <div className="text-sm font-mono font-bold text-slate-100">10 Gbps Optical SFP28</div>
      </div>
      <span className="text-[10px] font-mono text-cyan-400 font-semibold">TAP-CORE-01</span>
    </div>

    <div className="p-3 bg-[#0b101d] border border-slate-800 rounded flex items-center justify-between">
      <div className="space-y-0.5">
        <div className="text-[10px] font-mono uppercase text-slate-500 font-semibold">Frame Drop Counter</div>
        <div className="text-sm font-mono font-bold text-emerald-400">0 Drops (Zero Loss)</div>
      </div>
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
    </div>

    <div className="p-3 bg-[#0b101d] border border-slate-800 rounded flex items-center justify-between">
      <div className="space-y-0.5">
        <div className="text-[10px] font-mono uppercase text-slate-500 font-semibold">Forensic Ledger Seal</div>
        <div className="text-sm font-mono font-bold text-slate-100">FIPS 180-4 Compliant</div>
      </div>
      <span className="text-[10px] font-mono text-cyan-400 font-semibold">SHA-256</span>
    </div>
  </div>
);
