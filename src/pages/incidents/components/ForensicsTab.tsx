import type React from 'react';

export const ForensicsTab: React.FC = () => (
  <div className="space-y-3 font-mono text-xs">
    <div className="p-3 bg-[#080c14] border border-slate-800 rounded space-y-2">
      <div className="text-slate-300 font-semibold">Cryptographic Artifacts & IOC Ledger</div>
      <div className="space-y-1.5 text-[11px]">
        <div>
          <span className="text-slate-500">Primary Malicious Binary:</span>{' '}
          <span className="text-slate-200">svchost_upd.exe</span>
        </div>
        <div className="break-all">
          <span className="text-slate-500">SHA-256 Hash:</span>{' '}
          <code className="text-rose-400">a93f8e42b109c0d38194e21a8d424b91fe203a1194248a80194812f840912e84</code>
        </div>
        <div>
          <span className="text-slate-500">C2 Server JA4:</span>{' '}
          <code className="text-cyan-400">t13d1516h2_8daaf6152771_0278457224b8</code>
        </div>
        <div>
          <span className="text-slate-500">Evidence Block Hash:</span>{' '}
          <code className="text-emerald-400">0x7f48b901a92e1048b2914092b1a8</code>
        </div>
      </div>
    </div>

    <div className="p-3 bg-[#080c14] border border-slate-800 rounded space-y-1 text-slate-400">
      <div className="text-slate-300 font-semibold">Notary Chain-of-Custody Verification</div>
      <p className="text-[11px] leading-relaxed">
        All packet metadata, flow records, and Sysmon process events are cryptographically sealed in the immutable
        evidence ledger under NIST SP 800-86 standard guidelines.
      </p>
    </div>
  </div>
);
