import type { FC } from 'react';
import { PageHeader } from '../../components/page/PageHeader';

export const ThreatIntelPage: FC = () => (
  <div className="p-4 space-y-4">
    <PageHeader title="Threat Intelligence" description="Indicators, reputation, local observations and feed health." />
  </div>
);
