import type { FC } from 'react';
import { PageHeader } from '../../components/page/PageHeader';

export const ReportsPage: FC = () => (
  <div className="p-4 space-y-4">
    <PageHeader title="Reports" description="Backend-generated security, assurance and compliance reports." />
  </div>
);
