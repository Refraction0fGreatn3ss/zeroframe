import { Activity, Cpu, ShieldAlert, UserCheck } from 'lucide-react';
import type React from 'react';
import type { useActivityLogStore } from '../../../stores/activity-log-store';
import type { CategoryFilter } from '../security-activity-log.data';
import { ActivityCategoryCard } from './ActivityCategoryCard';
import { LiveIngestIndicator } from './LiveIngestIndicator';

const MUTED_ASIDE_CLASS = 'text-[11px] font-mono text-[var(--zf-text-muted)]';

type ActivityCounts = ReturnType<typeof useActivityLogStore>['counts'];

interface ActivityKpiStripProps {
  counts: ActivityCounts;
  onSelectCategory: (category: CategoryFilter) => void;
}

export const ActivityKpiStrip: React.FC<ActivityKpiStripProps> = ({ counts, onSelectCategory }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
    <ActivityCategoryCard
      icon={Activity}
      iconToneClassName="text-[var(--zf-brand-accent)]"
      title="Total Activity Ingested"
      tag="Live Ring Buffer"
      tagClassName="font-mono text-[10px] text-[var(--zf-text-muted)]"
      value={counts.all}
      valueToneClassName="text-[var(--zf-text-primary)]"
      aside={<LiveIngestIndicator />}
      footer={`${counts.criticalCount} high-priority security exceptions flagged`}
      hoverBorderClassName="hover:border-[var(--zf-border-medium)]"
      onSelect={() => onSelectCategory('ALL')}
    />

    <ActivityCategoryCard
      icon={ShieldAlert}
      iconToneClassName="text-rose-400"
      title="Threat Alerts"
      tag="ATT&CK Aligned"
      tagClassName="font-mono text-[10px] text-rose-400 font-semibold"
      value={counts.threatAlerts}
      valueToneClassName="text-rose-400"
      aside={<span className={MUTED_ASIDE_CLASS}>Active Signals</span>}
      footer="DNS tunnels, Modbus coil attacks, Kerberos anomalies"
      hoverBorderClassName="hover:border-rose-500/40"
      onSelect={() => onSelectCategory('THREAT_ALERT')}
    />

    <ActivityCategoryCard
      icon={UserCheck}
      iconToneClassName="text-sky-400"
      title="User Logins & Auth"
      tag="SSO / SAML 2.0"
      tagClassName="font-mono text-[10px] text-sky-400 font-semibold"
      value={counts.userLogins}
      valueToneClassName="text-sky-400"
      aside={<span className={MUTED_ASIDE_CLASS}>Verified Sessions</span>}
      footer="MFA challenges, SSO assertions, inactivity renewals"
      hoverBorderClassName="hover:border-sky-500/40"
      onSelect={() => onSelectCategory('USER_LOGIN')}
    />

    <ActivityCategoryCard
      icon={Cpu}
      iconToneClassName="text-emerald-400"
      title="System & Optical Events"
      tag="Kernel AF_XDP"
      tagClassName="font-mono text-[10px] text-emerald-400 font-semibold"
      value={counts.systemEvents}
      valueToneClassName="text-emerald-400"
      aside={<span className={MUTED_ASIDE_CLASS}>Hardware Diagnostics</span>}
      footer="Canary verifications, diode heartbeats, tap synchronization"
      hoverBorderClassName="hover:border-emerald-500/40"
      onSelect={() => onSelectCategory('SYSTEM_EVENT')}
    />
  </div>
);
