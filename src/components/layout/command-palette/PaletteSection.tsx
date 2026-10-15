import type React from 'react';

interface PaletteSectionProps {
  title: string;
  /** When provided, the header is accent-colored and shows a match count. */
  matchCount?: number;
  accentClassName?: string;
  children: React.ReactNode;
}

export const PaletteSection: React.FC<PaletteSectionProps> = ({
  title,
  matchCount,
  accentClassName = 'text-zinc-500',
  children,
}) => (
  <div className="py-1">
    {matchCount === undefined ? (
      <div className={`px-2.5 py-1 text-[10px] font-semibold ${accentClassName} uppercase tracking-wider`}>{title}</div>
    ) : (
      <div
        className={`px-2.5 py-1 text-[10px] font-semibold ${accentClassName} uppercase tracking-wider flex items-center justify-between`}
      >
        <span>{title}</span>
        <span className="font-mono">{matchCount} matches</span>
      </div>
    )}
    {children}
  </div>
);
