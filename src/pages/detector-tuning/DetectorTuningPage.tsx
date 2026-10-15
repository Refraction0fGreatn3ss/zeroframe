import type { FC } from 'react';
import { PageHeader } from '../../components/page/PageHeader';

export const DetectorTuningPage: FC = () => (
  <div className="p-4 space-y-4">
    <PageHeader title="Detector Tuning" description="Audited suppressions, allowlists and thresholds." />
  </div>
);
