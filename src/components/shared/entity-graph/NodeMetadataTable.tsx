import type { FC, ReactNode } from 'react';
import type { TopologyNode } from './entity-graph.types';

const MetadataRow: FC<{ label: string; valueClassName: string; children: ReactNode }> = ({
  label,
  valueClassName,
  children,
}) => (
  <div className="flex justify-between">
    <span className="text-slate-500">{label}</span>
    <span className={valueClassName}>{children}</span>
  </div>
);

export const NodeMetadataTable: FC<{ node: TopologyNode }> = ({ node }) => (
  <div className="space-y-2 text-[11px]">
    <MetadataRow label="Security Zone:" valueClassName="text-slate-200">
      {node.zone}
    </MetadataRow>
    {node.ip && (
      <MetadataRow label="IP Address:" valueClassName="text-slate-200">
        {node.ip}
      </MetadataRow>
    )}
    <MetadataRow label="Blast Radius Score:" valueClassName="text-rose-400 font-bold tabular-nums">
      {node.blastRadiusScore} / 100
    </MetadataRow>
    <MetadataRow label="Active Connections:" valueClassName="text-slate-200 tabular-nums">
      {node.activeConnections} sockets
    </MetadataRow>
    {node.openPorts.length > 0 && (
      <MetadataRow label="Observed Ports:" valueClassName="text-slate-300">
        {node.openPorts.join(', ')}
      </MetadataRow>
    )}
  </div>
);
