import type { FC } from 'react';
import { PageHeader } from '../../components/page/PageHeader';

export const DeploymentPreflightPage: FC = () => (
  <div className="p-4 space-y-4">
    <PageHeader
      title="Deployment & Preflight"
      description="If we deploy this sensor, what will ZeroFrame actually see?"
    />
  </div>
);
