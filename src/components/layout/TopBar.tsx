/**
 * High-Density Enterprise TopBar for ZeroFrame NDR/XDR
 * 
 * Complies with Frontend Design Constitution:
 * - Single-line, 3-zone contract: Brand/Tenant | Search Bar | 24H Clock, Security HUD, Notifications & Operator Profile
 * - Guaranteed non-wrapping layout across all viewports (1024px to 4K)
 * - 24-Hour Military/Operations Clock with instant UTC / Local toggle
 * - Clean popover architecture for secondary controls (Themes, SOC View Mode, 100 CVE Defenses)
 */

import React, { useState, useEffect, useRef } from 'react';
import { useAppStore } from '../../stores/app-store';
import { useAuthStore } from '../../stores/auth-store';
import { useTenantStore } from '../../stores/tenant-store';
import { useNotificationStore } from '../../stores/notification-store';
import { useThemeStore } from '../../stores/theme-store';
import { ZeroFlashLogoMark } from '../shared/ZeroFrameLogo';
import { ThemeSwitcher } from '../shared/ThemeSwitcher';
import { CveDefensesModal } from '../shared/CveDefensesModal';
import {
  Search,
  Bell,
  Lock,
  ChevronDown,
  LogOut,
  Shield,
  ShieldCheck,
  Clock,
  RefreshCw,
  EyeOff,
  Laptop,
  Trash2,
  X,
  Layers,
  Activity,
  CheckCircle2,
  Palette,
  Building2,
} from 'lucide-react';

