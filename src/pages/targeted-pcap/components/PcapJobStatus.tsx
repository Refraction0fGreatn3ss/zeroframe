import type { FC } from 'react';
import type { PcapJobState } from '../targeted-pcap.types';

interface PcapJobStatusProps {
  state: PcapJobState;
}

export const PcapJobStatus: FC<PcapJobStatusProps> = ({ state }) =>
  state === 'CAPTURING' ? (
    <span className="text-cyan-400 font-semibold text-[10px] flex items-center gap-1.5 animate-pulse">
      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
      <span>CAPTURING</span>
    </span>
  ) : (
    <span className="text-emerald-400 font-semibold text-[10px] flex items-center gap-1.5">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
      <span>COMPLETED</span>
    </span>
  );
