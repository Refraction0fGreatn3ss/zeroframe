import { Play, Radio } from 'lucide-react';
import type { FC } from 'react';
import { PACKET_LIMIT_OPTIONS } from '../targeted-pcap.data';
import { BpfPresetBar } from './BpfPresetBar';

interface CaptureRequestBuilderProps {
  jobName: string;
  bpfFilter: string;
  packetLimit: number;
  isCapturing: boolean;
  onJobNameChange: (value: string) => void;
  onBpfFilterChange: (value: string) => void;
  onPacketLimitChange: (value: number) => void;
  onStartCapture: () => void;
}

export const CaptureRequestBuilder: FC<CaptureRequestBuilderProps> = ({
  jobName,
  bpfFilter,
  packetLimit,
  isCapturing,
  onJobNameChange,
  onBpfFilterChange,
  onPacketLimitChange,
  onStartCapture,
}) => (
  <div className="p-3.5 bg-[#0b101d] border border-slate-800 rounded space-y-3">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
        <Radio className="w-3.5 h-3.5 text-cyan-400" />
        <span>Configure Targeted Wire Slicing Filter</span>
      </div>
      <span className="text-[10px] font-mono text-slate-500">
        Extracts exact forensic bytes into immutable .pcapng bundle
      </span>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-end">
      <div className="lg:col-span-4 space-y-1">
        <label className="text-[10px] font-mono text-slate-400 uppercase font-semibold">Job Reference Label</label>
        <input
          type="text"
          value={jobName}
          onChange={(e) => onJobNameChange(e.target.value)}
          className="w-full px-3 py-1.5 bg-[#080c14] border border-slate-800 rounded font-sans text-xs text-slate-200 focus:outline-hidden focus:border-cyan-500/60"
          placeholder="e.g. Incident Evidence Extraction"
        />
      </div>

      <div className="lg:col-span-5 space-y-1">
        <label className="text-[10px] font-mono text-slate-400 uppercase font-semibold">
          Berkeley Packet Filter (BPF) Syntax
        </label>
        <input
          type="text"
          value={bpfFilter}
          onChange={(e) => onBpfFilterChange(e.target.value)}
          className="w-full px-3 py-1.5 bg-[#080c14] border border-slate-800 rounded font-mono text-xs text-cyan-300 focus:outline-hidden focus:border-cyan-500/60"
          placeholder="e.g. host 10.140.2.88 and port 445"
        />
      </div>

      <div className="lg:col-span-2 space-y-1">
        <label className="text-[10px] font-mono text-slate-400 uppercase font-semibold">Packet Cap</label>
        <select
          value={packetLimit}
          onChange={(e) => onPacketLimitChange(Number(e.target.value))}
          className="w-full px-2 py-1.5 bg-[#080c14] border border-slate-800 rounded font-mono text-xs text-slate-200 focus:outline-hidden focus:border-cyan-500/60"
        >
          {PACKET_LIMIT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="lg:col-span-1">
        <button
          type="button"
          onClick={onStartCapture}
          disabled={isCapturing}
          className="w-full py-1.5 px-3 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 transition-colors shadow-xs"
        >
          <Play className="w-3 h-3" />
          <span>Capture</span>
        </button>
      </div>
    </div>

    <BpfPresetBar activeFilter={bpfFilter} onSelect={onBpfFilterChange} />
  </div>
);
