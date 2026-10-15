import type { FC } from 'react';
import { PageHeader } from '../../components/page/PageHeader';

export const ExportJobsPage: FC = () => (
  <div className="p-4 space-y-4">
    <PageHeader title="Export Jobs" description="Backend export jobs, formats and artifact hashes." />
  </div>
);
