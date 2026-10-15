import type { FC, ReactNode } from 'react';

interface KpiTileProps {
  label: string;
  value: ReactNode;
  valueClassName: string;
  caption: string;
  captionToneClassName: string;
}

export const KpiTile: FC<KpiTileProps> = ({ label, value, valueClassName, caption, captionToneClassName }) => (
  <div className="p-3 bg-[#090d16] border border-slate-800 rounded">
    <div className="text-[10px] text-slate-500 uppercase tracking-wider">{label}</div>
    <div className={valueClassName}>{value}</div>
    <div className={`text-[10px] ${captionToneClassName} mt-0.5`}>{caption}</div>
  </div>
);
