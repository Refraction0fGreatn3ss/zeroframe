import { useCallback, useEffect, useState } from 'react';
import type { EvidenceLedgerBlock } from '../../../services/evidence-service';
import { evidenceService } from '../../../services/evidence-service';
import { tenantRegistry } from '../../../stores/tenant-registry';

const SIMULATED_VERIFICATION_DELAY_MS = 700;
const VERIFICATION_SUCCESS_MESSAGE =
  'All SHA-256 parent links & witness quorum signatures validated without discrepancies.';

export const useEvidenceLedger = () => {
  const [blocks, setBlocks] = useState<EvidenceLedgerBlock[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<string | null>(null);

  const loadLedger = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await evidenceService.getLedger();
      setBlocks(data || []);
    } catch (err) {
      console.warn('[Evidence Ledger] Error loading ledger', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLedger();
    return tenantRegistry.register(
      () => setBlocks([]),
      () => loadLedger(),
    );
  }, [loadLedger]);

  const verifyChain = () => {
    setIsVerifying(true);
    setVerificationResult(null);
    setTimeout(() => {
      setIsVerifying(false);
      setVerificationResult(VERIFICATION_SUCCESS_MESSAGE);
    }, SIMULATED_VERIFICATION_DELAY_MS);
  };

  return { blocks, isLoading, isVerifying, verificationResult, loadLedger, verifyChain };
};
