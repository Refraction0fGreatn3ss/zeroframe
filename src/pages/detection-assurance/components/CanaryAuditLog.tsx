import type React from 'react';
import { SecurityStatusBadge } from '../../../components/shared/SecurityStatusBadge';
import type { CanaryAuditRecord } from '../../../stores/detection-assurance-store';

interface CanaryAuditLogProps {
  auditLog: CanaryAuditRecord[];
}

export const CanaryAuditLog: React.FC<CanaryAuditLogProps> = ({ auditLog }) => (
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
);
