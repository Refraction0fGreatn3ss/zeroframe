import type React from 'react';
import { HeaderActions } from '../../components/page/HeaderActions';
import { PageHeader } from '../../components/page/PageHeader';
import { ExportButton } from '../../components/shared/ExportButton';
import { WitnessPermitCard } from '../../components/shared/WitnessComponents';
import { toPermitCardViewModel } from './execution-permits.utils';
import { useExecutionPermits } from './hooks/use-execution-permits';

export const ExecutionPermitsPage: React.FC = () => {
  const { permits, isLoading, approvingId, approvePermit } = useExecutionPermits();

  return (
    <div className="p-5 space-y-5 text-[#e6edf3] max-w-[1520px] mx-auto font-sans">
      <PageHeader
        title="Execution Permits & Dual Custody"
        description="Cryptographic permits required before any active containment action is executed on the network."
        actions={
          <HeaderActions>
            <ExportButton resourceName="Execution Permits" recordCount={permits.length} data={permits} />
          </HeaderActions>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {permits.length === 0 ? (
          <div className="col-span-2 py-12 text-center text-zinc-500 font-mono text-xs bg-[#101215] border border-[#20242a] rounded">
            {isLoading
              ? 'Querying backend authority for execution permits...'
              : 'No execution permits recorded for this tenant scope.'}
          </div>
        ) : (
          permits.map((permit) => (
            <WitnessPermitCard
              key={permit.id}
              {...toPermitCardViewModel(permit)}
              onApprove={() => approvePermit(permit.id)}
              isApproving={approvingId === permit.id}
            />
          ))
        )}
      </div>
    </div>
  );
};
