import { Lock, ShieldAlert } from 'lucide-react';
import type { FC } from 'react';
import { ExportButton } from '../../../components/shared/ExportButton';
import { OT_PACKETS } from '../scada-ot.data';

interface AirGapControlsProps {
  isDiodeIsolated: boolean;
  isReadOnlyInterlockEngaged: boolean;
  onToggleDiode: () => void;
  onToggleInterlock: () => void;
}

export const AirGapControls: FC<AirGapControlsProps> = ({
  isDiodeIsolated,
  isReadOnlyInterlockEngaged,
  onToggleDiode,
  onToggleInterlock,
}) => (
  <div className="flex flex-wrap items-center gap-2">
    <button
      type="button"
      onClick={onToggleInterlock}
      className={`px-3 py-1.5 rounded text-xs font-mono font-medium transition-colors cursor-pointer flex items-center gap-1.5 border ${
        isReadOnlyInterlockEngaged
          ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 shadow-sm'
          : 'bg-[#080c14] border-slate-700 hover:border-slate-500 text-slate-300'
      }`}
    >
      <Lock className={`w-3.5 h-3.5 ${isReadOnlyInterlockEngaged ? 'text-emerald-400' : 'text-slate-400'}`} />
      <span>{isReadOnlyInterlockEngaged ? 'PLC Interlock: READ-ONLY ACTIVE' : 'Engage PLC Read-Only Lock'}</span>
    </button>

    <button
      type="button"
      onClick={onToggleDiode}
      className={`px-3 py-1.5 rounded text-xs font-mono font-medium transition-colors cursor-pointer flex items-center gap-1.5 border ${
        isDiodeIsolated
          ? 'bg-rose-950/80 border-rose-500 text-rose-300 shadow-sm'
          : 'bg-amber-950/40 border-amber-600/70 hover:bg-amber-900/50 text-amber-300'
      }`}
    >
      <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
      <span>{isDiodeIsolated ? 'Air-Gap: HARDWARE DISCONNECT' : 'Trip Air-Gap Diode'}</span>
    </button>

    <ExportButton resourceName="SCADA_OT_Telemetry" recordCount={OT_PACKETS.length} data={OT_PACKETS} />
  </div>
);
