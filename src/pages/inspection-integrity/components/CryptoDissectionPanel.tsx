import { Lock } from 'lucide-react';
import type { FC } from 'react';
import { formatNumber } from '../../../lib/utils';
import type { CryptoInspectionMetrics } from '../../../types/inspection';

interface CryptoDissectionPanelProps {
  crypto: CryptoInspectionMetrics;
}

export const CryptoDissectionPanel: FC<CryptoDissectionPanelProps> = ({ crypto }) => (
  <div className="p-4 bg-[#101215] border border-[#20242a] rounded space-y-3 shadow-xs">
    <h3 className="font-semibold text-zinc-200 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
      <Lock className="w-3.5 h-3.5 text-purple-400" />
      <span>Cryptographic Dissection Truth</span>
    </h3>
    <div className="space-y-1.5 text-zinc-300">
      <div className="flex justify-between py-1 border-b border-[#20242a]">
        <span>JA4 / JA4S Fingerprints:</span>
        <span className="text-zinc-100 font-mono">{formatNumber(crypto.ja4FingerprintedFlows)} Sessions</span>
      </div>
      <div className="flex justify-between py-1 border-b border-[#20242a]">
        <span>TLS 1.3 Encrypted Client Hello:</span>
        <span className="text-amber-400 font-mono font-semibold">{crypto.echDetectedCount} Blind Spots</span>
      </div>
      <div className="flex justify-between py-1 border-b border-[#20242a]">
        <span>DNS-over-HTTPS (DoH) Tunnels:</span>
        <span className="text-amber-400 font-mono font-semibold">{crypto.dohTunnelCandidates} Candidates</span>
      </div>
      <div className="flex justify-between py-1">
        <span>Decryption Claim Policy:</span>
        <span className="text-emerald-400 font-mono">No Deceptive Decryption Claim</span>
      </div>
    </div>
  </div>
);
