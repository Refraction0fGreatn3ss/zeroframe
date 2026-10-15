import { Download, FileCode } from 'lucide-react';
import type React from 'react';
import type { FlowInspectorState } from '../hooks/use-flow-inspector';
import { HexDumpView } from './HexDumpView';
import { InspectorTabs } from './InspectorTabs';
import { Ja4ProfileView } from './Ja4ProfileView';
import { OwnershipKeyView } from './OwnershipKeyView';
import { ProtocolDissectionView } from './ProtocolDissectionView';

interface PacketInspectorProps {
  inspector: FlowInspectorState;
  onExtractPcap: () => void;
}

export const PacketInspector: React.FC<PacketInspectorProps> = ({ inspector, onExtractPcap }) => {
  const { selectedFlow, activeTab, setActiveTab, copiedJa4, copyJa4 } = inspector;

  return (
    <div className="xl:col-span-5 bg-[#090d16] border border-slate-800 rounded overflow-hidden flex flex-col">
      <div className="p-3 bg-[#0d121f] border-b border-slate-800 flex items-center justify-between">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <FileCode className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-xs font-semibold text-slate-100 font-sans">Packet Dissection Inspector</span>
            <span className="font-mono text-[10px] text-cyan-400 font-bold">{selectedFlow.flowId}</span>
          </div>
          <div className="text-[10px] font-mono text-slate-400">
            {selectedFlow.srcIp}:{selectedFlow.srcPort} &rarr; {selectedFlow.dstIp}:{selectedFlow.dstPort}
          </div>
        </div>

        <InspectorTabs activeTab={activeTab} onChange={setActiveTab} />
      </div>

      <div className="p-3 bg-[#060911] space-y-3 min-h-[300px]">
        {activeTab === 'HEX' && <HexDumpView flow={selectedFlow} />}
        {activeTab === 'DISSECTION' && <ProtocolDissectionView flow={selectedFlow} />}
        {activeTab === 'ATTRIBUTES' && <Ja4ProfileView flow={selectedFlow} copied={copiedJa4} onCopy={copyJa4} />}
        {activeTab === '7D_KEY' && <OwnershipKeyView flow={selectedFlow} />}
      </div>

      <div className="p-2.5 bg-[#0d121f] border-t border-slate-800 flex items-center justify-between text-xs font-mono">
        <span className="text-slate-400 text-[11px]">Wire interface: {selectedFlow.interfaceId}</span>
        <button
          type="button"
          onClick={onExtractPcap}
          className="px-2.5 py-1 rounded bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
        >
          <Download className="w-3 h-3" />
          <span>Extract Flow PCAP</span>
        </button>
      </div>
    </div>
  );
};
