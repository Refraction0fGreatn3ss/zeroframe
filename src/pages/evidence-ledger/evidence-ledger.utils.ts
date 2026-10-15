const MS_PER_MINUTE = 60 * 1000;
const FRESH_THRESHOLD_MS = 30 * MS_PER_MINUTE;
const RECENT_THRESHOLD_MS = 24 * 60 * MS_PER_MINUTE;
const BYTES_PER_MEBIBYTE = 1024 * 1024;

const HASH_PREFIX_LENGTH = 16;
const HASH_SUFFIX_LENGTH = 8;
const PREVIOUS_HASH_PREFIX_LENGTH = 12;

export type FreshnessLabel = 'FRESH' | 'RECENT' | 'ARCHIVED';

export interface Freshness {
  label: FreshnessLabel;
  className: string;
}

export const getFreshness = (sealedAt: string, now: number = Date.now()): Freshness => {
  const ageMs = now - new Date(sealedAt).getTime();
  if (ageMs < FRESH_THRESHOLD_MS) {
    return { label: 'FRESH', className: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
  }
  if (ageMs < RECENT_THRESHOLD_MS) {
    return { label: 'RECENT', className: 'text-sky-400 bg-sky-500/10 border-sky-500/30' };
  }
  return {
    label: 'ARCHIVED',
    className: 'text-[var(--zf-text-muted)] bg-[var(--zf-surface-tertiary)] border-[var(--zf-border-subtle)]',
  };
};

export const formatBlockHash = (hash: string | undefined): string =>
  hash ? `${hash.substring(0, HASH_PREFIX_LENGTH)}...${hash.slice(-HASH_SUFFIX_LENGTH)}` : 'sha256-verified';

export const formatPreviousBlockHash = (hash: string | undefined): string =>
  hash ? `${hash.substring(0, PREVIOUS_HASH_PREFIX_LENGTH)}...` : 'genesis';

export const formatMebibytes = (bytes: number | undefined): string =>
  `${((bytes || 0) / BYTES_PER_MEBIBYTE).toFixed(2)} MB`;
