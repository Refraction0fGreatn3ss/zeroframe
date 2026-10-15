import type { FC } from 'react';

const LEGEND_ITEMS = [
  { dotClassName: 'bg-rose-500', label: 'Compromised / Malicious' },
  { dotClassName: 'bg-amber-500', label: 'Targeted Crown Jewel' },
  { dotClassName: 'bg-cyan-500', label: 'Internal Host' },
];

export const GraphLegend: FC = () => (
  <div className="absolute bottom-3 left-3 bg-[#080c14]/90 border border-slate-800 rounded p-2 text-[10px] font-mono text-slate-400 flex items-center gap-4">
    {LEGEND_ITEMS.map(({ dotClassName, label }) => (
      <span key={label} className="flex items-center gap-1.5">
        <span className={`w-2 h-2 rounded-full ${dotClassName}`} />
        <span>{label}</span>
      </span>
    ))}
  </div>
);
