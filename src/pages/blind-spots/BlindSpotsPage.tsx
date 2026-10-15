import type { FC } from 'react';
import { PageHeader } from '../../components/page/PageHeader';

export const BlindSpotsPage: FC = () => (
  <div className="p-4 space-y-4">
    <PageHeader title="Blind Spots" description="Where observation or telemetry is missing and what it affects." />
  </div>
);
