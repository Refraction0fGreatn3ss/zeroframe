import { FileText } from 'lucide-react';
import type React from 'react';
import { ExportButton } from '../../../components/shared/ExportButton';
import type { SecurityIncident } from '../../../types';

interface IncidentsHeaderProps {
  incident: SecurityIncident;
  onOpenReport: () => void;
}

export const IncidentsHeader: React.FC<IncidentsHeaderProps> = ({ incident, onOpenReport }) => (
  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
    <div>
      <div className="flex items-center gap-2">
        <h1 className="text-base font-semibold tracking-tight text-slate-100">Incident Investigation Workbench</h1>
        <span className="text-slate-600">·</span>
        <span className="font-mono text-xs text-cyan-400 font-medium">Case Ref: {incident.id}</span>
      </div>
      <p className="text-xs text-slate-400 mt-0.5">
        Cross-layer endpoint & network causality tree, synchronized wire events, and zero-trust containment.
      </p>
    </div>

    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onOpenReport}
        className="px-3 py-1.5 rounded bg-[#0f1422] hover:bg-[#161d30] border border-slate-700 text-xs font-medium flex items-center gap-1.5 cursor-pointer text-slate-200 transition-colors shadow-xs"
      >
        <FileText className="w-3.5 h-3.5 text-cyan-400" />
        <span>Generate Case File</span>
      </button>
      <ExportButton resourceName={`Incident_${incident.id}`} recordCount={1} data={[incident]} />
    </div>
  </div>
);
