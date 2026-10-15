import type React from 'react';
import { SecurityStatusBadge } from '../../../components/shared/SecurityStatusBadge';
import type { HistoricalState } from '../security-time-machine.data';
import { SnapshotStat } from './SnapshotStat';

interface ReconstructionResultProps {
  state: HistoricalState;
}

export const ReconstructionResult: React.FC<ReconstructionResultProps> = ({ state }) => (
  <div className="p-4 bg-[#101215] border border-[#20242a] rounded space-y-4 text-xs">
    <div className="flex items-center justify-between pb-2 border-b border-[#20242a]">
      <div>
        <h3 className="font-semibold text-zinc-100 text-sm">Authoritative Reconstruction Result</h3>
        <span className="font-mono text-zinc-500 text-[11px]">
          Valid time: {state.validTime} · Transaction time: {state.transactionTime}
        </span>
      </div>
      <SecurityStatusBadge state="HISTORICAL_SNAPSHOT" size="sm" />
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <SnapshotStat label="KNOWN ENTITIES AT TIME T" value={state.knownEntities} />
      <SnapshotStat label="WIRE VISIBILITY COVERAGE" value={`${state.visibilityCoverage}%`} />
      <SnapshotStat label="ACTIVE INCIDENTS THEN" value={state.activeIncidents} />
    </div>

    <div className="p-3 bg-[#131518] rounded border border-[#20242a] space-y-1 text-zinc-400">
      <div className="font-semibold text-zinc-300">Workload State at T: 10.140.2.88 (WKST-CORP-088)</div>
      <div>• State: {state.compromisedEntityIp}</div>
      <div>• Observed VLAN: {state.observedVlan} (Declared and observed matched at this timestamp)</div>
      <div className="text-[11px] text-zinc-500 pt-1 font-mono">
        Verified by Historical Transaction Ledger Block #41908
      </div>
    </div>
  </div>
);
