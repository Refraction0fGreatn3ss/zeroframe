import type React from 'react';
import { useState } from 'react';
import { HeaderActions } from '../../components/page/HeaderActions';
import { PageHeader } from '../../components/page/PageHeader';
import { ExportButton } from '../../components/shared/ExportButton';
import { useAdminStore } from '../../stores/admin-store';
import type { AdminTab } from './admin.data';
import { DEFAULT_ADMIN_TAB } from './admin.data';
import { AdminTabNav } from './components/AdminTabNav';
import { AuditLogPanel } from './components/AuditLogPanel';
import { RolesPanel } from './components/RolesPanel';
import { SessionsPanel } from './components/SessionsPanel';
import { SsoPanel } from './components/SsoPanel';

export const AdminPage: React.FC = () => {
  const { auditLogs } = useAdminStore();
  const [activeTab, setActiveTab] = useState<AdminTab>(DEFAULT_ADMIN_TAB);

  return (
    <div className="p-5 space-y-5 text-[#e6edf3] max-w-[1520px] mx-auto font-sans">
      <PageHeader
        title="Enterprise Administration"
        description="Operator RBAC governance, enterprise SSO identity bindings, and immutable audit logging."
        actions={
          <HeaderActions>
            <ExportButton resourceName="Admin Audit Trail" recordCount={auditLogs.length} data={auditLogs} />
          </HeaderActions>
        }
      />

      <AdminTabNav activeTab={activeTab} onSelect={setActiveTab} />

      {activeTab === 'AUDIT_LOG' && <AuditLogPanel auditLogs={auditLogs} />}
      {activeTab === 'USERS_ROLES' && <RolesPanel />}
      {activeTab === 'SESSIONS' && <SessionsPanel />}
      {activeTab === 'SSO' && <SsoPanel />}
    </div>
  );
};
