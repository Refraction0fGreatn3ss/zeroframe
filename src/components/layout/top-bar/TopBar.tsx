import type React from 'react';
import { useState } from 'react';
import { useAppStore } from '../../../stores/app-store';
import { useAuthStore } from '../../../stores/auth-store';
import { useNotificationStore } from '../../../stores/notification-store';
import { useTenantStore } from '../../../stores/tenant-store';
import { useThemeStore } from '../../../stores/theme-store';
import { CveDefensesModal } from '../../shared/cve-defenses/CveDefensesModal';
import { ActiveSessionsModal } from './ActiveSessionsModal';
import { ActivityLogButton } from './ActivityLogButton';
import { BrandHomeLink } from './BrandHomeLink';
import { CommandSearchButton } from './CommandSearchButton';
import { NotificationBell } from './NotificationBell';
import { OperatingModeSelect } from './OperatingModeSelect';
import { OperationsClock } from './OperationsClock';
import { OperatorMenu } from './OperatorMenu';
import { SecurityHud } from './SecurityHud';
import { TenantSwitcher } from './TenantSwitcher';
import { ThemeMenu } from './ThemeMenu';
import { useSessionTick } from './use-session-tick';
import { WireTapStatus } from './WireTapStatus';

export const TopBar: React.FC = () => {
  const { currentTenant, currentTenantId, tenants, switchTenant, isSwitching } = useTenantStore();
  const {
    viewMode,
    setViewMode,
    setCommandPaletteOpen,
    setNotificationPanelOpen,
    setCurrentPath,
    setOperatorLocked,
    operatingMode,
    setOperatingMode,
  } = useAppStore();
  const {
    operator,
    logout,
    lock,
    activeSessions,
    refreshActiveSessions,
    revokeRemoteSession,
    extendSession,
    getRemainingInactivityMs,
    inactivityPolicy,
    setInactivityPolicy,
    togglePrivacyShield,
  } = useAuthStore();
  const { theme, setTheme, themes, currentThemeConfig } = useThemeStore();
  const { unreadCount } = useNotificationStore();

  const [isSessionsModalOpen, setIsSessionsModalOpen] = useState(false);
  const [isCveModalOpen, setIsCveModalOpen] = useState(false);
  const { now, remainingMs } = useSessionTick(getRemainingInactivityMs);

  const openCveModal = () => setIsCveModalOpen(true);

  const openSessionsModal = () => {
    refreshActiveSessions();
    setIsSessionsModalOpen(true);
  };

  return (
    <header className="h-12 border-b border-[var(--zf-border-subtle)] bg-[var(--zf-surface-topbar)] px-3 sm:px-4 flex items-center justify-between text-[var(--zf-text-primary)] z-30 select-none font-sans text-xs shrink-0 shadow-xs">
      <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
        <BrandHomeLink onNavigateHome={() => setCurrentPath('/overview')} />
        <WireTapStatus />
        <TenantSwitcher
          selectedTenantId={currentTenant?.id || currentTenantId}
          tenants={tenants}
          isSwitching={isSwitching}
          onSwitchTenant={switchTenant}
        />
        <OperatingModeSelect operatingMode={operatingMode} onChange={setOperatingMode} />
      </div>

      <CommandSearchButton onOpen={() => setCommandPaletteOpen(true)} />

      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
        <ThemeMenu
          activeThemeId={theme}
          themes={themes}
          currentThemeConfig={currentThemeConfig}
          onSelectTheme={setTheme}
        />
        <OperationsClock now={now} />
        <SecurityHud
          remainingMs={remainingMs}
          inactivityPolicy={inactivityPolicy}
          onChangePolicy={setInactivityPolicy}
          onExtendSession={() => extendSession()}
          onInspectCveDefenses={openCveModal}
          onEngagePrivacyShield={() => togglePrivacyShield(true)}
          onLockConsole={() => {
            setOperatorLocked(true);
            lock();
          }}
        />
        <ActivityLogButton onOpen={() => setCurrentPath('/overview/activity-log')} />
        <NotificationBell hasUnread={unreadCount > 0} onOpen={() => setNotificationPanelOpen(true)} />
        <OperatorMenu
          operator={operator}
          viewMode={viewMode}
          onSelectViewMode={setViewMode}
          onInspectCveDefenses={openCveModal}
          onOpenSessions={openSessionsModal}
          onLockConsole={() => setOperatorLocked(true)}
          onSignOut={() => logout()}
        />
      </div>

      {isSessionsModalOpen && (
        <ActiveSessionsModal
          sessions={activeSessions}
          onRevokeSession={revokeRemoteSession}
          onClose={() => setIsSessionsModalOpen(false)}
        />
      )}

      {isCveModalOpen && <CveDefensesModal onClose={() => setIsCveModalOpen(false)} />}
    </header>
  );
};
