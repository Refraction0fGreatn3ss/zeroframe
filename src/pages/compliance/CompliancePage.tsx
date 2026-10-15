import type React from 'react';
import { HeaderActions } from '../../components/page/HeaderActions';
import { PageHeader } from '../../components/page/PageHeader';
import { ExportButton } from '../../components/shared/ExportButton';
import { useComplianceStore } from '../../stores/compliance-store';
import { ControlsTable } from './components/ControlsTable';
import { FrameworkSummary } from './components/FrameworkSummary';
import { FrameworkTabs } from './components/FrameworkTabs';

export const CompliancePage: React.FC = () => {
  const { frameworks, controls, selectedFramework, selectFramework } = useComplianceStore();

  return (
    <div className="p-5 space-y-5 text-[#e6edf3] max-w-[1520px] mx-auto font-sans">
      <PageHeader
        title="Compliance Evidence Center"
        description="Technical control audit mappings backed strictly by cryptographically verifiable wire evidence."
        actions={
          <HeaderActions>
            <ExportButton resourceName="Compliance Audit Report" recordCount={controls.length} data={controls} />
          </HeaderActions>
        }
      />

      <FrameworkTabs frameworks={frameworks} selectedFrameworkId={selectedFramework.id} onSelect={selectFramework} />

      <FrameworkSummary framework={selectedFramework} />

      <ControlsTable controls={controls} />
    </div>
  );
};
