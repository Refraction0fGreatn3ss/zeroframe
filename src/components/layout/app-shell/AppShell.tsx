import type React from 'react';
import { useState } from 'react';
import { LockScreenPage } from '../../../pages/lock-screen/LockScreenPage';
import { useAppStore } from '../../../stores/app-store';
import { useAuthStore } from '../../../stores/auth-store';
import { useTenantStore } from '../../../stores/tenant-store';
import { DOMPrivacyShield } from '../../shared/DOMPrivacyShield';
import { GlobalBanner } from '../../shared/GlobalBanner';
import { InactivityWarningModal } from '../../shared/InactivityWarningModal';
import { KeyboardShortcutsModal } from '../../shared/KeyboardShortcutsModal';
import { NotificationCenter } from '../../shared/NotificationCenter';
import { UniversalContextDrawer } from '../../shared/universal-context-drawer/UniversalContextDrawer';
import { BottomStatusBar } from '../BottomStatusBar';
import { CommandPalette } from '../command-palette/CommandPalette';
import { Sidebar } from '../Sidebar';
import { TopBar } from '../top-bar/TopBar';
import { RouteContent } from './RouteContent';
import { TenantSwitchOverlay } from './TenantSwitchOverlay';
import { useGlobalShortcuts } from './use-global-shortcuts';

export const AppShell: React.FC = () => {
  const { currentPath, setCurrentPath, viewMode, isOperatorLocked, setCommandPaletteOpen } = useAppStore();
  const { isLocked } = useAuthStore();
  const { isSwitching, currentTenant } = useTenantStore();

  const [isShortcutsHelpOpen, setIsShortcutsHelpOpen] = useState(false);

  useGlobalShortcuts({ setCurrentPath, setCommandPaletteOpen, setIsShortcutsHelpOpen });

  return (
    <div className="flex flex-col h-screen w-screen bg-[var(--zf-bg-app)] text-[var(--zf-text-primary)] overflow-hidden font-sans">
      <TopBar />
      <GlobalBanner />

      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-[var(--zf-bg-main)]">
          <RouteContent currentPath={currentPath} viewMode={viewMode} />
        </main>

        {isSwitching && <TenantSwitchOverlay tenantName={currentTenant.name} />}
      </div>

      <BottomStatusBar />
      <UniversalContextDrawer />

      <NotificationCenter />
      <CommandPalette />
      {isShortcutsHelpOpen && <KeyboardShortcutsModal onClose={() => setIsShortcutsHelpOpen(false)} />}
      <InactivityWarningModal />
      <DOMPrivacyShield />
      {(isOperatorLocked || isLocked) && <LockScreenPage />}
    </div>
  );
};
