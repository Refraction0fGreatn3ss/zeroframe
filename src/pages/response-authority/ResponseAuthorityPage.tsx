import type { FC } from 'react';
import { PageHeader } from '../../components/page/PageHeader';

export const ResponseAuthorityPage: FC = () => (
  <div className="p-4 space-y-4">
    <PageHeader
      title="Response Authority"
      description="Each independent condition that governs whether response may act."
    />
  </div>
);
