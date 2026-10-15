import type { LucideIcon } from 'lucide-react';
import { ChevronRight, Database, LayoutDashboard, Search, Settings, Shield, Terminal } from 'lucide-react';
import type React from 'react';
import { NAVIGATION_STRUCTURE } from '../../config/routes';
import { useAppStore } from '../../stores/app-store';
import { useInvestigationStore } from '../../stores/investigation-store';

const SECTION_ICONS: Record<string, LucideIcon> = {
  Overview: LayoutDashboard,
  Investigate: Search,
  Respond: Shield,
  Evidence: Database,
  System: Settings,
};

const SCADA_OT_ACTIVE_ALERTS = 1;

const SectionIcon: React.FC<{ title: string }> = ({ title }) => {
  const Icon = SECTION_ICONS[title];
  return Icon ? <Icon className="w-3.5 h-3.5 text-cyan-400" /> : null;
};

const isNavItemActive = (currentPath: string, itemPath: string) =>
  currentPath === itemPath || (itemPath !== '/overview' && currentPath.startsWith(itemPath));

export const Sidebar: React.FC = () => {
  const { currentPath, setCurrentPath, setCommandPaletteOpen } = useAppStore();
  const { incidents, alerts } = useInvestigationStore();

  const openIncidentsCount = incidents.filter((i) => i.state === 'OPEN').length;

  return (
    <aside className="w-60 border-r border-[var(--zf-border-subtle)] bg-[var(--zf-surface-sidebar)] text-[var(--zf-text-primary)] flex flex-col h-[calc(100vh-3rem)] select-none shrink-0 overflow-y-auto font-sans text-xs">
      <div className="py-3 space-y-4">
        {NAVIGATION_STRUCTURE.map((section) => (
          <div key={section.title} className="space-y-1">
            <div className="px-3.5 py-1 text-[11px] font-semibold text-[var(--zf-text-muted)] uppercase tracking-wider flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SectionIcon title={section.title} />
                <span className="font-semibold tracking-wider text-[var(--zf-text-secondary)]">{section.title}</span>
              </div>
              <span className="text-[10px] font-mono text-[var(--zf-text-muted)] tabular-nums">
                {section.items.length}
              </span>
            </div>

            <nav className="space-y-0.5 px-2">
              {section.items.map((item) => {
                const isActive = isNavItemActive(currentPath, item.path);

                return (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => setCurrentPath(item.path)}
                    className={`w-full flex items-center justify-between px-3 py-1.5 rounded transition-colors text-left cursor-pointer group ${
                      isActive
                        ? 'bg-[var(--zf-nav-active-bg)] text-[var(--zf-text-primary)] font-medium border border-[var(--zf-border-medium)] shadow-xs'
                        : 'text-[var(--zf-text-secondary)] hover:text-[var(--zf-text-primary)] hover:bg-[var(--zf-surface-card-hover)]'
                    }`}
                  >
                    <span className="truncate text-xs tracking-tight">{item.label}</span>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {item.id === 'incidents' && openIncidentsCount > 0 && (
                        <span className="font-mono text-[11px] text-rose-400 font-bold tabular-nums">
                          {openIncidentsCount}
                        </span>
                      )}
                      {item.id === 'alerts' && alerts.length > 0 && (
                        <span className="font-mono text-[10px] text-[var(--zf-text-muted)] tabular-nums">
                          {alerts.length}
                        </span>
                      )}
                      {item.id === 'scada-ot' && (
                        <span className="font-mono text-[10px] text-amber-400 font-bold tabular-nums">
                          {SCADA_OT_ACTIVE_ALERTS}
                        </span>
                      )}
                      {item.id === 'activity-log' && (
                        <span
                          className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"
                          title="Live streaming"
                        />
                      )}
                      <ChevronRight
                        className={`w-3 h-3 transition-transform ${
                          isActive
                            ? 'text-[var(--zf-brand-accent)] translate-x-0.5'
                            : 'text-[var(--zf-text-muted)] group-hover:text-[var(--zf-text-primary)] opacity-0 group-hover:opacity-100'
                        }`}
                      />
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      <div className="mt-auto p-3 border-t border-[var(--zf-border-subtle)] bg-[var(--zf-surface-sidebar)] text-[11px] text-[var(--zf-text-muted)] flex items-center justify-between">
        <button
          type="button"
          onClick={() => setCommandPaletteOpen(true)}
          className="flex items-center gap-1.5 hover:text-[var(--zf-text-primary)] cursor-pointer transition-colors"
        >
          <Terminal className="w-3 h-3 text-[var(--zf-brand-accent)]" />
          <span>Quick Command</span>
          <kbd className="px-1 py-0.2 bg-[var(--zf-surface-tertiary)] border border-[var(--zf-border-subtle)] rounded font-mono text-[9px]">
            /
          </kbd>
        </button>

        <span className="text-[10px] font-mono text-slate-600">v1.0-ent</span>
      </div>
    </aside>
  );
};
