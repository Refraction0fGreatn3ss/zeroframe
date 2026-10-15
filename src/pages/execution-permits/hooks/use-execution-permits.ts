import { useEffect, useState } from 'react';
import { useTenantScopedList } from '../../../hooks/use-tenant-scoped-list';
import { realtimeClient } from '../../../services/realtime-client';
import type { ExecutionPermitRecord } from '../../../services/response-service';
import { responseService } from '../../../services/response-service';

const fetchPermits = (): Promise<ExecutionPermitRecord[]> => responseService.getPermits();

const upsertPermit = (permits: ExecutionPermitRecord[], permit: ExecutionPermitRecord): ExecutionPermitRecord[] => [
  permit,
  ...permits.filter((existing) => existing.id !== permit.id),
];

const replacePermit = (permits: ExecutionPermitRecord[], permit: ExecutionPermitRecord): ExecutionPermitRecord[] =>
  permits.map((existing) => (existing.id === permit.id ? permit : existing));

export const useExecutionPermits = () => {
  const {
    items: permits,
    setItems: setPermits,
    isLoading,
  } = useTenantScopedList(fetchPermits, 'Failed to load permits from backend authority');
  const [approvingId, setApprovingId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribeIssued = realtimeClient.subscribe('PERMIT_ISSUED', (issued: ExecutionPermitRecord) => {
      setPermits((prev) => upsertPermit(prev, issued));
    });

    const unsubscribeApproved = realtimeClient.subscribe('PERMIT_APPROVED', (approved: ExecutionPermitRecord) => {
      setPermits((prev) => replacePermit(prev, approved));
    });

    return () => {
      unsubscribeIssued();
      unsubscribeApproved();
    };
  }, [setPermits]);

  const approvePermit = async (permitId: string) => {
    setApprovingId(permitId);
    try {
      const updated = await responseService.approvePermit(permitId);
      setPermits((prev) => prev.map((permit) => (permit.id === permitId ? updated : permit)));
    } catch (err) {
      console.error('Failed to approve permit', err);
    } finally {
      setApprovingId(null);
    }
  };

  return { permits, isLoading, approvingId, approvePermit };
};
