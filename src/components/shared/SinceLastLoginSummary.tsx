import { Activity, Clock, EyeOff, Server, ShieldAlert, X } from 'lucide-react';
import { type FC, type ReactNode, useState } from 'react';
import { useAppStore } from '../../stores/app-store';
import { useDashboardStore } from '../../stores/dashboard-store';
import { useInvestigationStore } from '../../stores/investigation-store';

const FALLBACK_NEW_INCIDENTS = 2;
const FALLBACK_CRITICAL_INCIDENTS = 1;

interface DeltaCardProps {
  icon: ReactNode;
  hoverBorderClassName: string;
  headline: ReactNode;
  caption: ReactNode;
  captionColorClassName?: string;
  onClick: () => void;
}

const DeltaCard: FC<DeltaCardProps> = ({
  icon,
  hoverBorderClassName,
  headline,
  caption,
  captionColorClassName = 'text-slate-400',
  onClick,
}) => (
  <div
    onClick={onClick}
    className={`p-2 rounded bg-[#0b1626]/80 border border-slate-800/80 ${hoverBorderClassName} transition-colors cursor-pointer group flex items-start gap-2`}
  >
    {icon}
    <div className="min-w-0">
      <div className="flex items-center gap-1.5 font-medium text-slate-200">{headline}</div>
      <p className={`text-[11px] ${captionColorClassName} font-mono truncate`}>{caption}</p>
    </div>
  </div>
);

export const SinceLastLoginSummary: FC<{ className?: string }> = ({ className = '' }) => {
  const [dismissed, setDismissed] = useState(false);
  const { incidents } = useInvestigationStore();
  const { metrics } = useDashboardStore();
  const { setCurrentPath } = useAppStore();

  if (dismissed) return null;

  const newIncidentsCount = metrics.openIncidentsCount || (incidents ? incidents.length : FALLBACK_NEW_INCIDENTS);
  const criticalCount = metrics.criticalIncidentsCount || FALLBACK_CRITICAL_INCIDENTS;

  return (
    <section
      className={`rounded-lg border border-cyan-900/50 bg-[#09111c]/95 p-3 shadow-lg backdrop-blur-md font-sans text-xs ${className}`}
      aria-label="Since Last Login Summary"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5 pb-2 border-b border-cyan-950/80">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-cyan-950/70 border border-cyan-800/40 text-cyan-400">
            <Clock className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="font-semibold text-slate-100 tracking-tight text-xs">Since Last Session Summary</span>
            <span className="text-slate-400 font-mono text-[11px] ml-2">
              Delta: 2h 45m ago · Operator sess-8841 (Sarah Chen, CISSP)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/40 text-cyan-300">
            SESSION RECONCILIATION
          </span>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="p-1 text-slate-500 hover:text-slate-300 rounded hover:bg-slate-800/60 transition-colors cursor-pointer"
            title="Dismiss delta summary"
            aria-label="Dismiss delta summary"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-2">
        <DeltaCard
          onClick={() => setCurrentPath('/investigate/incidents')}
          hoverBorderClassName="hover:border-rose-900/60"
          icon={<ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />}
          headline={
            <>
              <span className="text-rose-400 font-bold font-mono">+{newIncidentsCount} New</span>
              <span>Incidents</span>
            </>
          }
          caption={<>{criticalCount} Critical (Active C2 Cobalt Strike)</>}
        />

        <DeltaCard
          onClick={() => setCurrentPath('/investigate/network')}
          hoverBorderClassName="hover:border-amber-900/60"
          icon={<EyeOff className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />}
          headline={<span className="text-amber-400 font-bold font-mono">1 Visibility Drop</span>}
          caption="Sensor SENS-HQ-03: Asymmetric tap"
        />

        <DeltaCard
          onClick={() => setCurrentPath('/assurance/canaries')}
          hoverBorderClassName="hover:border-cyan-900/60"
          icon={<Activity className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />}
          headline={
            <>
              <span className="text-cyan-400 font-bold font-mono">Assurance:</span>
              <span className="text-amber-300 font-semibold">{metrics.liveAssuranceState}</span>
            </>
          }
          caption={
            <>
              Canary Jitter: 24ms ({metrics.detectorsHealthy}/{metrics.activeDetectorsTotal} online)
            </>
          }
        />

        <DeltaCard
          onClick={() => setCurrentPath('/investigate/entities')}
          hoverBorderClassName="hover:border-purple-900/60"
          icon={<Server className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />}
          headline={<span className="text-purple-300 font-bold">Top Assets</span>}
          caption="ENT-CORP-088, ENT-SWIFT-GW-01"
          captionColorClassName="text-purple-200"
        />
      </div>
    </section>
  );
};
