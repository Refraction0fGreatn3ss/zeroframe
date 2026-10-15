import type React from 'react';

export const TimelineTab: React.FC = () => (
  <div className="space-y-3 font-mono text-xs">
    <div className="p-3 rounded bg-[#080c14] border border-slate-800 space-y-1">
      <div className="flex items-center justify-between text-[11px]">
        <span className="text-cyan-400 font-semibold">19:48:22.408 — WIRE INGRESS</span>
        <span className="text-slate-500">tap-core-01</span>
      </div>
      <div className="text-slate-200">
        Inbound TLS 1.3 Client Hello received on 10.140.2.88:443 from Netherlands IP 185.220.101.44
      </div>
      <div className="text-[11px] text-slate-500">
        JA4 fingerprint t13d1516h2_8daaf6152771 matches Cobalt Strike malleable C2 profile.
      </div>
    </div>

    <div className="p-3 rounded bg-[#080c14] border border-slate-800 space-y-1">
      <div className="flex items-center justify-between text-[11px]">
        <span className="text-amber-400 font-semibold">19:48:23.102 — HOST EXECUTION</span>
        <span className="text-slate-500">Sysmon Event 1</span>
      </div>
      <div className="text-slate-200">w3wp.exe spawned cmd.exe with encoded PowerShell payload</div>
      <div className="text-[11px] text-slate-500">
        Parent PID 3108 ➔ Child PID 4920 · Base64 payload decoded to download stage-2 beacon.
      </div>
    </div>

    <div className="p-3 rounded bg-[#080c14] border border-slate-800 space-y-1">
      <div className="flex items-center justify-between text-[11px]">
        <span className="text-rose-400 font-semibold">19:48:24.890 — LATERAL WIRE MOVEMENT</span>
        <span className="text-slate-500">Wire Frame #8812901</span>
      </div>
      <div className="text-slate-200">SMB/RPC Named Pipe binding to Domain Controller (10.140.10.5)</div>
      <div className="text-[11px] text-slate-500">
        Attempted PsExec service creation on \pipe\svcctl without valid Kerberos ticket.
      </div>
    </div>
  </div>
);
