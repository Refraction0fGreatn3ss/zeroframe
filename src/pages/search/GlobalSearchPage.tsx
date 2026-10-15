import type { FC } from 'react';
import { PageHeader } from '../../components/page/PageHeader';

export const GlobalSearchPage: FC = () => (
  <div className="p-4 space-y-4">
    <PageHeader title="Search" description="Search incidents, alerts, assets, flows, indicators, CVEs and evidence." />
  </div>
);
