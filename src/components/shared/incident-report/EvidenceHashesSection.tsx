import type { FC } from 'react';
import { ReportSection } from './ReportSection';

const SEALED_PCAP_BLOCK_ID = 'EVD-PCAP-0881';
const SEALED_PCAP_SHA256 = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';

export const EvidenceHashesSection: FC = () => (
  <ReportSection title="4. Cryptographic Evidence Ledger Hashes">
    <div className="p-3 rounded bg-[var(--zf-surface-card)] border border-[var(--zf-border-subtle)] font-mono text-[11px] space-y-1.5">
      <div className="flex items-center justify-between text-[10px] text-[var(--zf-text-muted)] border-b border-[var(--zf-border-subtle)] pb-1">
        <span>SEALED EVIDENCE BLOCK</span>
        <span>SHA-256 HASH CHAIN</span>
      </div>
      <div className="flex items-center justify-between">
        <span>{SEALED_PCAP_BLOCK_ID}</span>
        <span className="text-emerald-400">{SEALED_PCAP_SHA256}</span>
      </div>
      <div className="flex items-center justify-between">
        <span>WITNESS QUORUM</span>
        <span className="text-[var(--zf-text-primary)]">3/3 Byzantine Nodes Verified & Timestamped</span>
      </div>
    </div>
  </ReportSection>
);
