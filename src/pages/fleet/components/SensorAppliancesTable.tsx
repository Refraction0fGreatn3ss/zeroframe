import { Cpu } from 'lucide-react';
import type { FC } from 'react';
import { SecurityStatusBadge } from '../../../components/shared/SecurityStatusBadge';
import { timeAgo } from '../../../lib/utils';
import type { SensorNode } from '../../../types/fleet';

interface SensorAppliancesTableProps {
  sensors: SensorNode[];
  onSelectSensor: (sensor: SensorNode) => void;
}

export const SensorAppliancesTable: FC<SensorAppliancesTableProps> = ({ sensors, onSelectSensor }) => (
  <div className="bg-[#101215] border border-[#20242a] rounded overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs font-sans">
        <thead className="bg-[#14171c] border-b border-[#20242a] text-zinc-400 text-[11px] font-medium">
          <tr>
            <th className="py-2.5 px-3">Sensor Appliance</th>
            <th className="py-2.5 px-3">Site / Location</th>
            <th className="py-2.5 px-3">Connectivity</th>
            <th className="py-2.5 px-3">Health</th>
            <th className="py-2.5 px-3">Observation</th>
            <th className="py-2.5 px-3">mTLS Trust</th>
            <th className="py-2.5 px-3">Capture Driver</th>
            <th className="py-2.5 px-3">Version</th>
            <th className="py-2.5 px-3 text-right">Heartbeat</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#181b20] text-zinc-300">
          {sensors.map((sensor) => (
            <tr
              key={sensor.id}
              onClick={() => onSelectSensor(sensor)}
              className="hover:bg-[#15181e] cursor-pointer transition-colors"
            >
              <td className="py-2.5 px-3">
                <div className="font-semibold text-zinc-100 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{sensor.name}</span>
                </div>
                <div className="font-mono text-[11px] text-zinc-500">{sensor.managementIp}</div>
              </td>
              <td className="py-2.5 px-3 text-zinc-300">{sensor.site}</td>
              <td className="py-2.5 px-3">
                <SecurityStatusBadge state={sensor.connectivity} size="sm" />
              </td>
              <td className="py-2.5 px-3">
                <SecurityStatusBadge state={sensor.health} size="sm" />
              </td>
              <td className="py-2.5 px-3">
                <SecurityStatusBadge state={sensor.observation} size="sm" />
              </td>
              <td className="py-2.5 px-3">
                <SecurityStatusBadge state={sensor.trust} size="sm" />
              </td>
              <td className="py-2.5 px-3 font-mono text-[11px] text-zinc-300">
                {sensor.captureDriver} (Q{sensor.activeQueue})
              </td>
              <td className="py-2.5 px-3 font-mono text-[11px] text-zinc-400">{sensor.version}</td>
              <td className="py-2.5 px-3 text-right font-mono text-[11px] text-zinc-400">
                {timeAgo(sensor.lastHeartbeat)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
