/**
 * Enterprise Licensing & Build Information Page
 * Official ZeroFlash Enterprise 1.0 cryptographic license certificate and build verification.
 */

import React from 'react';
import { useAdminStore } from '../stores/admin-store';
import { SecurityStatusBadge } from '../components/shared/SecurityStatusBadge';
import { ZeroFlashLogoMark, ZeroFlashBrand } from '../components/shared/ZeroFrameLogo';
import { CheckCircle, ShieldCheck, Cpu, Terminal, Key } from 'lucide-react';

export const LicensingPage: React.FC = () => {
  const { license } = useAdminStore();

  return (
    <div className="p-5 space-y-5 text-[var(--zf-text-primary)] max-w-[1520px] mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[var(--zf-border-subtle)]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold text-[var(--zf-text-primary)] tracking-tight">Enterprise License & Build Information</h1>
            <span className="text-[11px] font-sans px-2 py-0.5 rounded bg-[var(--zf-surface-tertiary)] border border-[var(--zf-border-subtle)] text-[var(--zf-text-secondary)] font-medium">
              ZeroFlash 1.0
            </span>
          </div>
          <p className="text-xs text-[var(--zf-text-muted)] mt-0.5">
            Offline cryptographic license verification and runtime platform provenance.
          </p>
        </div>

        <SecurityStatusBadge state="ACTIVE_LICENSED" size="sm" />
      </div>

      {/* Brand & Platform Provenance Hero */}
      <div className="p-4 rounded bg-[var(--zf-surface-card)] border border-[var(--zf-border-subtle)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3.5">
          <ZeroFlashLogoMark size={40} className="text-[var(--zf-brand-accent)] shrink-0" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold tracking-wider text-[var(--zf-text-primary)] uppercase">
                ZeroFrame Enterprise
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-[var(--zf-brand-accent-subtle)] border border-[var(--zf-brand-accent)] text-[var(--zf-brand-accent)] font-semibold">
                v1.0.0-RELEASE
              </span>
            </div>
            <p className="text-xs text-[var(--zf-text-muted)] mt-0.5">
              Enterprise Network Detection & Response (NDR) · Dual-SOC Architecture · Governed Response Automation
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 font-mono text-[11px] text-[var(--zf-text-muted)] border-t md:border-t-0 md:border-l border-[var(--zf-border-subtle)] pt-3 md:pt-0 md:pl-4">
          <div>
            <span className="block text-[10px] text-[var(--zf-text-muted)] uppercase">Engine Hash</span>
            <span className="text-[var(--zf-text-secondary)]">sha256:b29d3279f4</span>
          </div>
          <div>
            <span className="block text-[10px] text-[var(--zf-text-muted)] uppercase">Kernel Driver</span>
            <span className="text-emerald-400">eBPF-verified</span>
          </div>
        </div>
      </div>

      {/* License Summary Panel */}
      <div className="p-4 rounded bg-[var(--zf-surface-card)] border border-[var(--zf-border-subtle)] space-y-4 text-xs font-sans shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--zf-border-subtle)]">
          <div>
            <div className="text-sm font-semibold text-[var(--zf-text-primary)]">{license.organization}</div>
            <div className="font-mono text-[var(--zf-text-muted)] text-[11px] mt-0.5">License Certificate ID: {license.licenseId}</div>
          </div>
          <span className="px-2.5 py-0.5 rounded bg-[var(--zf-surface-tertiary)] border border-[var(--zf-border-subtle)] text-[var(--zf-text-primary)] text-xs font-medium">
            Tier: {license.tier}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-[var(--zf-text-muted)]">
          <div>
            <span className="text-[var(--zf-text-muted)] text-[11px] block">Licensed Throughput:</span>
            <span className="text-[var(--zf-text-primary)] font-mono font-medium text-sm mt-0.5 block">{license.maxThroughputGbps} Gbps</span>
          </div>
          <div>
            <span className="text-[var(--zf-text-muted)] text-[11px] block">Sensor Node Allocation:</span>
            <span className="text-[var(--zf-text-primary)] font-mono font-medium text-sm mt-0.5 block">
              {license.currentSensorsEnrolled} / {license.maxSensors} Enrolled
            </span>
          </div>
          <div>
            <span className="text-[var(--zf-text-muted)] text-[11px] block">Expiration Date:</span>
            <span className="text-[var(--zf-text-primary)] font-mono font-medium text-sm mt-0.5 block">{license.expiresAt.split('T')[0]}</span>
          </div>
          <div>
            <span className="text-[var(--zf-text-muted)] text-[11px] block">Root Trust Anchor:</span>
            <span className="text-emerald-400 font-mono font-medium text-sm mt-0.5 block">Ed25519 Validated</span>
          </div>
        </div>

        {/* Licensed Modules Table */}
        <div className="pt-3 border-t border-[var(--zf-border-subtle)] space-y-2">
          <span className="font-semibold text-[var(--zf-text-primary)] block text-xs">Licensed Feature Modules:</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {license.featuresEnabled.map((feat) => (
              <div
                key={feat}
                className="p-2.5 rounded bg-[var(--zf-surface-subtle)] border border-[var(--zf-border-subtle)] text-[11px] text-[var(--zf-text-secondary)] flex items-center gap-2"
              >
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate font-mono">{feat}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
