import { Download, ShieldAlert } from 'lucide-react';
import type { FC } from 'react';

interface IncidentResponseActionsProps {
  onOpenIncidentDossier: () => void;
  onExportPcap: () => void;
}

export const IncidentResponseActions: FC<IncidentResponseActionsProps> = ({ onOpenIncidentDossier, onExportPcap }) => (
  <div className="pt-2 border-t border-slate-800 space-y-2">
    <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
      Immediate Incident Response Actions
    </div>
    <div className="grid grid-cols-2 gap-2">
      <button
        type="button"
        onClick={onOpenIncidentDossier}
        className="py-2 px-3 rounded bg-[#131b2e] hover:bg-[#1b2640] border border-cyan-800/80 text-cyan-300 text-xs font-semibold cursor-pointer flex items-center justify-center gap-1.5 transition-colors"
      >
        <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
        <span>Open Incident Dossier</span>
      </button>

      <button
        type="button"
        onClick={onExportPcap}
        className="py-2 px-3 rounded bg-[#0e1422] hover:bg-[#151e33] border border-slate-700 text-slate-200 text-xs font-semibold cursor-pointer flex items-center justify-center gap-1.5 transition-colors"
      >
        <Download className="w-3.5 h-3.5 text-amber-400" />
        <span>Export PCAP Slice</span>
      </button>
    </div>
  </div>
);
