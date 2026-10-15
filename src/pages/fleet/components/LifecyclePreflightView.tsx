import type { FC } from 'react';
import { AppliedNotVerifiedCallout } from './AppliedNotVerifiedCallout';
import { LifecyclePipeline } from './LifecyclePipeline';
import { PreflightChecksTable } from './PreflightChecksTable';

export const LifecyclePreflightView: FC = () => (
  <div className="space-y-4">
    <AppliedNotVerifiedCallout />
    <LifecyclePipeline />
    <PreflightChecksTable />
  </div>
);
