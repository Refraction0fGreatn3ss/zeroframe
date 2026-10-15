import { Building2 } from 'lucide-react';
import type React from 'react';

interface TenantOption {
  id: string;
  name: string;
}

interface TenantSwitcherProps {
  selectedTenantId: string;
  tenants: TenantOption[];
  isSwitching: boolean;
  onSwitchTenant: (tenantId: string) => void;
}

export const TenantSwitcher: React.FC<TenantSwitcherProps> = ({
  selectedTenantId,
  tenants,
  isSwitching,
  onSwitchTenant,
}) => (
  <div className="flex items-center gap-1.5 pl-2 sm:pl-2.5 border-l border-[var(--zf-border-subtle)]">
    <Building2 className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
    <select
      value={selectedTenantId}
      onChange={(e) => onSwitchTenant(e.target.value)}
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
);
