import { Send } from 'lucide-react';
import type { FC } from 'react';
import type { SecurityIncident } from '../../../types';
import { CONTAINMENT_ACTIONS } from '../governed-response-studio.data';
import type { ResponseTarget } from '../governed-response-studio.types';
import { getProposalButtonLabel } from '../governed-response-studio.utils';
import { BlastRadiusPolicySummary } from './BlastRadiusPolicySummary';
import { TargetAssetSummary } from './TargetAssetSummary';

interface ActionParametersPanelProps {
  incidents: SecurityIncident[];
  incident: ResponseTarget;
  selectedIncidentId: string;
  onIncidentChange: (incidentId: string) => void;
  selectedAction: string;
  onActionChange: (action: string) => void;
  permitId: string | null;
  isSubmitting: boolean;
  onPropose: () => void;
}

export const ActionParametersPanel: FC<ActionParametersPanelProps> = ({
  incidents,
  incident,
  selectedIncidentId,
  onIncidentChange,
  selectedAction,
  onActionChange,
  permitId,
  isSubmitting,
  onPropose,
}) => (
  <div className="lg:col-span-7 bg-[#101215] border border-[#20242a] rounded p-4 space-y-4 text-xs font-sans">
    <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 border-b border-[#20242a] pb-2">
      Action Parameters
    </h2>

    <div className="space-y-3">
      <div>
        <label className="text-zinc-400 block mb-1">Associated Incident</label>
        <select
          value={selectedIncidentId}
          onChange={(e) => onIncidentChange(e.target.value)}
          className="w-full p-2 bg-[#14171c] border border-[#23272e] rounded text-zinc-200 text-xs focus:outline-hidden"
        >
          {incidents.map((inc) => (
            <option key={inc.id} value={inc.id}>
              {inc.id}: {inc.title}
            </option>
          ))}
        </select>
      </div>

      <TargetAssetSummary incident={incident} />

      <div>
        <label className="text-zinc-400 block mb-1">Containment Action</label>
        <select
          value={selectedAction}
          onChange={(e) => onActionChange(e.target.value)}
          className="w-full p-2 bg-[#14171c] border border-[#23272e] rounded text-zinc-200 text-xs focus:outline-hidden"
        >
          {CONTAINMENT_ACTIONS.map((action) => (
            <option key={action.id} value={action.id}>
              {action.label}
            </option>
          ))}
        </select>
      </div>

      <BlastRadiusPolicySummary />

      <div className="pt-1">
        <button
          type="button"
          onClick={onPropose}
          disabled={isSubmitting}
          className="w-full py-2 rounded bg-[#1c2026] border border-[#2e3440] hover:bg-[#252b35] text-zinc-200 text-xs font-medium cursor-pointer flex items-center justify-center gap-1.5 transition-colors"
        >
          <Send className="w-3.5 h-3.5 text-cyan-400" />
          <span>{getProposalButtonLabel(permitId, isSubmitting)}</span>
        </button>
      </div>
    </div>
  </div>
);
