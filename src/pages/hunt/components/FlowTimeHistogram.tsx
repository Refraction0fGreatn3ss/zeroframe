import { BarChart2 } from 'lucide-react';
import type React from 'react';
import { TIME_HISTOGRAM_DATA } from '../hunt.data';
import { histogramBarClass, histogramBarHeightPct } from '../hunt.utils';

interface FlowTimeHistogramProps {
  onSelectBucket: (time: string) => void;
}

const LEGEND_ITEMS = [
  { swatch: 'bg-cyan-600', label: 'Nominal Traffic' },
  { swatch: 'bg-amber-500', label: 'Elevated Packets' },
  { swatch: 'bg-rose-500', label: 'C2 Burst / Attack Spike' },
];

export const FlowTimeHistogram: React.FC<FlowTimeHistogramProps> = ({ onSelectBucket }) => (
  <div className="p-3.5 bg-[#090d16] border border-slate-800 rounded space-y-2.5">
    <div className="flex items-center justify-between text-xs">
      <div className="flex items-center gap-2">
        <BarChart2 className="w-3.5 h-3.5 text-cyan-400" />
        <span className="font-semibold text-slate-200 font-sans">
          Arkime SPI Session Flow & Throughput Time Histogram
        </span>
        <span className="text-slate-600">·</span>
        <span className="font-mono text-slate-400 text-[11px]">Time Buckets: 10m intervals (Past 60 mins)</span>
      </div>
      <span className="text-[11px] font-mono text-rose-400 font-semibold flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
        <span>Burst Detected at 19:40 UTC</span>
      </span>
    </div>

    <div className="h-32 w-full bg-[#060911] border border-slate-800/80 rounded p-2 flex items-end justify-between gap-3 relative">
      {TIME_HISTOGRAM_DATA.map((bucket) => (
        <div
          key={bucket.time}
          onClick={() => onSelectBucket(bucket.time)}
          className="flex-1 flex flex-col items-center gap-1 h-full justify-end cursor-pointer group"
          title={`Time: ${bucket.time} · Packets: ${bucket.packets} · Traffic: ${bucket.bytesMb} MB · Anomalies: ${bucket.anomalies}`}
        >
          <div className="text-[10px] font-mono text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
            {bucket.packets.toLocaleString()}
          </div>
          <div className="w-full flex items-end justify-center h-20">
            <div
              style={{ height: `${histogramBarHeightPct(bucket)}%` }}
              className={`w-full max-w-[48px] rounded-t transition-all ${histogramBarClass(bucket)}`}
            />
          </div>
          <span className="text-[10px] font-mono text-slate-400 group-hover:text-cyan-300">{bucket.time}</span>
        </div>
      ))}
    </div>

    <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
      <span>Click any time bucket to filter wire sessions to that window</span>
      <div className="flex items-center gap-4">
        {LEGEND_ITEMS.map(({ swatch, label }) => (
          <span key={label} className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-xs ${swatch}`} />
            <span>{label}</span>
          </span>
        ))}
      </div>
    </div>
  </div>
);
