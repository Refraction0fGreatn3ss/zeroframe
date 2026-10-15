import { AlertTriangle } from 'lucide-react';
import type { FC } from 'react';
import { KpiTile } from './KpiTile';

export const TelemetryKpiStrip: FC = () => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5 text-xs font-mono">
    <KpiTile
      label="ICS Devices Monitored"
      value="52 PLCs / RTUs"
      valueClassName="text-base font-bold text-slate-100 mt-1 tabular-nums"
      caption="100% Optical Tap Visibility"
      captionToneClassName="text-emerald-400"
    />

    <KpiTile
      label="Physical Data Diode"
      value={
        <>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>1-Way Optical</span>
        </>
      }
      valueClassName="text-base font-bold text-emerald-400 mt-1 flex items-center gap-1.5"
      caption="0 RX Return Channels"
      captionToneClassName="text-slate-400"
    />

    <KpiTile
      label="Modbus/DNP3 Wire Rate"
      value="22,400 msg/s"
      valueClassName="text-base font-bold text-slate-100 mt-1 tabular-nums"
      caption="0 Ring Drops · 0.08ms Jitter"
      captionToneClassName="text-slate-400"
    />

    <KpiTile
      label="SIL-3 Safety Loop (SIS)"
      value="8/8 Armed & Nominal"
      valueClassName="text-base font-bold text-emerald-400 mt-1"
      caption="Triconex Trident Interlock"
      captionToneClassName="text-slate-400"
    />

    <KpiTile
      label="Key Switch Hardware"
      value="1 In REMOTE State"
      valueClassName="text-base font-bold text-amber-400 mt-1"
      caption="RTU-402 Unlocked to Modbus"
      captionToneClassName="text-rose-400"
    />

    <KpiTile
      label="Active OT Anomaly"
      value={
        <>
          <AlertTriangle className="w-4 h-4 text-rose-400" />
          <span>FC05 Breaker Trip</span>
        </>
      }
      valueClassName="text-base font-bold text-rose-400 mt-1 flex items-center gap-1.5"
      caption="MITRE ATT&CK T0855"
      captionToneClassName="text-slate-400"
    />
  </div>
);
