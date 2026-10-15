import type React from 'react';
import { RBAC_ROLES } from '../admin.data';
import { AdminSectionCard } from './AdminSectionCard';

export const RolesPanel: React.FC = () => (
  <AdminSectionCard title="Configured RBAC Roles">
    <div className="space-y-2 text-zinc-300">
      {RBAC_ROLES.map((role) => (
        <div
          key={role.name}
          className="p-3 bg-[#131518] rounded border border-[#20242a] flex justify-between items-center"
        >
          <div>
            <span className="font-medium text-zinc-100 block">{role.name}</span>
            <span className="text-[11px] text-zinc-400">{role.description}</span>
          </div>
          <span className="text-zinc-400 font-mono text-[11px]">{role.assignmentLabel}</span>
        </div>
      ))}
    </div>
  </AdminSectionCard>
);
