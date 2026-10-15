import type { FC } from 'react';
import { PageHeader } from '../../components/page/PageHeader';

export const NetworkExplorerPage: FC = () => (
  <div className="p-4 space-y-4">
    <PageHeader
      title="Network Explorer"
      description="Flow analysis, application intelligence and encrypted DNS visibility."
    />
  </div>
);
