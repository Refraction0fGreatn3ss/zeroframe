/**
 * Execution Permits Page
 * Manages dual-control authorizations, Witness notary consensus, and cryptographic co-signatures.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { WitnessPermitCard } from '../components/shared/WitnessComponents';
import { ExportButton } from '../components/shared/ExportButton';
import { responseService, ExecutionPermitRecord } from '../services/response-service';
import { realtimeClient } from '../services/realtime-client';
import { tenantRegistry } from '../stores/tenant-registry';

export const ExecutionPermitsPage: React.FC = () => {
  const [permits, setPermits] = useState<ExecutionPermitRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [approvingId, setApprovingId] = useState<string | null>(null);

  const loadPermits = useCallback(async () => {
    setLoading(true);
    try {
      const livePermits = await responseService.getPermits();
      setPermits(livePermits || []);
    } catch (err) {
      console.warn('Failed to load permits from backend authority', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPermits();

    const unsubIssued = realtimeClient.subscribe('PERMIT_ISSUED', (newPermit: ExecutionPermitRecord) => {
      setPermits((prev) => [newPermit, ...prev.filter((p) => p.id !== newPermit.id)]);
    });

    const unsubApproved = realtimeClient.subscribe('PERMIT_APPROVED', (approvedPermit: ExecutionPermitRecord) => {
      setPermits((prev) =>
        prev.map((p) => (p.id === approvedPermit.id ? approvedPermit : p))
      );
    });

    const unreg = tenantRegistry.register(
      () => setPermits([]),
      async () => {
        await loadPermits();
      }
    );

    return () => {
      unsubIssued();
      unsubApproved();
      unreg();
    };
  }, [loadPermits]);

  const handleApprove = async (permitId: string) => {
    setApprovingId(permitId);
    try {
      const updated = await responseService.approvePermit(permitId);
      setPermits((prev) => prev.map((p) => (p.id === permitId ? updated : p)));
    } catch (err) {
      console.error('Failed to approve permit', err);
    } finally {
      setApprovingId(null);
    }
  };

  return (
    <div className="p-5 space-y-5 text-[#e6edf3] max-w-[1520px] mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#20242a]">
        <div>
          <h1 className="text-lg font-semibold text-zinc-100 tracking-tight">Execution Permits & Dual Custody</h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Cryptographic permits required before any active containment action is executed on the network.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <ExportButton resourceName="Execution Permits" recordCount={permits.length} data={permits} />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {permits.length === 0 ? (
          <div className="col-span-2 py-12 text-center text-zinc-500 font-mono text-xs bg-[#101215] border border-[#20242a] rounded">
            {loading ? 'Querying backend authority for execution permits...' : 'No execution permits recorded for this tenant scope.'}
          </div>
        ) : (
          permits.map((p) => (
            <WitnessPermitCard
              key={p.id}
              permitId={p.id}
              action={p.actionType || 'Host Containment'}
              target={p.targetResource}
              blastRadiusScore={p.blastRadiusValidated ? 28 : 65}
              approver1={{
                name: p.approver1 || p.requestedBy || 'Security Lead',
                status: 'APPROVED',
                timestamp: p.requestedAt,
              }}
              approver2={{
                name: p.approver2 || 'Duty SecOps Lead',
                status: p.approver2 || p.status === 'AUTHORIZED' || p.status === 'EXECUTED' ? 'APPROVED' : 'PENDING',
              }}
              witnessNotaryStatus={
                p.status === 'AUTHORIZED' || p.status === 'EXECUTED'
                  ? 'VERIFIED'
                  : p.status === 'REJECTED'
                  ? 'REJECTED'
                  : 'PENDING_QUORUM'
              }
              onApprove={() => handleApprove(p.id)}
              isApproving={approvingId === p.id}
            />
          ))
        )}
      </div>
    </div>
  );
};
