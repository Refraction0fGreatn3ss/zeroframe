import type React from 'react';
import { LedgerHeader } from './components/LedgerHeader';
import { LedgerTable } from './components/LedgerTable';
import { VerificationBanner } from './components/VerificationBanner';
import { useEvidenceLedger } from './hooks/use-evidence-ledger';

export const EvidenceLedgerPage: React.FC = () => {
  const { blocks, isLoading, isVerifying, verificationResult, loadLedger, verifyChain } = useEvidenceLedger();

  return (
    <div className="p-4 sm:p-5 space-y-4 text-[var(--zf-text-primary)] max-w-[1520px] mx-auto font-sans select-none">
      <LedgerHeader isLoading={isLoading} isVerifying={isVerifying} onSync={loadLedger} onVerify={verifyChain} />

      {verificationResult && <VerificationBanner message={verificationResult} />}

      <LedgerTable blocks={blocks} isLoading={isLoading} />
    </div>
  );
};
