import type { FC } from 'react';

interface TrustSummaryCard {
  label: string;
  value: string;
  valueClassName: string;
  detail: string;
}

const TRUST_SUMMARY_CARDS: TrustSummaryCard[] = [
  {
    label: 'Trust Domain Root',
    value: 'spiffe://zeroframe.corp',
    valueClassName: 'text-cyan-400',
    detail: 'Strict Mutual mTLS v1.3 Only (TLS_AES_256_GCM_SHA384)',
  },
  {
    label: 'Intermediate CA Key',
    value: 'ZeroFrame Intermediate Fleet CA 2026',
    valueClassName: 'text-emerald-400',
    detail: 'Hardware HSM-Backed (FIPS 140-3 Level 4)',
  },
  {
    label: 'Rotation Policy',
    value: '90-Day Automated Ephemeral Reissuance',
    valueClassName: 'text-purple-400',
    detail: 'Zero-Downtime Hot-Reload via SPIFFE Workload API',
  },
];

export const TrustDomainSummary: FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
    {TRUST_SUMMARY_CARDS.map((card) => (
      <div key={card.label} className="p-3 bg-[#101215] border border-[#20242a] rounded space-y-1">
        <span className="text-[10px] uppercase font-semibold text-zinc-500 block">{card.label}</span>
        <div className={`font-mono text-xs font-semibold ${card.valueClassName}`}>{card.value}</div>
        <span className="text-[10px] text-zinc-500 font-sans">{card.detail}</span>
      </div>
    ))}
  </div>
);
