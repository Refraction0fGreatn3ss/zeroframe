import { CheckCircle2, ShieldCheck } from 'lucide-react';
import type { FC } from 'react';

export const BrowserProtectionPanel: FC = () => (
  <div className="bg-[#101215] border border-[#20242a] rounded p-4 space-y-3">
    <span className="text-xs font-semibold text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
      <ShieldCheck className="w-4 h-4 text-emerald-400" />
      <span>Browser DOM Protection & Stream Backpressure Telemetry</span>
    </span>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
      <div className="p-3 bg-[#0b0e13] rounded border border-[#181b20] space-y-1">
        <span className="text-zinc-500 text-[10px] uppercase font-semibold block">CircuitBreaker Status</span>
        <div className="text-emerald-400 font-mono font-semibold flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>ARMED & NOMINAL (0 Trips)</span>
        </div>
        <p className="text-zinc-400 text-[10px]">
          Trips automatically if browser event bus exceeds 25,000 events/sec to prevent DOM freezing.
        </p>
      </div>

      <div className="p-3 bg-[#0b0e13] rounded border border-[#181b20] space-y-1">
        <span className="text-zinc-500 text-[10px] uppercase font-semibold block">MaxRows Buffer Cap</span>
        <div className="text-cyan-400 font-mono font-semibold">10,000 Rows Hard Limit</div>
        <p className="text-zinc-400 text-[10px]">
          Enforces virtual windowing decimation so memory usage never leaks beyond 85 MB in tab session.
        </p>
      </div>

      <div className="p-3 bg-[#0b0e13] rounded border border-[#181b20] space-y-1">
        <span className="text-zinc-500 text-[10px] uppercase font-semibold block">Adaptive Decimation</span>
        <div className="text-purple-400 font-mono font-semibold">OFF (Raw 1:1 Ingestion Active)</div>
        <p className="text-zinc-400 text-[10px]">
          Automatically aggregates non-critical events 10:1 if browser frame rate falls below 30 FPS.
        </p>
      </div>
    </div>
  </div>
);
