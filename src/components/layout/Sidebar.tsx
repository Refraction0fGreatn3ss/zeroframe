import type { LucideIcon } from 'lucide-react';
import { Activity, Database, LayoutDashboard, Search, Settings, Shield, Terminal, Users } from 'lucide-react';
import type React from 'react';
import { NavLink } from 'react-router';
import { NAVIGATION_STRUCTURE, type NavItem } from '../../config/routes';
import { RUNTIME_CONFIG } from '../../config/runtime';
import { type CapabilityState, isNavigable } from '../../lib/capability-state';
import { useAppStore } from '../../stores/app-store';
import { useCapabilityStore } from '../../stores/capability-store';
import { useInvestigationStore } from '../../stores/investigation-store';

const SECTION_ICONS: Record<string, LucideIcon> = {
  Overview: LayoutDashboard,
  Investigate: Search,
  Assurance: Activity,
  Respond: Shield,
  Evidence: Database,
  System: Settings,
  Admin: Users,
};

const CAPABILITY_MARKERS: Partial<Record<CapabilityState, { glyph: string; label: string; className: string }>> = {
  UNAVAILABLE: { glyph: '▲', label: 'Capability unavailable', className: 'text-amber-400' },
  UNKNOWN: { glyph: '?', label: 'Capability support unknown', className: 'text-slate-400' },
  STALE: { glyph: '◷', label: 'Capability state stale', className: 'text-amber-400' },
  LOADING: { glyph: '…', label: 'Checking capability', className: 'text-slate-500' },
};

interface SidebarEntry {
  item: NavItem;
  capability: CapabilityState;
}

const NavEntry: React.FC<SidebarEntry & { badge: number | null }> = ({ item, capability, badge }) => {
  const marker = CAPABILITY_MARKERS[capability];

  return (
    <NavLink
      to={item.path}
      end={item.path === '/overview' || item.path === '/evidence' || item.path === '/admin'}
      title={item.description}
      className={({ isActive }) =>
        `w-full flex items-center justify-between px-3 py-1.5 rounded transition-colors text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--zf-border-focus)] ${
          isActive
            ? 'bg-[var(--zf-nav-active-bg)] text-[var(--zf-text-primary)] font-medium border border-[var(--zf-border-medium)]'
            : 'text-[var(--zf-text-secondary)] hover:text-[var(--zf-text-primary)] hover:bg-[var(--zf-surface-card-hover)]'
        }`
      }
    >
      <span className="truncate text-xs tracking-tight">{item.label}</span>
      <span className="flex items-center gap-1.5 shrink-0">
        {badge !== null && badge > 0 && (
          <span className="font-mono text-[11px] text-rose-400 font-bold tabular-nums">
            {badge}
            <span className="sr-only"> open</span>
          </span>
        )}
        {marker && (
          <span className={`font-mono text-[10px] ${marker.className}`} title={marker.label}>
            <span aria-hidden="true">{marker.glyph}</span>
            <span className="sr-only">{marker.label}</span>
          </span>
        )}
      </span>
    </NavLink>
  );
};

export const Sidebar: React.FC = () => {
  const { setCommandPaletteOpen } = useAppStore();
  const { stateOf } = useCapabilityStore();
  const { incidents } = useInvestigationStore();
  const openIncidentsCount = incidents.filter((incident) => incident.state === 'OPEN').length;

  const badgeFor = (item: NavItem): number | null =>
    item.badgeCountKey === 'openIncidents' ? openIncidentsCount : null;

  return (
    <aside
      aria-label="Primary navigation"
      className="w-60 border-r border-[var(--zf-border-subtle)] bg-[var(--zf-surface-sidebar)] text-[var(--zf-text-primary)] flex flex-col h-[calc(100vh-3rem)] shrink-0 overflow-y-auto font-sans text-xs"
    >
      <div className="py-3 space-y-4">
        {NAVIGATION_STRUCTURE.map((section) => {
          const Icon = SECTION_ICONS[section.title];
          const entries: SidebarEntry[] = section.items
            .map(
              (item): SidebarEntry => ({
                item,
                capability: item.requiredCapability ? stateOf(item.requiredCapability) : 'SUPPORTED',
              }),
            )
            .filter((entry) => isNavigable(entry.capability));
          if (entries.length === 0) return null;

          return (
            <nav key={section.title} aria-label={section.title} className="space-y-1">
              <div className="px-3.5 py-1 text-[11px] font-semibold uppercase tracking-wider flex items-center gap-2 text-[var(--zf-text-secondary)]">
                {Icon && <Icon className="w-3.5 h-3.5 text-[var(--zf-brand-accent)]" aria-hidden="true" />}
                <span>{section.title}</span>
              </div>
              <ul className="space-y-0.5 px-2">
                {entries.map((entry) => (
                  <li key={entry.item.id}>
                    <NavEntry {...entry} badge={badgeFor(entry.item)} />
                  </li>
                ))}
              </ul>
            </nav>
          );
        })}
      </div>

      <div className="mt-auto p-3 border-t border-[var(--zf-border-subtle)] text-[11px] text-[var(--zf-text-muted)] flex items-center justify-between">
        <button
          type="button"
          onClick={() => setCommandPaletteOpen(true)}
          className="flex items-center gap-1.5 hover:text-[var(--zf-text-primary)] transition-colors"
        >
          <Terminal className="w-3 h-3 text-[var(--zf-brand-accent)]" aria-hidden="true" />
          <span>Quick Command</span>
          <kbd className="px-1 bg-[var(--zf-surface-tertiary)] border border-[var(--zf-border-subtle)] rounded font-mono text-[9px]">
            /
          </kbd>
        </button>
        <span className="text-[10px] font-mono">v{RUNTIME_CONFIG.frontendVersion}</span>
      </div>
    </aside>
  );
};
