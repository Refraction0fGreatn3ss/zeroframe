import type { FC } from 'react';
import { PageHeader } from '../../components/page/PageHeader';

export const TenantAdminPage: FC = () => (
  <div className="p-4 space-y-4">
    <PageHeader title="Tenant Administration" description="Tenants, retention, licensing and health." />
  </div>
);
