import { ArrowRight } from 'lucide-react';
import type React from 'react';
import type { AnomalySignal } from '../command-center.types';
import { formatAnomalyType, getAnomalyRiskClass } from '../command-center.utils';

interface AnomalySignalCardProps {
  signal: AnomalySignal;
  onSelect: () => void;
}

export const AnomalySignalCard: React.FC<AnomalySignalCardProps> = ({ signal, onSelect }) => (
  <div
    onClick={onSelect}
    className="p-2.5 rounded bg-[#060911] border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer group space-y-1.5 text-xs font-mono"
  >
    <div className="flex items-center justify-between text-[10px]">
      <span className="text-slate-400 font-semibold">{formatAnomalyType(signal.type)}</span>
      <div className="flex items-center gap-1.5">
        <span className={`font-semibold ${getAnomalyRiskClass(signal.risk)}`}>{signal.risk}</span>
        <span className="text-slate-600">·</span>
        <span className="text-slate-500">{signal.timestamp}</span>
      </div>
    </div>

    <div className="text-slate-200 group-hover:text-cyan-300 font-semibold text-[11px] truncate">
      {signal.indicator}
    </div>

    <div className="text-[10px] text-slate-400 font-sans line-clamp-2">{signal.detail}</div>

    <div className="pt-1 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
      <span>{signal.sourceIp}</span>
      <ArrowRight className="w-2.5 h-2.5 text-slate-600" />
      <span>{signal.destination}</span>
    </div>
  </div>
);
