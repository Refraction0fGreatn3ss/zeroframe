/**
 * ZeroFrame Official Brand Asset
 * Authentic, clean, enterprise-grade vector brand mark.
 *
 * Design Architecture of the ZeroFrame Mark:
 * - Geometric outer security containment bracket/aperture frame:
 *   Four balanced perimeter frame corners defining the Zero-Trust boundary.
 * - Central precision dynamic monogram / Z-core:
 *   Crisp horizontal crest, clean 45-degree angled traverse beam,
 *   and balanced counter-foundation bar.
 * - Mathematical alignment, crisp anti-aliased rendering, no visual noise,
 *   fully responsive vector geometry scaling seamlessly from 16px to 128px+.
 */
import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

/**
 * Official ZeroFrame Logo Mark
 * Authentic precision SVG vector rendering matching the uploaded brand mark.
 */
export const ZeroFrameLogoMark: React.FC<LogoProps> = ({ className = 'text-current', size = 24 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="ZeroFrame Brand Mark"
    >
      {/* Frame Aperture: Four Precision Corner Brackets */}
      {/* Top-Left Bracket */}
      <path
        d="M 5 11.5 V 7.5 A 2.5 2.5 0 0 1 7.5 5 H 11.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Top-Right Bracket */}
      <path
        d="M 20.5 5 H 24.5 A 2.5 2.5 0 0 1 27 7.5 V 11.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Bottom-Right Bracket */}
      <path
        d="M 27 20.5 V 24.5 A 2.5 2.5 0 0 1 24.5 27 H 20.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Bottom-Left Bracket */}
      <path
        d="M 11.5 27 H 7.5 A 2.5 2.5 0 0 1 5 24.5 V 20.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Central Precision Z Monogram */}
      <path
        d="M 8.5 8.5 H 23.5 V 12 L 13.2 20 H 23.5 V 23.5 H 8.5 V 20 L 18.8 12 H 8.5 Z"
        fill="currentColor"
      />
    </svg>
  );
};

/**
 * Backwards-compatible alias for ZeroFlash
 */
export const ZeroFlashLogoMark = ZeroFrameLogoMark;

/**
 * Enterprise "ZeroFrame" Typographic Wordmark
 */
export const ZeroFrameWordmark: React.FC<{ className?: string; height?: number }> = ({
  className = 'h-4',
  height = 14,
}) => {
  return (
    <span
      className={`font-sans font-bold tracking-wider uppercase inline-flex items-center text-current select-none ${className}`}
      style={{ fontSize: `${height}px`, letterSpacing: '0.12em' }}
    >
      ZEROFRAME
    </span>
  );
};

export const ZeroFlashWordmark = ZeroFrameWordmark;

/**
 * Authoritative ZeroFrame Brand Identity Lockup
 */
export const ZeroFrameBrand: React.FC<{
  showWordmark?: boolean;
  markSize?: number;
  wordmarkHeight?: number;
  className?: string;
  showEditionBadge?: boolean;
}> = ({
  showWordmark = true,
  markSize = 22,
  wordmarkHeight = 13,
  className = '',
  showEditionBadge = true,
}) => {
  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      <ZeroFrameLogoMark
        size={markSize}
        className="text-[var(--zf-brand-accent)] shrink-0 transition-colors"
      />
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
};

export const ZeroFlashBrand = ZeroFrameBrand;

export default ZeroFrameBrand;
