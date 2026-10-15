import { FileCode } from 'lucide-react';
import type { FC } from 'react';
import type { OtProtocolPacket } from '../scada-ot.types';
import { HexDumpView } from './HexDumpView';
import { IncidentResponseActions } from './IncidentResponseActions';
import { MitreIcsAttribution } from './MitreIcsAttribution';
import { PacketTargetSummary } from './PacketTargetSummary';

interface PacketInspectorPanelProps {
  packet: OtProtocolPacket;
  onOpenIncidentDossier: () => void;
  onExportPcap: () => void;
}

export const PacketInspectorPanel: FC<PacketInspectorPanelProps> = ({
  packet,
  onOpenIncidentDossier,
  onExportPcap,
}) => (
  <div className="xl:col-span-5 bg-[#090d16] border border-slate-800 rounded overflow-hidden flex flex-col">
    <div className="p-3 bg-[#0d121f] border-b border-slate-800 text-xs font-mono flex items-center justify-between">
      <div className="flex items-center gap-2">
        <FileCode className="w-3.5 h-3.5 text-cyan-400" />
        <span className="font-semibold text-slate-200">SCADA Dissection: {packet.id}</span>
      </div>
      <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-amber-300 font-bold">
        {packet.protocol}
      </span>
    </div>

    <div className="p-4 space-y-4 font-mono text-xs">
      <PacketTargetSummary packet={packet} />
      <MitreIcsAttribution tactic={packet.mitreIcsTactic} />
      <HexDumpView lines={packet.hexDump} />
      <IncidentResponseActions onOpenIncidentDossier={onOpenIncidentDossier} onExportPcap={onExportPcap} />
    </div>
  </div>
);
