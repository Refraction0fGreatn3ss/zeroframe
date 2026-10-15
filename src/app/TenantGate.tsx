import type { FC, ReactNode } from 'react';
import { ResourceStateView } from '../components/ui/ResourceStateView';
import { resolveTenant, useTenantStore } from '../stores/tenant-store';

interface TenantGateProps {
  children: ReactNode;
}

export const TenantGate: FC<TenantGateProps> = ({ children }) => {
  const { resolution, issue } = useTenantStore();

  if (resolution === 'RESOLVED') return <>{children}</>;

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-[var(--zf-bg-app)] p-6">
      <div className="w-full max-w-lg">
        <ResourceStateView
          loadState={
            resolution === 'FAILED'
              ? issue?.kind === 'PERMISSION_DENIED'
                ? 'PERMISSION_DENIED'
                : 'UNAVAILABLE'
              : 'LOADING'
          }
          issue={issue}
          onRetry={() => void resolveTenant()}
        >
          {null}
        </ResourceStateView>
      </div>
    </div>
  );
};
