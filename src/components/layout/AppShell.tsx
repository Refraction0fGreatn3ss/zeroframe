/**
 * Master AppShell for ZeroFrame Enterprise 1.0
 * Unifies TopBar, Sidebar, Main Content, BottomStatusBar, Universal Context Drawer, and global dialogs.
 * Enforces Hard Tenant Isolation Transitions, Keyboard-First Navigation & Operator Lock State.
 */

import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../stores/app-store';
import { useAuthStore } from '../../stores/auth-store';
import { useTenantStore } from '../../stores/tenant-store';
import { TopBar } from './TopBar';
import { Sidebar } from './Sidebar';
import { BottomStatusBar } from './BottomStatusBar';
import { GlobalBanner } from '../shared/GlobalBanner';
import { NotificationCenter } from '../shared/NotificationCenter';
import { CommandPalette } from './CommandPalette';
import { LockScreenPage } from '../../pages/LockScreenPage';
import { UniversalContextDrawer } from '../shared/UniversalContextDrawer';
import { KeyboardShortcutsModal } from '../shared/KeyboardShortcutsModal';
import { InactivityWarningModal } from '../shared/InactivityWarningModal';
import { DOMPrivacyShield } from '../shared/DOMPrivacyShield';
import { ZeroFlashLogoMark } from '../shared/ZeroFrameLogo';

// Pages
import { CommandCenterPage } from '../../pages/CommandCenterPage';
import { SecurityActivityLogPage } from '../../pages/SecurityActivityLogPage';
import { SimpleSOCDashboard } from '../../pages/SimpleSOCDashboard';
import { IncidentsPage } from '../../pages/IncidentsPage';
import { AlertsPage } from '../../pages/AlertsPage';
import { AssetsPage } from '../../pages/AssetsPage';
import { EntityGraphPage } from '../../pages/EntityGraphPage';
import { HuntPage } from '../../pages/HuntPage';
import { ScadaOtPage } from '../../pages/ScadaOtPage';
import { SecurityTimeMachinePage } from '../../pages/SecurityTimeMachinePage';
import { GovernedResponseStudioPage } from '../../pages/GovernedResponseStudioPage';
import { QuarantinePage } from '../../pages/QuarantinePage';
import { ExecutionPermitsPage } from '../../pages/ExecutionPermitsPage';
import { RollbackPage } from '../../pages/RollbackPage';
import { EvidenceCenterPage } from '../../pages/EvidenceCenterPage';
import { EvidenceLedgerPage } from '../../pages/EvidenceLedgerPage';
import { TargetedPcapPage } from '../../pages/TargetedPcapPage';
import { VaultPage } from '../../pages/VaultPage';
import { WitnessPlanePage } from '../../pages/WitnessPlanePage';
import { FleetPage } from '../../pages/FleetPage';
import { InspectionIntegrityPage } from '../../pages/InspectionIntegrityPage';
import { DetectionAssurancePage } from '../../pages/DetectionAssurancePage';
import { IntegrationsPage } from '../../pages/IntegrationsPage';
import { CompliancePage } from '../../pages/CompliancePage';
import { LicensingPage } from '../../pages/LicensingPage';
import { AdminPage } from '../../pages/AdminPage';

