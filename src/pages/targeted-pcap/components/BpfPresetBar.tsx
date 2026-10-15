import type { FC } from 'react';
import { BPF_PRESETS } from '../targeted-pcap.data';

interface BpfPresetBarProps {
  activeFilter: string;
  onSelect: (bpf: string) => void;
}

export const BpfPresetBar: FC<BpfPresetBarProps> = ({ activeFilter, onSelect }) => (
  <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-800/80">
    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mr-1">Forensic Presets:</span>
    {BPF_PRESETS.map((preset) => (
      <button
        key={preset.label}
        type="button"
        onClick={() => onSelect(preset.bpf)}
        className={`px-2.5 py-1 text-[11px] font-mono rounded border transition-colors cursor-pointer ${
          activeFilter === preset.bpf
            ? 'bg-cyan-950/80 border-cyan-500/50 text-cyan-300 font-semibold'
            : 'bg-[#0e1526] border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
        }`}
      >
        {preset.label}
      </button>
    ))}
  </div>
);
