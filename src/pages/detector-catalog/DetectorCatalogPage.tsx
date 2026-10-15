import type { FC } from 'react';
import { PageHeader } from '../../components/page/PageHeader';

export const DetectorCatalogPage: FC = () => (
  <div className="p-4 space-y-4">
    <PageHeader title="Detector Catalog" description="Every detector, its dependencies and current capability." />
  </div>
);
