import type { FC } from 'react';
import { PageHeader } from '../../components/page/PageHeader';

export const TopologyVisibilityPage: FC = () => (
  <div className="p-4 space-y-4">
    <PageHeader title="Topology & Visibility" description="Where ZeroFrame can physically and logically observe." />
  </div>
);
