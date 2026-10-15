import type { FC } from 'react';

const CORNER_BRACKET_PATHS = [
  'M 5 11.5 V 7.5 A 2.5 2.5 0 0 1 7.5 5 H 11.5',
  'M 20.5 5 H 24.5 A 2.5 2.5 0 0 1 27 7.5 V 11.5',
  'M 27 20.5 V 24.5 A 2.5 2.5 0 0 1 24.5 27 H 20.5',
  'M 11.5 27 H 7.5 A 2.5 2.5 0 0 1 5 24.5 V 20.5',
];

const Z_MONOGRAM_PATH = 'M 8.5 8.5 H 23.5 V 12 L 13.2 20 H 23.5 V 23.5 H 8.5 V 20 L 18.8 12 H 8.5 Z';

interface LogoMarkProps {
  className?: string;
  size?: number;
}

export const ZeroFrameLogoMark: FC<LogoMarkProps> = ({ className = 'text-current', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="ZeroFrame Brand Mark"
  >
    {CORNER_BRACKET_PATHS.map((d) => (
      <path key={d} d={d} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    ))}

    <path d={Z_MONOGRAM_PATH} fill="currentColor" />
  </svg>
);

/** Backwards-compatible alias from the product's former ZeroFlash name. */
export const ZeroFlashLogoMark = ZeroFrameLogoMark;

interface WordmarkProps {
  className?: string;
  height?: number;
}

export const ZeroFrameWordmark: FC<WordmarkProps> = ({ className = 'h-4', height = 14 }) => (
  <span
    className={`font-sans font-bold tracking-wider uppercase inline-flex items-center text-current select-none ${className}`}
    style={{ fontSize: `${height}px`, letterSpacing: '0.12em' }}
  >
    ZEROFRAME
  </span>
);

export const ZeroFlashWordmark = ZeroFrameWordmark;

interface BrandProps {
  showWordmark?: boolean;
  markSize?: number;
  wordmarkHeight?: number;
  className?: string;
  showEditionBadge?: boolean;
}

export const ZeroFrameBrand: FC<BrandProps> = ({
  showWordmark = true,
  markSize = 22,
  wordmarkHeight = 13,
  className = '',
  showEditionBadge = true,
}) => (
  <div className={`flex items-center gap-2.5 select-none ${className}`}>
    <ZeroFrameLogoMark size={markSize} className="text-[var(--zf-brand-accent)] shrink-0 transition-colors" />
    {showWordmark && (
      <div className="flex items-center gap-2">
        <span
          className="font-bold tracking-wider uppercase text-[var(--zf-text-primary)] font-sans"
          style={{ fontSize: `${wordmarkHeight}px`, letterSpacing: '0.1em' }}
        >
          ZeroFrame
        </span>
        {showEditionBadge && (
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[var(--zf-surface-tertiary)] border border-[var(--zf-border-subtle)] text-[var(--zf-text-muted)] font-medium">
            1.0
          </span>
        )}
      </div>
    )}
  </div>
);

export const ZeroFlashBrand = ZeroFrameBrand;

export default ZeroFrameBrand;