export const TopBar: React.FC = () => {
  const { currentTenant, currentTenantId, tenants, switchTenant, isSwitching } = useTenantStore();
  const {
    viewMode,
    setViewMode,
    setCommandPaletteOpen,
    setNotificationPanelOpen,
    setCurrentPath,
    setOperatorLocked,
    realtimeConnected,
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

  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSessionsModalOpen, setIsSessionsModalOpen] = useState(false);
  const [isSecurityHudOpen, setIsSecurityHudOpen] = useState(false);
  const [isCveModalOpen, setIsCveModalOpen] = useState(false);
  const [remainingMs, setRemainingMs] = useState(getRemainingInactivityMs());
  const [nowDate, setNowDate] = useState(new Date());
  const [clockMode, setClockMode] = useState<'UTC' | 'LOCAL' | 'DUAL'>('UTC');

  const themeMenuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const securityHudRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = () => {
      setNowDate(new Date());
      setRemainingMs(getRemainingInactivityMs());
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (themeMenuRef.current && !themeMenuRef.current.contains(e.target as Node)) {
        setIsThemeMenuOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (securityHudRef.current && !securityHudRef.current.contains(e.target as Node)) {
        setIsSecurityHudOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOpenSessionsModal = () => {
    setIsUserMenuOpen(false);
    refreshActiveSessions();
    setIsSessionsModalOpen(true);
  };

  const remainingSecsTotal = Math.floor(remainingMs / 1000);
  const remMinutes = Math.floor(remainingSecsTotal / 60);
  const remSeconds = remainingSecsTotal % 60;
  const timeFormatted = `${remMinutes}:${remSeconds < 10 ? '0' : ''}${remSeconds}`;

  // 24-Hour Time Strings
  const utcHours = String(nowDate.getUTCHours()).padStart(2, '0');
  const utcMinutes = String(nowDate.getUTCMinutes()).padStart(2, '0');
  const utcSeconds = String(nowDate.getUTCSeconds()).padStart(2, '0');
  const utcTime24 = `${utcHours}:${utcMinutes}:${utcSeconds}`;

  const localHours = String(nowDate.getHours()).padStart(2, '0');
  const localMinutes = String(nowDate.getMinutes()).padStart(2, '0');
  const localSeconds = String(nowDate.getSeconds()).padStart(2, '0');
  const localTime24 = `${localHours}:${localMinutes}:${localSeconds}`;

  return (
    <header className="h-12 border-b border-[var(--zf-border-subtle)] bg-[var(--zf-surface-topbar)] px-3 sm:px-4 flex items-center justify-between text-[var(--zf-text-primary)] z-30 select-none font-sans text-xs shrink-0 shadow-xs">
      {/* Zone 1: Brand & Operational Status (Left) */}
      <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
        <div
          onClick={() => setCurrentPath('/overview')}
          className="flex items-center gap-2 cursor-pointer group pr-2.5 sm:pr-3 border-r border-[var(--zf-border-subtle)]"
          title="ZeroFlash Enterprise 1.0 · Engine: ZeroFrame 3.2 — Return to Command Center"
        >
          <ZeroFlashLogoMark size={20} className="text-[var(--zf-brand-accent)] shrink-0 transition-transform group-hover:scale-105" />
          <span className="font-bold text-xs tracking-wider text-[var(--zf-text-primary)] uppercase">
            ZeroFlash 1.0
          </span>
        </div>

        {/* Tactical Link & Engine Status Badge */}
        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[var(--zf-surface-subtle)] border border-[var(--zf-border-subtle)] font-mono text-[10px] text-cyan-400">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span>10G WIRE TAP</span>
          </div>
          <span className="text-[var(--zf-text-muted)] text-[11px] hidden xl:inline">Enterprise NDR/XDR</span>
        </div>

        {/* Tenant Isolation Selector Dropdown */}
        <div className="flex items-center gap-1.5 pl-2 sm:pl-2.5 border-l border-[var(--zf-border-subtle)]">
          <Building2 className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
          <select
            value={currentTenant?.id || currentTenantId}
            onChange={(e) => switchTenant(e.target.value)}
            disabled={isSwitching}
            className="bg-[var(--zf-surface-subtle)] border border-[var(--zf-border-subtle)] hover:border-slate-700 text-zinc-200 text-xs rounded px-2 py-1 outline-hidden cursor-pointer font-sans"
            title="Switch Active Isolation Tenant"
          >
            {tenants.map((t) => (
              <option key={t.id} value={t.id} className="bg-[#12151a] text-zinc-200">
                {t.name}
              </option>
            ))}
          </select>
          {isSwitching && (
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" title="Switching tenant isolation..." />
          )}
        </div>

        {/* Operating Mode Selector */}
        <div className="hidden lg:flex items-center gap-1.5 pl-2 sm:pl-2.5 border-l border-[var(--zf-border-subtle)]">
          <select
            value={operatingMode === 'MAINTENANCE_MODE' ? 'MAINTENANCE' : operatingMode}
            onChange={(e) => setOperatingMode(e.target.value as any)}
            className={`border text-[11px] rounded px-2 py-1 outline-hidden cursor-pointer font-sans font-medium transition-colors ${
              operatingMode === 'ACTIVE_PROTECTION'
                ? 'bg-emerald-950/40 border-emerald-700/60 text-emerald-300'
                : operatingMode === 'MONITOR_ONLY'
                ? 'bg-blue-950/40 border-blue-700/60 text-blue-300'
                : operatingMode === 'STOPPED'
                ? 'bg-rose-950/40 border-rose-700/60 text-rose-300'
                : 'bg-amber-950/40 border-amber-700/60 text-amber-300'
            }`}
            title="Operating Mode: Active Protection, Monitor Only, Maintenance, or Stopped"
          >
            <option value="ACTIVE_PROTECTION" className="bg-[#0e1614] text-emerald-300">
              Active Protection
            </option>
            <option value="MONITOR_ONLY" className="bg-[#0b1320] text-blue-300">
              Monitor Only
            </option>
            <option value="MAINTENANCE" className="bg-[#1a140a] text-amber-300">
              Maintenance
            </option>
            <option value="STOPPED" className="bg-[#1f0b0d] text-rose-300">
              Stopped
            </option>
          </select>
        </div>
      </div>

      {/* Zone 2: Global Search Command Bar (Center) */}
      <div className="flex-1 max-w-sm lg:max-w-md mx-3 hidden md:block">
        <button
          type="button"
          onClick={() => setCommandPaletteOpen(true)}
          className="w-full h-8 px-3 rounded bg-[var(--zf-surface-subtle)] border border-[var(--zf-border-subtle)] hover:border-slate-700 text-[var(--zf-text-muted)] flex items-center justify-between text-xs cursor-pointer transition-colors group"
        >
          <div className="flex items-center gap-2 truncate">
            <Search className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition-colors shrink-0" />
            <span className="text-slate-500 group-hover:text-slate-300 transition-colors truncate">
              Search entities, IP, alerts, hunt, SCADA...
            </span>
          </div>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono rounded bg-[var(--zf-surface-tertiary)] border border-[var(--zf-border-subtle)] text-slate-400 shrink-0">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Zone 3: Right Action Rail (Disciplined & Compact - Never Wraps) */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
        {/* 1. Themes Tab on Top Bar */}
        <div className="relative" ref={themeMenuRef}>
          <button
            type="button"
            onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[var(--zf-surface-tertiary)] border border-[var(--zf-border-subtle)] hover:border-[var(--zf-border-medium)] text-[var(--zf-text-primary)] transition-colors cursor-pointer text-xs font-sans shadow-xs"
            title={`Current Theme: ${currentThemeConfig.name}. Click to switch console themes.`}
            aria-label="Console Appearance Themes"
          >
            <Palette className="w-3.5 h-3.5 text-[var(--zf-brand-accent)] shrink-0" />
            <span className="hidden sm:inline font-medium text-[11px] text-[var(--zf-text-primary)]">
              {currentThemeConfig.name}
            </span>
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0 border border-black/30 dark:border-white/20"
              style={{ backgroundColor: currentThemeConfig.previewAccent }}
            />
            <ChevronDown className="w-3 h-3 text-[var(--zf-text-muted)] shrink-0" />
          </button>

          {/* Themes Popover Dropdown */}
          {isThemeMenuOpen && (
            <div className="absolute right-0 mt-1.5 w-80 p-2 rounded-lg shadow-2xl bg-[var(--zf-surface-card)] border border-[var(--zf-border-medium)] z-50 animate-in fade-in zoom-in-95 duration-100 text-xs font-sans">
              <div className="px-2.5 py-1.5 border-b border-[var(--zf-border-subtle)] mb-1.5 flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-[var(--zf-text-primary)]">
                  <Palette className="w-3.5 h-3.5 text-[var(--zf-brand-accent)]" />
                  <span>Console Palettes</span>
                </div>
                <span className="text-[10px] font-mono text-[var(--zf-brand-accent)] font-semibold">{themes.length} Master Themes</span>
              </div>

              <div className="space-y-1">
                {themes.map((t) => {
                  const isSelected = t.id === theme;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        setTheme(t.id);
                        setIsThemeMenuOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-2 rounded-md flex items-center gap-3 transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-[var(--zf-nav-active-bg)] text-[var(--zf-text-primary)] font-medium border border-[var(--zf-border-medium)]'
                          : 'text-[var(--zf-text-secondary)] hover:text-[var(--zf-text-primary)] hover:bg-[var(--zf-surface-card-hover)]'
                      }`}
                    >
                      <div
                        className="w-6 h-6 rounded-md border border-black/20 dark:border-white/10 flex items-center justify-center shrink-0 shadow-xs"
                        style={{ backgroundColor: t.previewBg }}
                      >
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: t.previewAccent }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-xs text-[var(--zf-text-primary)]">{t.name}</span>
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[var(--zf-brand-accent)] shrink-0 ml-1" />}
                        </div>
                        <div className="text-[10px] font-mono text-[var(--zf-brand-accent)] font-medium mt-0.5">
                          {t.tagline}
                        </div>
                        <span className="text-[10px] text-[var(--zf-text-muted)] block truncate mt-0.5">
                          {t.description}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* 2. 24-Hour Live Operations Clock */}
        <button
          type="button"
          onClick={() => {
            setClockMode((prev) => (prev === 'UTC' ? 'LOCAL' : prev === 'LOCAL' ? 'DUAL' : 'UTC'));
          }}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[var(--zf-surface-tertiary)] border border-[var(--zf-border-subtle)] hover:border-[var(--zf-border-medium)] text-[var(--zf-text-primary)] transition-colors cursor-pointer text-xs font-mono tabular-nums shadow-xs"
          title="24-Hour Operations Clock (Click to toggle UTC / Local / Dual)"
        >
          <Clock className="w-3.5 h-3.5 text-[var(--zf-brand-accent)] shrink-0" />
          {clockMode === 'UTC' && (
            <span className="font-semibold text-[var(--zf-text-primary)]">
              {utcTime24} <span className="text-[10px] text-[var(--zf-brand-accent)] font-bold">UTC</span>
            </span>
          )}
          {clockMode === 'LOCAL' && (
            <span className="font-semibold text-[var(--zf-text-primary)]">
              {localTime24} <span className="text-[10px] text-[var(--zf-text-muted)] font-bold">LOC</span>
            </span>
          )}
          {clockMode === 'DUAL' && (
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-[var(--zf-text-primary)]">{utcTime24} <span className="text-[10px] text-[var(--zf-brand-accent)] font-bold">UTC</span></span>
              <span className="text-[var(--zf-text-muted)] hidden sm:inline">·</span>
              <span className="text-[var(--zf-text-secondary)] hidden sm:inline">{localTime24} <span className="text-[10px] text-[var(--zf-text-muted)] font-bold">LOC</span></span>
            </div>
          )}
        </button>

        {/* 3. Security HUD & Inactivity Countdown */}
        <div className="relative" ref={securityHudRef}>
          <button
            type="button"
            onClick={() => setIsSecurityHudOpen(!isSecurityHudOpen)}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono rounded border transition-colors cursor-pointer ${
              remainingSecsTotal <= 60
                ? 'bg-rose-500/15 border-rose-500/40 text-rose-400 animate-pulse'
                : remainingSecsTotal <= 180
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                : 'bg-[var(--zf-surface-tertiary)] border-[var(--zf-border-subtle)] hover:border-slate-700 text-slate-300'
            }`}
            title="Session Inactivity HUD & Defense Controls"
          >
            <ShieldCheck
              className={`w-3.5 h-3.5 shrink-0 ${
                remainingSecsTotal <= 60
                  ? 'text-rose-400'
                  : remainingSecsTotal <= 180
                  ? 'text-amber-400'
                  : 'text-emerald-400'
              }`}
            />
            <span className="text-slate-400 hidden lg:inline">{inactivityPolicy}:</span>
            <span className="font-semibold tabular-nums text-[11px]">{timeFormatted}</span>
          </button>

          {/* Security HUD Popover */}
          {isSecurityHudOpen && (
            <div className="absolute right-0 mt-1.5 w-80 p-3.5 rounded-lg shadow-2xl bg-[var(--zf-surface-card)] border border-[var(--zf-border-medium)] z-50 animate-in fade-in zoom-in-95 duration-100 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-[var(--zf-border-subtle)] mb-2.5">
                <div className="flex items-center gap-1.5 font-bold text-[var(--zf-text-primary)]">
                  <Shield className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Session Security Controls</span>
                </div>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold">
                  NIST AC-12
                </span>
              </div>

              {/* Inactivity Policy Selector */}
              <div className="mb-3 space-y-1.5">
                <div className="flex justify-between items-center text-[10px] uppercase font-semibold text-[var(--zf-text-muted)] tracking-wider">
                  <span>Compliance Policy</span>
                  <span className="font-mono text-cyan-400">{inactivityPolicy.toUpperCase()} Strict</span>
                </div>
                <div className="grid grid-cols-3 gap-1 p-1 bg-[var(--zf-surface-subtle)] border border-[var(--zf-border-subtle)] rounded">
                  <button
                    type="button"
                    onClick={() => setInactivityPolicy('5m')}
                    className={`py-1 text-[10px] font-mono font-medium rounded transition-colors cursor-pointer ${
                      inactivityPolicy === '5m'
                        ? 'bg-[var(--zf-brand-accent)] text-white shadow-xs font-bold'
                        : 'text-[var(--zf-text-secondary)] hover:text-[var(--zf-text-primary)]'
                    }`}
                  >
                    5m SCIF
                  </button>
                  <button
                    type="button"
                    onClick={() => setInactivityPolicy('10m')}
                    className={`py-1 text-[10px] font-mono font-medium rounded transition-colors cursor-pointer ${
                      inactivityPolicy === '10m'
                        ? 'bg-[var(--zf-brand-accent)] text-white shadow-xs font-bold'
                        : 'text-[var(--zf-text-secondary)] hover:text-[var(--zf-text-primary)]'
                    }`}
                  >
                    10m FIN
                  </button>
                  <button
                    type="button"
                    onClick={() => setInactivityPolicy('15m')}
                    className={`py-1 text-[10px] font-mono font-medium rounded transition-colors cursor-pointer ${
                      inactivityPolicy === '15m'
                        ? 'bg-[var(--zf-brand-accent)] text-white shadow-xs font-bold'
                        : 'text-[var(--zf-text-secondary)] hover:text-[var(--zf-text-primary)]'
                    }`}
                  >
                    15m NIST
                  </button>
                </div>
              </div>

              <div className="space-y-1.5 pt-1 border-t border-[var(--zf-border-subtle)]">
                <button
                  type="button"
                  onClick={() => {
                    extendSession();
                    setIsSecurityHudOpen(false);
                  }}
                  className="w-full py-1.5 px-2.5 rounded bg-[var(--zf-brand-accent)] hover:opacity-90 text-white font-medium text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-opacity"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Extend Session (+{inactivityPolicy.toUpperCase()})</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsCveModalOpen(true);
                    setIsSecurityHudOpen(false);
                  }}
                  className="w-full py-1.5 px-2.5 rounded bg-[var(--zf-surface-subtle)] hover:bg-[var(--zf-surface-card-hover)] border border-emerald-500/30 text-emerald-400 font-medium text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <ShieldCheck className="w-3 h-3" />
                  <span>Inspect 100 Major Web CVE Shields</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    togglePrivacyShield(true);
                    setIsSecurityHudOpen(false);
                  }}
                  className="w-full py-1.5 px-2.5 rounded bg-[var(--zf-surface-subtle)] hover:bg-[var(--zf-surface-card-hover)] border border-cyan-500/30 text-cyan-400 font-medium text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <EyeOff className="w-3 h-3" />
                  <span>Engage DOM Privacy Shield</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setOperatorLocked(true);
                    lock();
                    setIsSecurityHudOpen(false);
                  }}
                  className="w-full py-1.5 px-2.5 rounded bg-[var(--zf-surface-subtle)] hover:bg-[var(--zf-surface-card-hover)] border border-[var(--zf-border-medium)] text-amber-400 font-medium text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Lock className="w-3 h-3" />
                  <span>Lock Console Now</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Security Activity Log Fast Pivot */}
        <button
          type="button"
          onClick={() => setCurrentPath('/overview/activity-log')}
          className="relative flex items-center gap-1.5 px-2 py-1 rounded bg-[var(--zf-surface-tertiary)] border border-[var(--zf-border-subtle)] hover:border-[var(--zf-border-medium)] text-[var(--zf-text-primary)] transition-colors cursor-pointer text-xs font-mono shadow-xs"
          title="Open Real-Time Security Activity Log (Tracks system events, user logins, and threat alerts)"
          aria-label="Security Activity Log"
        >
          <Activity className="w-3.5 h-3.5 text-[var(--zf-brand-accent)] shrink-0" />
          <span className="hidden xl:inline text-[11px] font-medium">Activity Log</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        </button>

        {/* 3. Notifications Bell */}
        <button
          type="button"
          onClick={() => setNotificationPanelOpen(true)}
          className="relative p-1.5 rounded hover:bg-[var(--zf-surface-card-hover)] text-[var(--zf-text-secondary)] hover:text-[var(--zf-text-primary)] transition-colors cursor-pointer"
          title="Notification Center"
          aria-label="Open notifications"
        >
          <Bell className="w-3.5 h-3.5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500" />
          )}
        </button>

        {/* 4. Operator Profile Menu */}
        <div className="relative" ref={userMenuRef}>
          <button
            type="button"
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-1.5 pl-1.5 pr-2 py-1 rounded hover:bg-[var(--zf-surface-card-hover)] text-[var(--zf-text-secondary)] hover:text-[var(--zf-text-primary)] transition-colors cursor-pointer border border-transparent hover:border-[var(--zf-border-subtle)]"
          >
            <div className="w-5 h-5 rounded-full bg-[var(--zf-surface-tertiary)] border border-[var(--zf-border-subtle)] flex items-center justify-center text-[10px] font-mono text-cyan-300 font-bold">
              {operator?.displayName?.slice(0, 2).toUpperCase() || 'OP'}
            </div>
            <span className="hidden xl:inline text-xs font-medium">{operator?.username || 'sec-operator'}</span>
            <ChevronDown className="w-3 h-3 text-slate-500" />
          </button>

          {/* User Menu Dropdown */}
          {isUserMenuOpen && (
            <div className="absolute right-0 mt-1.5 w-64 p-2 rounded-md shadow-2xl bg-[var(--zf-surface-card)] border border-[var(--zf-border-medium)] z-50 animate-in fade-in zoom-in-95 duration-100 text-xs font-sans">
              <div className="px-2.5 py-2 border-b border-[var(--zf-border-subtle)] mb-1.5">
                <div className="font-semibold text-[var(--zf-text-primary)]">
                  {operator?.displayName || 'Sarah Chen, CISSP'}
                </div>
                <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                  {operator?.role || 'Lead Incident Commander'}
                </div>
                <div className="text-[10px] font-mono text-emerald-400 mt-0.5 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Clearance: {operator?.clearanceLevel || 'TOP_SECRET'}</span>
                </div>
              </div>

              {/* SOC Operating Mode Switcher */}
              <div className="px-2 py-1 space-y-1 border-b border-[var(--zf-border-subtle)] pb-2 mb-1.5">
                <span className="text-[10px] uppercase font-semibold text-slate-400">SOC Console Mode</span>
                <div className="grid grid-cols-2 gap-1 p-0.5 bg-[#060911] border border-slate-800 rounded">
                  <button
                    type="button"
                    onClick={() => {
                      setViewMode('SIMPLE_SOC');
                      setIsUserMenuOpen(false);
                    }}
                    className={`py-1 text-[11px] rounded transition-colors cursor-pointer ${
                      viewMode === 'SIMPLE_SOC'
                        ? 'bg-slate-800 text-cyan-300 font-bold shadow-xs'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Simple SOC
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setViewMode('ANALYST_SOC');
                      setIsUserMenuOpen(false);
                    }}
                    className={`py-1 text-[11px] rounded transition-colors cursor-pointer ${
                      viewMode === 'ANALYST_SOC'
                        ? 'bg-slate-800 text-cyan-300 font-bold shadow-xs'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Analyst SOC
                  </button>
                </div>
              </div>

              {/* Theme Selector */}
              <div className="px-2 py-1 space-y-1 border-b border-[var(--zf-border-subtle)] pb-2 mb-1.5">
                <span className="text-[10px] uppercase font-semibold text-slate-400">Console Appearance</span>
                <ThemeSwitcher variant="full" className="w-full" />
              </div>

              {/* Navigation Shortcuts */}
              <button
                type="button"
                onClick={() => {
                  setIsCveModalOpen(true);
                  setIsUserMenuOpen(false);
                }}
                className="w-full text-left px-2.5 py-1.5 rounded text-slate-300 hover:text-cyan-300 hover:bg-[var(--zf-surface-card-hover)] flex items-center justify-between cursor-pointer"
              >
                <span>100 Web CVE Shield</span>
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              </button>

              <button
                type="button"
                onClick={handleOpenSessionsModal}
                className="w-full text-left px-2.5 py-1.5 rounded text-slate-300 hover:text-slate-100 hover:bg-[var(--zf-surface-card-hover)] flex items-center justify-between cursor-pointer"
              >
                <span>Active Operator Sessions</span>
                <Laptop className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <div className="my-1 border-t border-[var(--zf-border-subtle)]" />

              <button
                type="button"
                onClick={() => {
                  setOperatorLocked(true);
                  setIsUserMenuOpen(false);
                }}
                className="w-full text-left px-2.5 py-1.5 rounded text-amber-400 hover:bg-[var(--zf-surface-card-hover)] flex items-center gap-2 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Lock Console</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsUserMenuOpen(false);
                  logout();
                }}
                className="w-full text-left px-2.5 py-1.5 rounded text-rose-400 hover:bg-[var(--zf-surface-card-hover)] flex items-center gap-2 cursor-pointer mt-0.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Active Sessions Modal */}
      {isSessionsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-sans">
          <div className="bg-[var(--zf-surface-card)] border border-[var(--zf-border-medium)] rounded-lg shadow-2xl max-w-xl w-full p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--zf-border-subtle)]">
              <div className="flex items-center gap-2">
                <Laptop className="w-4 h-4 text-[var(--zf-brand-accent)]" />
                <h2 className="text-sm font-semibold text-[var(--zf-text-primary)]">Active Operator Sessions</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsSessionsModalOpen(false)}
                className="p-1 rounded hover:bg-[var(--zf-surface-tertiary)] text-[var(--zf-text-muted)] hover:text-[var(--zf-text-primary)] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {activeSessions.map((s) => (
                <div
                  key={s.sessionId}
                  className="p-3 rounded bg-[var(--zf-surface-subtle)] border border-[var(--zf-border-subtle)] flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[var(--zf-text-primary)]">{s.deviceLabel || 'SecOps Console'}</span>
                      {s.isCurrent && (
                        <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-mono text-[10px] border border-emerald-500/30">
                          Current Device
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] font-mono text-[var(--zf-text-muted)]">
                      IP: {s.ipAddress} · Active: {new Date(s.lastActiveAt).toLocaleTimeString()}
                    </div>
                  </div>

                  {!s.isCurrent && (
                    <button
                      type="button"
                      onClick={() => revokeRemoteSession(s.sessionId)}
                      className="px-2.5 py-1 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1.5 cursor-pointer text-xs transition-colors"
                      title="Terminate this session immediately"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Revoke</span>
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end border-t border-[var(--zf-border-subtle)]">
              <button
                type="button"
                onClick={() => setIsSessionsModalOpen(false)}
                className="px-3.5 py-1.5 rounded bg-[var(--zf-surface-tertiary)] hover:bg-[var(--zf-surface-card-hover)] text-[var(--zf-text-primary)] text-xs font-medium cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 100 Major Web CVE Defenses Inspector Modal */}
      {isCveModalOpen && <CveDefensesModal onClose={() => setIsCveModalOpen(false)} />}
    </header>
  );
};
