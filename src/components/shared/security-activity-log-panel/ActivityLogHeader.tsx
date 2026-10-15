import { Download, Pause, Play, RotateCcw, Trash2 } from 'lucide-react';
import type React from 'react';

interface ActivityLogHeaderProps {
  isStreaming: boolean;
  autoScroll: boolean;
  onToggleStreaming: () => void;
  onToggleAutoScroll: () => void;
  onExportCsv: () => void;
  onResetLogs: () => void;
  onClearLogs: () => void;
}

export const ActivityLogHeader: React.FC<ActivityLogHeaderProps> = ({
  isStreaming,
  autoScroll,
  onToggleStreaming,
  onToggleAutoScroll,
  onExportCsv,
  onResetLogs,
  onClearLogs,
}) => (
  <div className="p-3 border-b border-[var(--zf-border-subtle)] bg-[var(--zf-surface-subtle)] flex flex-wrap items-center justify-between gap-2.5">
    <div className="flex items-center gap-2.5">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-[var(--zf-brand-accent)] shrink-0" />
        <h2 className="text-xs font-semibold text-[var(--zf-text-primary)] uppercase tracking-wider">
          Security Activity Log
        </h2>
      </div>

      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded border border-[var(--zf-border-subtle)] bg-[var(--zf-surface-tertiary)] text-[10px] font-mono">
        {isStreaming ? (
          <>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-emerald-400 font-semibold">LIVE STREAMING</span>
            <span className="text-[var(--zf-text-muted)]">· 1.2 evt/s</span>
          </>
        ) : (
          <>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span className="text-amber-400 font-semibold">PAUSED</span>
          </>
        )}
      </div>
    </div>

    <div className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={onToggleStreaming}
        className={`px-2 py-1 rounded border text-[11px] font-mono flex items-center gap-1 cursor-pointer transition-colors ${
          isStreaming
            ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
            : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
        }`}
        title={isStreaming ? 'Pause live ingestion' : 'Resume live ingestion'}
      >
        {isStreaming ? (
          <>
            <Pause className="w-3 h-3" />
            <span>Pause Stream</span>
          </>
        ) : (
          <>
            <Play className="w-3 h-3" />
            <span>Resume Live</span>
          </>
        )}
      </button>

      <button
        type="button"
        onClick={onToggleAutoScroll}
        className={`px-2 py-1 rounded border text-[11px] font-mono cursor-pointer transition-colors ${
          autoScroll
            ? 'bg-[var(--zf-brand-accent-subtle)] border-[var(--zf-brand-accent)] text-[var(--zf-brand-accent)] font-semibold'
            : 'border-[var(--zf-border-subtle)] text-[var(--zf-text-muted)] hover:text-[var(--zf-text-primary)]'
        }`}
        title="Auto-scroll to latest events"
      >
        Auto-Scroll: {autoScroll ? 'ON' : 'OFF'}
      </button>

      <button
        type="button"
        onClick={onExportCsv}
        className="p-1.5 rounded border border-[var(--zf-border-subtle)] hover:border-[var(--zf-border-medium)] text-[var(--zf-text-secondary)] hover:text-[var(--zf-text-primary)] transition-colors cursor-pointer"
        title="Export visible activity logs to CSV"
      >
        <Download className="w-3 h-3" />
      </button>

      <button
        type="button"
        onClick={onResetLogs}
        className="p-1.5 rounded border border-[var(--zf-border-subtle)] hover:border-[var(--zf-border-medium)] text-[var(--zf-text-secondary)] hover:text-[var(--zf-text-primary)] transition-colors cursor-pointer"
        title="Reset default demo logs"
      >
        <RotateCcw className="w-3 h-3" />
      </button>

      <button
        type="button"
        onClick={onClearLogs}
        className="p-1.5 rounded border border-[var(--zf-border-subtle)] hover:border-rose-500/40 text-[var(--zf-text-muted)] hover:text-rose-400 transition-colors cursor-pointer"
        title="Clear activity log buffer"
      >
        <Trash2 className="w-3 h-3" />
      </button>
    </div>
  </div>
);
