import { useTenantScopedList } from '../../../hooks/use-tenant-scoped-list';
import { evidenceService } from '../../../services/evidence-service';
import type { EvidenceItem } from '../evidence-center.types';
import { combineEvidenceSources } from '../evidence-center.utils';

const fetchEvidenceItems = async (): Promise<EvidenceItem[]> => {
  const [ledger, captures] = await Promise.all([evidenceService.getLedger(), evidenceService.getPcapCaptures()]);
  return combineEvidenceSources(ledger, captures);
};

export const useEvidenceItems = () => {
  const { items, isLoading } = useTenantScopedList(
    'evidence-items',
    fetchEvidenceItems,
    'Failed to load live evidence artifacts',
  );
  return { items, isLoading };
};
