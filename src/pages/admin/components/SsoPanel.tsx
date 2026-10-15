import type React from 'react';
import { SecurityStatusBadge } from '../../../components/shared/SecurityStatusBadge';
import { AdminSectionCard } from './AdminSectionCard';

export const SsoPanel: React.FC = () => (
  <AdminSectionCard title="Enterprise Identity Providers">
    <div className="p-3 bg-[#131518] rounded border border-[#20242a] space-y-2 text-zinc-300">
      <div className="flex justify-between items-center">
        <span className="font-medium text-zinc-100">SAML 2.0 / OIDC Integration</span>
        <SecurityStatusBadge state="HEALTHY" size="sm" />
      </div>
      <p className="text-zinc-400 text-xs">
        Configured with Okta Enterprise Identity and Microsoft Entra ID. FIDO2 WebAuthn hardware token enforcement
        active.
      </p>
    </div>
  </AdminSectionCard>
);
