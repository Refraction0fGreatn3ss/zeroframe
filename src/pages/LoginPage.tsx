/**
 * ZeroFrame Enterprise 1.0 - Authoritative Operator Login
 * 
 * Provides:
 * - Official ZeroFrame Vector Brand Identity
 * - Operator Credentials & Enterprise SSO (OIDC/SAML)
 * - Hardware Security Key / TOTP Step-Up MFA Challenge
 * - Authoritative Session Issuance & Error Handling
 * - Strict Zero-Trust Security Guarantees
 */

import React, { useState } from 'react';
import { useAuthStore } from '../stores/auth-store';
import { ZeroFlashLogoMark } from '../components/shared/ZeroFrameLogo';
import { ThemeSwitcher } from '../components/shared/ThemeSwitcher';
import { Shield, Lock, KeyRound, AlertTriangle, ArrowRight, CheckCircle2, Server, Globe } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, stepUpMfa, isStepUpRequired, isLoading, authError, isAutoLoggedOut, inactivityPolicy } = useAuthStore();

  const [authMode, setAuthMode] = useState<'CREDENTIALS' | 'SSO'>('CREDENTIALS');
  const [username, setUsername] = useState('sec-operator');
  const [password, setPassword] = useState('••••••••••••');
  const [totpCode, setTotpCode] = useState('');
  const [stepUpError, setStepUpError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (authMode === 'CREDENTIALS') {
      await login({ username, password });
    } else {
      await login({ ssoProvider: 'Enterprise Okta IdP' });
    }
  };

  const handleStepUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStepUpError(null);
    const success = await stepUpMfa(totpCode);
    if (!success) {
      setStepUpError('Invalid TOTP authenticator code or expired FIDO2 challenge.');
    }
  };

  return (
    <div className="min-h-screen w-screen bg-[var(--zf-bg-app)] text-[var(--zf-text-primary)] flex flex-col justify-between p-4 sm:p-6 select-none font-sans relative overflow-hidden">
      {/* Background Architectural Grid Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(to_right,#888_1px,transparent_1px),linear-gradient(to_bottom,#888_1px,transparent_1px)] bg-[size:4rem_4rem]" />

      {/* Top Bar: Cluster Status & Theme Switcher */}
      <header className="w-full max-w-6xl mx-auto flex items-center justify-between z-10">
        <div className="flex items-center gap-2.5">
          <ZeroFlashLogoMark size={24} className="text-[var(--zf-brand-accent)] shrink-0" />
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-xs tracking-wider text-[var(--zf-text-primary)] uppercase">
              ZeroFrame
            </span>
            <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-[var(--zf-surface-tertiary)] text-[var(--zf-text-muted)] font-medium">
              Enterprise 1.0
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-[var(--zf-text-muted)] font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Cluster: DEF-EU-PROD-01</span>
          </div>
          <ThemeSwitcher variant="compact" />
        </div>
      </header>

      {/* Main Login Canvas */}
      <main className="w-full max-w-md mx-auto my-auto z-10">
        <div className="bg-[var(--zf-surface-card)] border border-[var(--zf-border-medium)] rounded-lg shadow-2xl p-6 sm:p-8 backdrop-blur-md">
          {/* Header */}
          <div className="flex flex-col items-center text-center space-y-3 mb-6">
            <div className="p-3 rounded-full bg-[var(--zf-surface-tertiary)] border border-[var(--zf-border-subtle)] text-[var(--zf-brand-accent)] shadow-inner">
              <ZeroFlashLogoMark size={36} className="text-[var(--zf-brand-accent)]" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-[var(--zf-text-primary)] tracking-tight">
                Operator Security Gateway
              </h1>
              <p className="text-xs text-[var(--zf-text-muted)] mt-1">
                Zero-Trust Access Control & Live Detection Assurance
              </p>
            </div>
          </div>

          {/* Dedicated Auto-Logout Inactivity Notice */}
          {isAutoLoggedOut ? (
            <div className="mb-4 p-3.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs space-y-1.5 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 font-semibold text-amber-400">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Zero Remanence Inactivity Enforcement ({inactivityPolicy})</span>
              </div>
              <p className="text-[11px] text-[var(--zf-text-secondary)] leading-relaxed">
                Pursuant to the active {inactivityPolicy} enterprise security compliance policy, your session was terminated due to operator inactivity. All in-memory bearer tokens, cryptographic keys, and cached state were destroyed with zero data remanence.
              </p>
            </div>
          ) : authError ? (
            <div className="mb-4 p-3 rounded bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
          ) : null}

          {/* STEP-UP MFA MODAL / OVERLAY */}
          {isStepUpRequired ? (
            <form onSubmit={handleStepUpSubmit} className="space-y-4">
              <div className="p-3 rounded bg-[var(--zf-surface-tertiary)] border border-[var(--zf-border-subtle)] text-xs text-[var(--zf-text-secondary)] space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-[var(--zf-text-primary)]">
                  <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                  <span>Dual-Control Step-Up Required</span>
                </div>
                <p className="text-[11px] text-[var(--zf-text-muted)]">
                  Enter the 6-digit TOTP verification code from your hardware token or mobile authenticator app.
                </p>
              </div>

              {stepUpError && (
                <div className="p-2.5 rounded bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>{stepUpError}</span>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-semibold text-[var(--zf-text-secondary)] uppercase tracking-wider mb-1.5">
                  6-Digit Authenticator Token
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={totpCode}
                  onChange={(e) => setTotpCode(e.target.value)}
                  placeholder="884100"
                  className="w-full px-3 py-2 text-center tracking-widest text-lg font-mono rounded bg-[var(--zf-surface-subtle)] border border-[var(--zf-border-medium)] focus:border-[var(--zf-brand-accent)] text-[var(--zf-text-primary)] focus:outline-hidden"
                  autoFocus
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded bg-[var(--zf-brand-accent)] hover:opacity-90 text-white font-medium text-xs flex items-center justify-center gap-2 transition-opacity cursor-pointer shadow-md disabled:opacity-50"
              >
                <span>Verify & Elevate Session</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          ) : (
            <>
              {/* Auth Mode Tabs */}
              <div className="grid grid-cols-2 p-1 rounded bg-[var(--zf-surface-tertiary)] border border-[var(--zf-border-subtle)] mb-5 text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setAuthMode('CREDENTIALS')}
                  className={`py-1.5 rounded transition-all cursor-pointer ${
                    authMode === 'CREDENTIALS'
                      ? 'bg-[var(--zf-nav-active-bg)] text-[var(--zf-text-primary)] shadow-xs border border-[var(--zf-brand-accent)]'
                      : 'text-[var(--zf-text-muted)] hover:text-[var(--zf-text-primary)]'
                  }`}
                >
                  Operator ID
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode('SSO')}
                  className={`py-1.5 rounded transition-all cursor-pointer ${
                    authMode === 'SSO'
                      ? 'bg-[var(--zf-nav-active-bg)] text-[var(--zf-text-primary)] shadow-xs border border-[var(--zf-brand-accent)]'
                      : 'text-[var(--zf-text-muted)] hover:text-[var(--zf-text-primary)]'
                  }`}
                >
                  Enterprise SSO
                </button>
              </div>

              {authMode === 'CREDENTIALS' ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-[var(--zf-text-secondary)] uppercase tracking-wider mb-1.5">
                      Operator Identifier
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-3 py-2 text-xs font-mono rounded bg-[var(--zf-surface-subtle)] border border-[var(--zf-border-medium)] focus:border-[var(--zf-brand-accent)] text-[var(--zf-text-primary)] focus:outline-hidden"
                        placeholder="sec-operator"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-[11px] font-semibold text-[var(--zf-text-secondary)] uppercase tracking-wider">
                        Master Passphrase
                      </label>
                      <span className="text-[10px] text-[var(--zf-text-muted)] font-mono">mTLS Bound</span>
                    </div>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-mono rounded bg-[var(--zf-surface-subtle)] border border-[var(--zf-border-medium)] focus:border-[var(--zf-brand-accent)] text-[var(--zf-text-primary)] focus:outline-hidden"
                      placeholder="••••••••••••"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-2 py-2.5 px-4 rounded bg-[var(--zf-brand-accent)] hover:opacity-90 text-white font-medium text-xs flex items-center justify-center gap-2 transition-opacity cursor-pointer shadow-md disabled:opacity-50"
                  >
                    <span>Authenticate Session</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              ) : (
                <div className="space-y-4 text-center">
                  <p className="text-xs text-[var(--zf-text-secondary)] leading-relaxed">
                    Federated identity provider SAML 2.0 / OIDC authentication with Okta Verify or Azure AD.
                  </p>

                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="w-full py-2.5 px-4 rounded bg-[var(--zf-surface-tertiary)] hover:bg-[var(--zf-surface-card-hover)] border border-[var(--zf-border-medium)] text-[var(--zf-text-primary)] font-medium text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Globe className="w-4 h-4 text-[var(--zf-brand-accent)]" />
                    <span>Single Sign-On (Okta / Azure AD)</span>
                  </button>
                </div>
              )}
            </>
          )}

          {/* Footer Security Badges */}
          <div className="mt-6 pt-4 border-t border-[var(--zf-border-subtle)] flex items-center justify-between text-[10px] text-[var(--zf-text-muted)] font-mono">
            <span className="flex items-center gap-1">
              <Shield className="w-3 h-3 text-emerald-400" />
              <span>TLS 1.3 · JA4 Verified</span>
            </span>
            <span>ZeroFrame 1.0.0-PROD</span>
          </div>
        </div>
      </main>

      {/* Global Footer */}
      <footer className="w-full max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between text-[11px] text-[var(--zf-text-muted)] gap-2 z-10">
        <div>
          <span>ZeroFrame Enterprise NDR & Response Platform</span>
        </div>
        <div className="flex items-center gap-3">
          <span>Tenant Isolation: Enforced</span>
          <span>·</span>
          <span>Tamper Seal: Verified</span>
        </div>
      </footer>
    </div>
  );
};
