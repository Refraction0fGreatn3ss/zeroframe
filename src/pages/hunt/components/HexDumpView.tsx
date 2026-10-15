import type React from 'react';
import type { WireFlow } from '../hunt.types';
import { formatHexOffset } from '../hunt.utils';

interface HexDumpViewProps {
  flow: WireFlow;
}

export const HexDumpView: React.FC<HexDumpViewProps> = ({ flow }) => (
  <div className="font-mono text-[11px] space-y-1.5">
    <div className="flex items-center justify-between text-[10px] text-slate-500 pb-1 border-b border-slate-800/80">
      <span>Offset</span>
      <span className="hidden sm:inline">Hexadecimal Payload Bytes</span>
      <span>ASCII Representation</span>
    </div>

    <div className="space-y-1 overflow-x-auto text-[11px]">
      {flow.hexPayload.map((line, idx) => (
        <div key={idx} className="flex items-center gap-3">
          <span className="text-slate-600 select-none">{formatHexOffset(idx)}</span>
          <span className="text-cyan-300 font-mono tracking-wider flex-1 whitespace-nowrap">{line}</span>
          <span className="text-amber-300 select-all font-mono whitespace-nowrap">{flow.asciiPayload[idx]}</span>
        </div>
      ))}
    </div>
  </div>
);
