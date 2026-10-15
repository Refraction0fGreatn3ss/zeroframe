import type React from 'react';

interface ActivityLogPayloadProps {
  formattedPayload: string;
  isCopied: boolean;
  onCopy: () => void;
}

export const ActivityLogPayload: React.FC<ActivityLogPayloadProps> = ({ formattedPayload, isCopied, onCopy }) => (
  <div className="space-y-1">
    <div className="flex items-center justify-between text-[10px] font-mono text-[var(--zf-text-muted)]">
      <span className="font-semibold uppercase tracking-wider">Raw Telemetry Attributes</span>
      <button type="button" onClick={onCopy} className="text-[var(--zf-brand-accent)] hover:underline cursor-pointer">
        {isCopied ? 'Copied JSON' : 'Copy JSON'}
      </button>
    </div>
    <pre className="p-3 rounded bg-[var(--zf-surface-tertiary)] border border-[var(--zf-border-subtle)] font-mono text-[11px] text-[var(--zf-text-secondary)] overflow-x-auto max-h-48 leading-relaxed">
      {formattedPayload}
    </pre>
  </div>
);
