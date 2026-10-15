import { Printer, X } from 'lucide-react';
import type { FC } from 'react';
import { ZeroFlashLogoMark } from '../ZeroFrameLogo';

interface IncidentReportHeaderProps {
  incidentId: string;
  onPrint: () => void;
  onClose: () => void;
}

export const IncidentReportHeader: FC<IncidentReportHeaderProps> = ({ incidentId, onPrint, onClose }) => (
  <div className="p-4 border-b border-[var(--zf-border-subtle)] flex items-center justify-between bg-[var(--zf-surface-topbar)]">
    <div className="flex items-center gap-2">
      <ZeroFlashLogoMark size={20} className="text-[var(--zf-brand-accent)]" />
      <h2 className="text-sm font-semibold tracking-tight">Forensic Case Report — {incidentId}</h2>
    </div>
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onPrint}
        className="px-2.5 py-1 rounded bg-[var(--zf-surface-tertiary)] hover:bg-[var(--zf-surface-card-hover)] border border-[var(--zf-border-subtle)] text-xs flex items-center gap-1.5 cursor-pointer text-[var(--zf-text-secondary)] hover:text-[var(--zf-text-primary)]"
      >
        <Printer className="w-3.5 h-3.5" />
        <span>Print / PDF</span>
      </button>
      <button
        type="button"
        onClick={onClose}
        className="p-1 rounded hover:bg-[var(--zf-surface-tertiary)] text-[var(--zf-text-muted)] hover:text-[var(--zf-text-primary)] cursor-pointer"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  </div>
);
