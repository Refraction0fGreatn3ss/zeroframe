import { CheckCircle2, ShieldCheck } from 'lucide-react';
import type { FC } from 'react';
import { PREFLIGHT_CHECKS } from '../fleet.data';

export const PreflightChecksTable: FC = () => (
  <div className="bg-[#101215] border border-[#20242a] rounded overflow-hidden">
    <div className="p-3 bg-[#14171c] border-b border-[#20242a] flex items-center justify-between">
      <span className="text-xs font-semibold text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
        <ShieldCheck className="w-4 h-4 text-emerald-400" />
        <span>10-Point Deployment Preflight Verification Matrix</span>
      </span>
      <span className="text-[11px] font-mono text-emerald-400">10 / 10 CHECKS PASSED (100% ASSURANCE)</span>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs font-sans">
        <thead className="bg-[#12151a] border-b border-[#20242a] text-zinc-400 text-[11px] font-medium">
          <tr>
            <th className="py-2.5 px-3">Check ID</th>
            <th className="py-2.5 px-3">Preflight Verification Name</th>
            <th className="py-2.5 px-3">Target Subsystem</th>
            <th className="py-2.5 px-3">Measured Telemetry Metric</th>
            <th className="py-2.5 px-3">Execution Latency</th>
            <th className="py-2.5 px-3 text-right">Verdict</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#181b20] text-zinc-300">
          {PREFLIGHT_CHECKS.map((chk) => (
            <tr key={chk.id} className="hover:bg-[#15181e] transition-colors">
              <td className="py-2 px-3 font-mono text-cyan-400 text-[11px] font-semibold">{chk.id}</td>
              <td className="py-2 px-3 font-medium text-zinc-200">{chk.name}</td>
              <td className="py-2 px-3 font-mono text-zinc-400 text-[11px]">{chk.target}</td>
              <td className="py-2 px-3 font-mono text-slate-300 text-[11px]">{chk.metric}</td>
              <td className="py-2 px-3 font-mono text-zinc-400 text-[11px]">{chk.latency}</td>
              <td className="py-2 px-3 text-right">
                <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>PASSED</span>
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
