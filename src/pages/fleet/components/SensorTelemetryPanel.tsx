import type { FC } from 'react';
import { SecurityStatusBadge } from '../../../components/shared/SecurityStatusBadge';
import { formatNumber } from '../../../lib/utils';
import type { SensorNode } from '../../../types/fleet';

interface SensorTelemetryPanelProps {
  sensor: SensorNode;
}

export const SensorTelemetryPanel: FC<SensorTelemetryPanelProps> = ({ sensor }) => (
  <div className="space-y-4 text-xs">
    <div className="p-3 bg-[#131518] rounded border border-[#23272e] space-y-2">
      <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
        Authoritative Security States
      </span>
      <div className="grid grid-cols-2 gap-2 text-zinc-300">
        <div>
          <span className="text-zinc-500 block text-[10px]">Lifecycle:</span>
          <SecurityStatusBadge state={sensor.lifecycle} size="sm" showDot={false} />
        </div>
        <div>
          <span className="text-zinc-500 block text-[10px]">Connectivity:</span>
          <SecurityStatusBadge state={sensor.connectivity} size="sm" />
        </div>
        <div>
          <span className="text-zinc-500 block text-[10px]">Daemon Health:</span>
          <SecurityStatusBadge state={sensor.health} size="sm" />
        </div>
        <div>
          <span className="text-zinc-500 block text-[10px]">Observation:</span>
          <SecurityStatusBadge state={sensor.observation} size="sm" />
        </div>
      </div>
    </div>

    <div className="p-3 bg-[#131518] rounded border border-[#23272e] space-y-2">
      <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
        Capture & Wire Statistics
      </span>
      <div className="space-y-1 text-zinc-300">
        <div className="flex justify-between">
          <span className="text-zinc-500">Interface:</span>
          <span className="font-mono text-zinc-200">{sensor.interfaceName} (Promiscuous)</span>
        </div>
        <div className="flex justify-between">
          <span className="text-zinc-500">Wire Throughput:</span>
          <span className="font-mono text-zinc-200">{sensor.wireThroughputMbps} Mbps</span>
        </div>
        <div className="flex justify-between">
          <span className="text-zinc-500">Packet Rate:</span>
          <span className="font-mono text-zinc-200">{formatNumber(sensor.packetRatePps)} pps</span>
        </div>
        <div className="flex justify-between">
          <span className="text-zinc-500">Kernel Buffer Drops:</span>
          <span className={`font-mono ${sensor.kernelDropsPps > 0 ? 'text-amber-400' : 'text-zinc-200'}`}>
            {sensor.kernelDropsPps} pps
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-zinc-500">Pending Outbox Queue:</span>
          <span className="font-mono text-zinc-200">{sensor.outboxPendingEvents} events</span>
        </div>
      </div>
    </div>
  </div>
);
