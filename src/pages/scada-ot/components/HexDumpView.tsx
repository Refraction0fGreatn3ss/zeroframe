import type { FC } from 'react';

interface HexDumpViewProps {
  lines: string[];
}

const isByteLine = (idx: number): boolean => idx % 2 === 0;

export const HexDumpView: FC<HexDumpViewProps> = ({ lines }) => (
  <div className="space-y-1.5">
    <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 flex items-center justify-between">
      <span>Modbus / ICS PDU Frame Bytes</span>
      <span className="text-slate-500">Offset 0x0000</span>
    </div>
    <div className="p-2.5 rounded bg-[#05070c] border border-slate-900 space-y-1 font-mono text-[11px]">
      {lines.map((line, idx) => (
        <div key={idx} className={isByteLine(idx) ? 'text-cyan-300' : 'text-slate-500 text-[10px]'}>
          {line}
        </div>
      ))}
    </div>
  </div>
);
