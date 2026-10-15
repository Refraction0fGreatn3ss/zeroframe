/**
 * Live Detection Assurance Page
 * Continuous mathematical detection verification via safe signed canaries.
 */

import React from 'react';
import { useDetectionAssuranceStore } from '../stores/detection-assurance-store';
import { SecurityStatusBadge } from '../components/shared/SecurityStatusBadge';
import { ExportButton } from '../components/shared/ExportButton';
import { timeAgo } from '../lib/utils';
import { Radio, ShieldCheck, Play, CheckCircle, AlertTriangle, Clock } from 'lucide-react';

export const DetectionAssurancePage: React.FC = () => {
  const { capabilities, auditLog, isCanaryRunning, triggerManualCanary } = useDetectionAssuranceStore();

  return (
    <div className="p-6 space-y-6 text-zinc-100 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Live Continuous Detection Assurance</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Real-time verification that security detectors are operational right now using non-destructive signed canaries.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <ExportButton resourceName="Detection Capability Matrix" recordCount={capabilities.length} data={capabilities} />
        </div>
      </div>

      {/* Canary Explanation Notice */}
      <div className="p-4 rounded-lg bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-400 space-y-1">
        <div className="flex items-center gap-2 font-bold text-emerald-400">
          <ShieldCheck className="w-4 h-4" />
          <span>ZEROFLASH CANARY ASSURANCE PRINCIPLES</span>
        </div>
        <div>• Canaries are strictly non-destructive and rate-limited.</div>
        <div>• Canaries are signed by the Witness Notary and never trigger destructive containment actions.</div>
        <div>• If mirror port drops packets or telemetry stalls, assurance status degrades automatically.</div>
      </div>

      {/* Capabilities Table */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden">
        <div className="p-3 bg-zinc-900/60 border-b border-zinc-800 flex items-center justify-between text-xs font-mono">
          <span className="font-bold text-zinc-200">ACTIVE CAPABILITY MATRIX</span>
          <span className="text-zinc-500">{capabilities.length} Stateful Behavioral Detectors</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-zinc-900/40 border-b border-zinc-800 text-zinc-400 text-[11px]">
              <tr>
                <th className="py-3 px-4">DETECTION CAPABILITY</th>
                <th className="py-3 px-4">CATEGORY</th>
                <th className="py-3 px-4">ASSURANCE STATE</th>
                <th className="py-3 px-4">REQUIRED FIDELITY</th>
                <th className="py-3 px-4">LAST CANARY AUDIT</th>
                <th className="py-3 px-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900 text-zinc-300">
              {capabilities.map((cap) => (
                <tr key={cap.id} className="hover:bg-zinc-900/40">
                  <td className="py-3 px-4 font-sans font-semibold text-zinc-100">
                    <div>{cap.name}</div>
                    <div className="text-[11px] font-mono text-zinc-500 font-normal">{cap.detectorKey}</div>
                    {cap.degradationReason && (
                      <div className="text-[10px] text-amber-400 font-mono mt-1">
                        ⚠ {cap.degradationReason}
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4 text-zinc-400">{cap.category}</td>
                  <td className="py-3 px-4">
                    <SecurityStatusBadge state={cap.assuranceState} size="sm" />
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-900 text-emerald-400 border border-zinc-800">
                      {cap.requiredTelemetry}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-zinc-400 text-[11px]">
                    <div>{cap.lastCanaryTimestamp ? timeAgo(cap.lastCanaryTimestamp) : 'Pending'}</div>
                    <div className="text-[10px] text-zinc-600 truncate max-w-[140px]">
                      {cap.lastCanarySignedHash}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => triggerManualCanary(cap.detectorKey)}
                      disabled={isCanaryRunning}
                      className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 text-zinc-300 text-xs font-mono cursor-pointer transition-colors"
                    >
                      Audit Now
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Canary Audit Trail */}
      <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-lg space-y-3 font-mono text-xs">
        <h3 className="font-bold text-zinc-200">RECENT CANARY AUDIT LOG</h3>
        <div className="space-y-2">
          {auditLog.map((log) => (
            <div
              key={log.id}
              className="p-2.5 rounded bg-zinc-900/40 border border-zinc-800/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px]"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-zinc-200">{log.detectorName}</span>
                  <span className="text-zinc-500">({log.syntheticPayloadType})</span>
                </div>
                <div className="text-zinc-500 text-[10px]">
                  Witness Signature: {log.witnessSignature} · Latency: {log.latencyMs}ms
                </div>
              </div>
              <SecurityStatusBadge state={log.result} size="sm" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
