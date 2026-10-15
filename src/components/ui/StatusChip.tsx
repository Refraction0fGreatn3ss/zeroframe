import type { FC } from 'react';

export type StatusTone = 'positive' | 'info' | 'warning' | 'critical' | 'neutral' | 'unknown';

const TONE_CLASSES: Record<StatusTone, string> = {
  positive: 'text-emerald-300 border-emerald-500/30 bg-emerald-500/10',
  info: 'text-cyan-300 border-cyan-500/30 bg-cyan-500/10',
  warning: 'text-amber-300 border-amber-500/30 bg-amber-500/10',
  critical: 'text-rose-300 border-rose-500/30 bg-rose-500/10',
  neutral: 'text-[var(--zf-text-secondary)] border-[var(--zf-border-subtle)] bg-[var(--zf-surface-subtle)]',
  unknown: 'text-slate-400 border-slate-500/30 bg-slate-500/10',
};

const TONE_GLYPHS: Record<StatusTone, string> = {
  positive: '✓',
  info: '●',
  warning: '▲',
  critical: '■',
  neutral: '○',
  unknown: '?',
};

interface StatusChipProps {
  label: string;
  tone: StatusTone;
  title?: string;
}

export const StatusChip: FC<StatusChipProps> = ({ label, tone, title }) => (
  <span
    title={title}
    className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded border text-[10px] font-mono font-semibold uppercase tracking-wide whitespace-nowrap ${TONE_CLASSES[tone]}`}
  >
    <span aria-hidden="true">{TONE_GLYPHS[tone]}</span>
    {label}
  </span>
);
