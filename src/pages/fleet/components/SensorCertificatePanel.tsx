import type { FC } from 'react';
import type { SensorNode } from '../../../types/fleet';
import { toDateOnly } from '../fleet.utils';

interface SensorCertificatePanelProps {
  sensor: SensorNode;
}

export const SensorCertificatePanel: FC<SensorCertificatePanelProps> = ({ sensor }) => (
  <div className="space-y-3 text-xs">
    <div className="p-3 bg-[#131518] rounded border border-[#23272e] space-y-2 font-mono text-[11px]">
      <span className="font-sans font-semibold text-zinc-300 text-xs block">mTLS X.509 Identity Dossier</span>
      <div className="text-zinc-400">
        SPIFFE ID: <span className="text-cyan-300">{sensor.spiffeId}</span>
      </div>
      <div className="text-zinc-400">
        Subject: <span className="text-zinc-200">CN={sensor.hostname}, O=ZeroFrame Enterprise</span>
      </div>
      <div className="text-zinc-400">
        Issuer: <span className="text-zinc-200">ZeroFrame Intermediate Fleet CA 2026</span>
      </div>
      <div className="text-zinc-400">
        Serial: <span className="text-zinc-300">4F:9A:88:21:BC:01:E4</span>
      </div>
      <div className="text-zinc-400">
        Expiry Date: <span className="text-emerald-400 font-semibold">{toDateOnly(sensor.certExpiresAt)}</span>
      </div>
      <div className="text-zinc-500 text-[10px] break-all pt-1 border-t border-slate-800">
        SHA-256 Fingerprint: {sensor.certFingerprintSha256}
      </div>
    </div>

    <div className="space-y-1.5">
      <span className="text-xs font-semibold text-zinc-300 block">Certificate Rotation History</span>
      <div className="space-y-1.5 font-mono text-[11px]">
        <div className="p-2 rounded bg-[#11141a] border border-slate-800 flex justify-between items-center">
          <div>
            <div className="text-zinc-200 font-sans text-xs">Automated 90-Day Renewal</div>
            <div className="text-[10px] text-zinc-500">2026-01-01 · Hot-Reload Verified</div>
          </div>
          <span className="text-[10px] text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">
            SUCCESS
          </span>
        </div>
      </div>
    </div>
  </div>
);
