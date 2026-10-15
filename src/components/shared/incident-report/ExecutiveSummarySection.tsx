import type { FC, ReactNode } from 'react';
import type { SecurityIncident } from '../../../types';
import { REPORT_SECTION_LABEL_CLASS } from './ReportSection';

const SummaryStat: FC<{ label: string; valueClassName: string; value: ReactNode }> = ({
  label,
  valueClassName,
  value,
}) => (
  <div>
    <span className="text-[10px] text-[var(--zf-text-muted)] block">{label}</span>
    <span className={valueClassName}>{value}</span>
  </div>
);

export const ExecutiveSummarySection: FC<{ incident: SecurityIncident }> = ({ incident }) => (
  <div className="p-4 rounded bg-[var(--zf-surface-subtle)] border border-[var(--zf-border-subtle)] space-y-2">
    <div className="flex items-center justify-between">
      <span className={REPORT_SECTION_LABEL_CLASS}>1. Executive Summary</span>
      <span className="font-mono text-[10px] text-[var(--zf-text-muted)]">
        {'Classification: RESTRICTED // SOC LEAD'}
      </span>
    </div>
    <h3 className="text-sm font-bold text-[var(--zf-text-primary)]">{incident.title}</h3>
    <p className="leading-relaxed text-xs">{incident.plainEnglishSummary}</p>
    <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono border-t border-[var(--zf-border-subtle)]">
      <SummaryStat label="Severity" valueClassName="font-bold text-rose-400" value={incident.severity} />
      <SummaryStat label="State" valueClassName="font-semibold text-zinc-200" value={incident.state} />
      <SummaryStat
        label="Confidence"
        valueClassName="font-bold text-emerald-400"
        value={<>{incident.confidenceScore}%</>}
      />
      <SummaryStat label="Fidelity Level" valueClassName="font-semibold text-zinc-200" value={incident.fidelity} />
    </div>
  </div>
);
