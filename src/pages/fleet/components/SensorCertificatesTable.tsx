import { KeyRound } from 'lucide-react';
import type { FC } from 'react';
import type { SensorNode } from '../../../types/fleet';
import { formatCertSerial, toDateOnly } from '../fleet.utils';

interface SensorCertificatesTableProps {
  sensors: SensorNode[];
  onSelectSensor: (sensor: SensorNode) => void;
}

export const SensorCertificatesTable: FC<SensorCertificatesTableProps> = ({ sensors, onSelectSensor }) => (
  <div className="bg-[#101215] border border-[#20242a] rounded overflow-hidden">
    <div className="p-3 bg-[#14171c] border-b border-[#20242a] flex items-center justify-between">
      <span className="text-xs font-semibold text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
        <KeyRound className="w-4 h-4 text-cyan-400" />
        <span>Sensor mTLS X.509 Certificates & Rotation Lifecycle</span>
      </span>
      <span className="text-[11px] font-mono text-zinc-400">{sensors.length} ACTIVE ATTESTED NODES</span>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs font-sans">
        <thead className="bg-[#12151a] border-b border-[#20242a] text-zinc-400 text-[11px] font-medium">
          <tr>
            <th className="py-2.5 px-3">SPIFFE Workload ID</th>
            <th className="py-2.5 px-3">Subject Distinguished Name</th>
            <th className="py-2.5 px-3">Certificate Serial</th>
            <th className="py-2.5 px-3">SHA-256 Fingerprint</th>
            <th className="py-2.5 px-3">Valid Until</th>
            <th className="py-2.5 px-3">Trust Domain</th>
            <th className="py-2.5 px-3 text-right">Rotation State</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#181b20] text-zinc-300">
          {sensors.map((s, idx) => (
            <tr
              key={s.id}
              onClick={() => onSelectSensor(s)}
              className="hover:bg-[#15181e] cursor-pointer transition-colors"
            >
              <td className="py-2.5 px-3 font-mono text-cyan-300 font-semibold">{s.spiffeId}</td>
              <td className="py-2.5 px-3 font-mono text-[11px] text-zinc-200">
                CN={s.hostname}, O=ZeroFrame Enterprise
              </td>
              <td className="py-2.5 px-3 font-mono text-zinc-400 text-[11px]">{formatCertSerial(idx)}</td>
              <td className="py-2.5 px-3 font-mono text-zinc-500 text-[10px] truncate max-w-[140px]">
                {s.certFingerprintSha256}
              </td>
              <td className="py-2.5 px-3 font-mono text-emerald-400 text-[11px]">{toDateOnly(s.certExpiresAt)}</td>
              <td className="py-2.5 px-3 font-mono text-zinc-300 text-[11px]">zeroframe.corp</td>
              <td className="py-2.5 px-3 text-right">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  VALID (Nominal)
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