export const AppShell: React.FC = () => {
  const { currentPath, setCurrentPath, viewMode, isOperatorLocked, setCommandPaletteOpen } = useAppStore();
  const { isLocked } = useAuthStore();
  const { isSwitching, currentTenant } = useTenantStore();

  const [isShortcutsHelpOpen, setIsShortcutsHelpOpen] = useState(false);

  // Keyboard-First Workflow Listener (Section 24)
  useEffect(() => {
    let pendingGKey = false;
    let pendingTimeout: any = null;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore inside text input elements
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
        return;
      }

      if (e.key === '/' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setCommandPaletteOpen(true);
        return;
      }

      if (e.key === '?') {
        e.preventDefault();
        setIsShortcutsHelpOpen((prev) => !prev);
        return;
      }

      if (e.key.toLowerCase() === 'g') {
        pendingGKey = true;
        if (pendingTimeout) clearTimeout(pendingTimeout);
        pendingTimeout = setTimeout(() => {
          pendingGKey = false;
        }, 1200);
        return;
      }

      if (pendingGKey) {
        const k = e.key.toLowerCase();
        if (k === 'i') {
          e.preventDefault();
          setCurrentPath('/investigate/incidents');
        } else if (k === 'a') {
          e.preventDefault();
          setCurrentPath('/investigate/alerts');
        } else if (k === 's') {
          e.preventDefault();
          setCurrentPath('/system/fleet');
        } else if (k === 'c') {
          e.preventDefault();
          setCurrentPath('/overview');
        }
        pendingGKey = false;
        if (pendingTimeout) clearTimeout(pendingTimeout);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setCurrentPath, setCommandPaletteOpen]);

  const renderContent = () => {
    // Overview route checks
    if (currentPath === '/overview/activity-log') return <SecurityActivityLogPage />;
    if (currentPath === '/overview' || currentPath === '/') {
      return viewMode === 'SIMPLE_SOC' ? <SimpleSOCDashboard /> : <CommandCenterPage />;
    }

    // Investigate routes
    if (currentPath === '/investigate/incidents') return <IncidentsPage />;
    if (currentPath === '/investigate/alerts') return <AlertsPage />;
    if (currentPath === '/investigate/assets') return <AssetsPage />;
    if (currentPath === '/investigate/entity-graph') return <EntityGraphPage />;
    if (currentPath === '/investigate/hunt') return <HuntPage />;
    if (currentPath === '/investigate/scada-ot') return <ScadaOtPage />;
    if (currentPath === '/investigate/time-machine') return <SecurityTimeMachinePage />;

    // Respond routes
    if (currentPath === '/respond/studio') return <GovernedResponseStudioPage />;
    if (currentPath === '/respond/quarantine') return <QuarantinePage />;
    if (currentPath === '/respond/permits') return <ExecutionPermitsPage />;
    if (currentPath === '/respond/rollback') return <RollbackPage />;

    // Evidence routes
    if (currentPath === '/evidence/center') return <EvidenceCenterPage />;
    if (currentPath === '/evidence/ledger') return <EvidenceLedgerPage />;
    if (currentPath === '/evidence/pcap') return <TargetedPcapPage />;
    if (currentPath === '/evidence/vault') return <VaultPage />;
    if (currentPath === '/evidence/witness') return <WitnessPlanePage />;

    // System routes
    if (currentPath === '/system/fleet') return <FleetPage />;
    if (currentPath === '/system/inspection') return <InspectionIntegrityPage />;
    if (currentPath === '/system/assurance') return <DetectionAssurancePage />;
    if (currentPath === '/system/integrations') return <IntegrationsPage />;
    if (currentPath === '/system/compliance') return <CompliancePage />;
    if (currentPath === '/system/licensing') return <LicensingPage />;
    if (currentPath === '/system/audit') return <AdminPage />;

    // Default fallback
    return viewMode === 'SIMPLE_SOC' ? <SimpleSOCDashboard /> : <CommandCenterPage />;
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-[var(--zf-bg-app)] text-[var(--zf-text-primary)] overflow-hidden font-sans">
      {/* Top Navigation & Status */}
      <TopBar />
      <GlobalBanner />

      {/* Main App Layout: Sidebar + Dynamic Content Canvas */}
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-[var(--zf-bg-main)]">
          {renderContent()}
        </main>

        {/* Tenant Isolation Switch Transition Overlay */}
        {isSwitching && (
          <div className="absolute inset-0 bg-[var(--zf-bg-app)]/90 backdrop-blur-sm z-40 flex flex-col items-center justify-center p-6 text-center select-none animate-in fade-in duration-100">
            <div className="p-3 rounded-full bg-[var(--zf-surface-tertiary)] border border-[var(--zf-border-medium)] mb-4 animate-spin text-[var(--zf-brand-accent)]">
              <ZeroFlashLogoMark size={32} className="text-[var(--zf-brand-accent)]" />
            </div>
            <h3 className="text-sm font-semibold text-[var(--zf-text-primary)] tracking-tight">
              Executing Hard Tenant Isolation Handshake
            </h3>
            <p className="text-xs text-[var(--zf-text-muted)] mt-1 max-w-sm">
              Aborting in-flight requests, clearing memory stores, and establishing cryptographic boundaries for <span className="font-semibold text-[var(--zf-text-primary)]">{currentTenant.name}</span>.
            </p>
            <div className="mt-4 flex items-center gap-2 text-[10px] font-mono text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Zero Leakage Verification in progress...</span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Telemetry Status Bar */}
      <BottomStatusBar />

      {/* Universal Slide-Over Context Drawer */}
      <UniversalContextDrawer />

      {/* Modals & Overlays */}
      <NotificationCenter />
      <CommandPalette />
      {isShortcutsHelpOpen && (
        <KeyboardShortcutsModal onClose={() => setIsShortcutsHelpOpen(false)} />
      )}
      <InactivityWarningModal />
      <DOMPrivacyShield />
      {(isOperatorLocked || isLocked) && <LockScreenPage />}
    </div>
  );
};
