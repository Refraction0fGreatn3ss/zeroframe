import type React from 'react';
import { ExportButton } from '../../components/shared/ExportButton';
import { useDetectionAssuranceStore } from '../../stores/detection-assurance-store';
import { CanaryAuditLog } from './components/CanaryAuditLog';
import { CanaryPrinciplesNotice } from './components/CanaryPrinciplesNotice';
import { CapabilityMatrix } from './components/CapabilityMatrix';

export const DetectionAssurancePage: React.FC = () => {
  const { capabilities, auditLog, isCanaryRunning, triggerManualCanary } = useDetectionAssuranceStore();

  return (
    <div className="p-6 space-y-6 text-zinc-100 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Live Continuous Detection Assurance</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Real-time verification that security detectors are operational right now using non-destructive signed
            canaries.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <ExportButton
            resourceName="Detection Capability Matrix"
            recordCount={capabilities.length}
            data={capabilities}
          />
        </div>
      </div>

      <CanaryPrinciplesNotice />

      <CapabilityMatrix capabilities={capabilities} isCanaryRunning={isCanaryRunning} onAudit={triggerManualCanary} />

      <CanaryAuditLog auditLog={auditLog} />
    </div>
  );
};
