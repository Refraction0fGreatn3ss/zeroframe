import type { FC } from 'react';
import { PageHeader } from '../../components/page/PageHeader';

export const DiagnosticsPage: FC = () => (
  <div className="p-4 space-y-4">
    <PageHeader
      title="System Diagnostics"
      description="Product component health, resource governor and build identity."
    />
  </div>
);
