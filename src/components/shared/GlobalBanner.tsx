import { AlertTriangle, ShieldAlert, WifiOff } from 'lucide-react';
import type { FC, ReactNode } from 'react';
import { useAppStore } from '../../stores/app-store';
import { type KillSwitchState, useKillSwitch } from '../../stores/kill-switch-store';

interface OperationalBanner {
  id: string;
  icon: ReactNode;
  style: string;
  text: string;
  actionText?: string;
  onAction?: () => void;
}

interface BannerConditions {
  killSwitch: KillSwitchState;
  realtimeConnected: boolean;
  operatingMode: string;
  onDisengageKillSwitch: () => void;
}

const getActiveBanners = ({
  killSwitch,
  realtimeConnected,
  operatingMode,
  onDisengageKillSwitch,
}: BannerConditions): OperationalBanner[] => {
  const banners: OperationalBanner[] = [];

  if (killSwitch === 'ENGAGED') {
    banners.push({
      id: 'killswitch',
      icon: <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0" />,
      style: 'bg-[#1a140a] border-b border-[#3d2c14] text-amber-300',
      text: 'Autonomous response kill-switch engaged — Automated containment actions are blocked at the controller.',
      actionText: 'Disengage',
      onAction: onDisengageKillSwitch,
    });
  }

  if (killSwitch === 'UNKNOWN') {
    banners.push({
      id: 'killswitch_unknown',
      icon: <ShieldAlert className="w-3.5 h-3.5 text-slate-400 shrink-0" />,
      style: 'bg-[#101318] border-b border-[#20242a] text-slate-300',
      text: 'Response kill-switch state unknown — The backend has not confirmed it. Response actions stay blocked until it does.',
    });
  }

  if (!realtimeConnected) {
    banners.push({
      id: 'realtime_disconnected',
      icon: <WifiOff className="w-3.5 h-3.5 text-rose-400 shrink-0" />,
      style: 'bg-[#1c0f11] border-b border-[#401a1e] text-rose-300',
      text: 'Realtime connection lost — Live event streaming is paused. Displayed telemetry may be stale.',
    });
  }

  if (operatingMode === 'MONITOR_ONLY') {
    banners.push({
      id: 'monitor_only',
      icon: <AlertTriangle className="w-3.5 h-3.5 text-blue-400 shrink-0" />,
      style: 'bg-[#0e1726] border-b border-[#1b2b48] text-blue-300',
      text: 'Monitor-only mode — Passive wire inspection active. Automated containment disabled by configuration.',
    });
  }

  if (operatingMode === 'MAINTENANCE' || operatingMode === 'MAINTENANCE_MODE') {
    banners.push({
      id: 'maintenance_mode',
      icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />,
      style: 'bg-[#1c140a] border-b border-[#3d2a14] text-amber-300',
      text: 'Maintenance mode engaged — Sensor reconfiguration permitted. Pipeline inspection and detection may be intermittent.',
    });
  }

  if (operatingMode === 'STOPPED') {
    banners.push({
      id: 'stopped_mode',
      icon: <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />,
      style: 'bg-[#210c0e] border-b border-[#4d161a] text-rose-300',
      text: 'ENGINE STOPPED — Wire tap ingestion and detection engine are halted. Monitored traffic is uninspected.',
    });
  }

  return banners;
};

export const GlobalBanner: FC = () => {
  const { operatingMode, realtimeConnected } = useAppStore();
  const { state: killSwitch, requestChange } = useKillSwitch();

  const banners = getActiveBanners({
    killSwitch,
    realtimeConnected,
    operatingMode,
    onDisengageKillSwitch: () => void requestChange(false, 'Operator disengaged from global banner'),
  });

  if (banners.length === 0) return null;

  return (
    <div className="flex flex-col z-30">
      {banners.map((b) => (
        <div key={b.id} className={`px-4 py-1.5 text-xs flex items-center justify-between font-sans ${b.style}`}>
          <div className="flex items-center gap-2">
            {b.icon}
            <span className="text-xs">{b.text}</span>
          </div>
          {b.actionText && (
            <button
              type="button"
              onClick={b.onAction}
              className="ml-3 px-2 py-0.5 rounded text-[11px] font-medium bg-[#3d2c14] hover:bg-[#543d1a] text-amber-200 transition-colors cursor-pointer"
            >
              {b.actionText}
            </button>
          )}
        </div>
      ))}
    </div>
  );
};
